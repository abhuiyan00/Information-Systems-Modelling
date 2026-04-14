package pl.edu.pwr.tkubik.ism.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.pwr.tkubik.ism.entity.BuildEntity;
import pl.edu.pwr.tkubik.ism.entity.CollaboratorEntity;
import pl.edu.pwr.tkubik.ism.entity.UserEntity;
import pl.edu.pwr.tkubik.ism.model.Collaborator;
import pl.edu.pwr.tkubik.ism.repository.BuildRepository;
import pl.edu.pwr.tkubik.ism.repository.CollaboratorRepository;
import pl.edu.pwr.tkubik.ism.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Collaborator flow simplified for Lab 3:
 *
 *  - On invite: if the invited email belongs to a registered user and that
 *    user is not yet a collaborator on the build, we create the
 *    CollaboratorEntity immediately. This replaces the email round-trip
 *    that a production system would perform.
 *
 *  - An invitation token is still generated and stored in an in-memory map
 *    so the /invitations/{token}/accept endpoint keeps working (useful if
 *    you later wire up real emails or an integration test).
 *
 *  Net effect: calling POST /builds/{buildId}/collaborators in Swagger is
 *  enough to see a row appear in the COLLABORATORS table.
 */
@Service
@Transactional
public class CollaborationServiceImpl implements CollaborationService {

    @Autowired
    private CollaboratorRepository collaboratorRepository;

    @Autowired
    private BuildRepository buildRepository;

    @Autowired
    private UserRepository userRepository;

    // Short-lived in-memory store: token -> [buildId, email]
    private static final Map<String, String[]> invitationsDb = new ConcurrentHashMap<>();

    // ── Conversion: Entity → DTO ──
    private Collaborator toDTO(CollaboratorEntity entity) {
        Collaborator dto = new Collaborator();
        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
            dto.setUsername(entity.getUser().getUsername());
        }
        if (entity.getRole() != null) {
            dto.setRole(Collaborator.RoleEnum.fromValue(entity.getRole()));
        }
        return dto;
    }

    @Override
    public List<Collaborator> findByBuildId(UUID buildId) {
        return collaboratorRepository.findByBuildId(buildId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean inviteCollaborator(UUID buildId, String email) {
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        Optional<BuildEntity> buildOpt = buildRepository.findById(buildId);

        if (userOpt.isEmpty() || buildOpt.isEmpty()) {
            return false;
        }

        BuildEntity build = buildOpt.get();
        UserEntity user = userOpt.get();

        // Avoid adding the same user twice for the same build.
        boolean alreadyCollaborator =
                collaboratorRepository.findByBuildId(buildId).stream()
                        .anyMatch(c -> c.getUser() != null
                                && user.getId().equals(c.getUser().getId()));

        if (!alreadyCollaborator) {
            CollaboratorEntity entity =
                    new CollaboratorEntity(build, user, "co_author");
            collaboratorRepository.save(entity);
        }

        return true;
    }

    @Override
    public String createInvitationToken(UUID buildId, String email) {
        String token = UUID.randomUUID().toString();
        invitationsDb.put(token, new String[]{buildId.toString(), email});
        return token;
    }

    @Override
    public boolean acceptInvitation(String token) {
        String[] invitation = invitationsDb.get(token);
        if (invitation == null) return false;

        UUID buildId = UUID.fromString(invitation[0]);
        String email = invitation[1];

        Optional<BuildEntity> buildOpt = buildRepository.findById(buildId);
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);

        if (buildOpt.isEmpty() || userOpt.isEmpty()) return false;

        // Avoid duplicates if the invite flow already added the collaborator.
        boolean alreadyCollaborator =
                collaboratorRepository.findByBuildId(buildId).stream()
                        .anyMatch(c -> c.getUser() != null
                                && userOpt.get().getId().equals(c.getUser().getId()));

        if (!alreadyCollaborator) {
            CollaboratorEntity entity = new CollaboratorEntity(
                    buildOpt.get(), userOpt.get(), "co_author");
            collaboratorRepository.save(entity);
        }

        invitationsDb.remove(token);
        return true;
    }
}
