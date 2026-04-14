package pl.edu.pwr.tkubik.ism.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;

import java.util.*;

@RestController
public class CollaborationController implements CollaborationApi {

    // Collaborators storage: buildId  →  list of collaborators
    private static Map<String, List<Collaborator>> collaboratorsDb = new HashMap<>();

    // Invitations storage: token  →  { buildId, email }
    private static Map<String, String[]> invitationsDb = new HashMap<>();

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    // GET /builds/{buildId}/collaborators — list collaborators
    @Override
    public ResponseEntity<List<Collaborator>> buildsBuildIdCollaboratorsGet(UUID buildId) {
        List<Collaborator> collaborators =
                collaboratorsDb.getOrDefault(buildId.toString(), new ArrayList<>());
        return new ResponseEntity<>(collaborators, HttpStatus.OK);
    }

    // POST /builds/{buildId}/collaborators — invite a co-author
    @Override
    public ResponseEntity<Void> buildsBuildIdCollaboratorsPost(UUID buildId, InviteRequest inviteRequest) {
        // Check if the email belongs to a registered member
        if (!AuthController.getUsersDb().containsKey(inviteRequest.getEmail())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);  // 400
        }

        // Generate a token and store the invitation
        String token = UUID.randomUUID().toString();
        invitationsDb.put(token, new String[]{ buildId.toString(), inviteRequest.getEmail() });

        return new ResponseEntity<>(HttpStatus.ACCEPTED);  // 202
    }

    // POST /invitations/{token}/accept — accept a collaboration invite
    @Override
    public ResponseEntity<Void> invitationsTokenAcceptPost(String token) {
        String[] invitation = invitationsDb.get(token);
        if (invitation == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);  // 400 — token expired or invalid
        }

        String buildId = invitation[0];
        String email = invitation[1];

        // Find the user profile by email
        UserProfile user = AuthController.getUsersDb().get(email);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Add as collaborator
        Collaborator collaborator = new Collaborator();
        collaborator.setUserId(user.getId());
        collaborator.setUsername(user.getUsername());
        collaborator.setRole(Collaborator.RoleEnum.CO_AUTHOR);

        collaboratorsDb.computeIfAbsent(buildId, k -> new ArrayList<>()).add(collaborator);

        // Remove the used token
        invitationsDb.remove(token);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}