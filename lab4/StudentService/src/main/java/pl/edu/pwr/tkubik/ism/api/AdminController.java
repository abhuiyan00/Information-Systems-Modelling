package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;
import pl.edu.pwr.tkubik.ism.security.CurrentUser;
import pl.edu.pwr.tkubik.ism.service.BuildService;
import pl.edu.pwr.tkubik.ism.service.UserService;

import java.util.*;

@RestController
public class AdminController implements AdminApi {

    @Autowired
    private BuildService buildService;

    @Autowired
    private UserService userService;

    @Autowired
    private CurrentUser currentUser;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    private ResponseEntity<?> requireAdmin() {
        if (!currentUser.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (!currentUser.isAdmin()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return null;
    }

    @Override
    public ResponseEntity<BuildList> adminQueueGet() {
        ResponseEntity<?> denied = requireAdmin();
        if (denied != null) return new ResponseEntity<>(denied.getStatusCode());

        List<Build> pending = buildService.findAll().stream()
                .filter(b -> b.getStatus() == BuildStatus.PENDING_REVIEW)
                .toList();

        BuildList result = new BuildList();
        result.setItems(pending);
        result.setTotal(pending.size());
        result.setPage(1);
        result.setSize(20);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<AdminUsersGet200Response> adminUsersGet(
            Integer page, Integer size) {
        ResponseEntity<?> denied = requireAdmin();
        if (denied != null) return new ResponseEntity<>(denied.getStatusCode());

        List<UserProfile> allUsers = userService.findAll();

        AdminUsersGet200Response response = new AdminUsersGet200Response();
        response.setItems(allUsers);
        response.setTotal(allUsers.size());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Build> buildsBuildIdReviewPost(
            UUID buildId, ReviewRequest reviewRequest) {
        ResponseEntity<?> denied = requireAdmin();
        if (denied != null) return new ResponseEntity<>(denied.getStatusCode());

        Build build = buildService.findById(buildId);
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (reviewRequest.getAction() == ReviewRequest.ActionEnum.REJECT) {
            if (reviewRequest.getReason() == null
                    || reviewRequest.getReason().isBlank()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            build = buildService.updateStatus(buildId, "rejected");
        } else {
            build = buildService.updateStatus(buildId, "published");
        }

        return new ResponseEntity<>(build, HttpStatus.OK);
    }
}
