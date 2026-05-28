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
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Lab-3 simplification: invite resolves the email synchronously and adds the
 * CollaboratorEntity in the same call. The email round-trip and the separate
 * /invitations/{token}/accept endpoint that a production system would have
 * are intentionally omitted.
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
}
