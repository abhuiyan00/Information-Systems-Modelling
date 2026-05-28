package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;
import pl.edu.pwr.tkubik.ism.security.CurrentUser;
import pl.edu.pwr.tkubik.ism.service.BuildService;
import pl.edu.pwr.tkubik.ism.service.CollaborationService;

import java.util.*;

@RestController
public class CollaborationController implements CollaborationApi {

    @Autowired
    private CollaborationService collaborationService;

    @Autowired
    private BuildService buildService;

    @Autowired
    private CurrentUser currentUser;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<List<Collaborator>> buildsBuildIdCollaboratorsGet(UUID buildId) {
        if (!currentUser.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<Collaborator> collaborators = collaborationService.findByBuildId(buildId);
        return new ResponseEntity<>(collaborators, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> buildsBuildIdCollaboratorsPost(
            UUID buildId, InviteRequest inviteRequest) {
        if (!currentUser.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Build build = buildService.findById(buildId);
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (!currentUser.getUserId().equals(build.getOwnerId())
                && !currentUser.isAdmin()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        boolean userExists = collaborationService.inviteCollaborator(
                buildId, inviteRequest.getEmail());
        if (!userExists) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
}
