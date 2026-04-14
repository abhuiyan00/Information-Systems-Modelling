package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;
import pl.edu.pwr.tkubik.ism.service.CollaborationService;

import java.util.*;

@RestController
public class CollaborationController implements CollaborationApi {

    @Autowired
    private CollaborationService collaborationService;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<List<Collaborator>> buildsBuildIdCollaboratorsGet(UUID buildId) {
        List<Collaborator> collaborators = collaborationService.findByBuildId(buildId);
        return new ResponseEntity<>(collaborators, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> buildsBuildIdCollaboratorsPost(
            UUID buildId, InviteRequest inviteRequest) {
        boolean userExists = collaborationService.inviteCollaborator(
                buildId, inviteRequest.getEmail());
        if (!userExists) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        collaborationService.createInvitationToken(buildId, inviteRequest.getEmail());
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @Override
    public ResponseEntity<Void> invitationsTokenAcceptPost(String token) {
        boolean accepted = collaborationService.acceptInvitation(token);
        if (!accepted) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}