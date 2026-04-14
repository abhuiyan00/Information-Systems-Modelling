package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;
import pl.edu.pwr.tkubik.ism.service.BuildService;
import pl.edu.pwr.tkubik.ism.service.UserService;

import java.util.*;

@RestController
public class AdminController implements AdminApi {

    @Autowired
    private BuildService buildService;

    @Autowired
    private UserService userService;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<BuildList> adminQueueGet() {
        // Get all builds, filter for pending_review status
        List<Build> allBuilds = buildService.findAll();
        List<Build> pending = allBuilds.stream()
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
        List<UserProfile> allUsers = userService.findAll();

        AdminUsersGet200Response response = new AdminUsersGet200Response();
        response.setItems(allUsers);
        response.setTotal(allUsers.size());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> adminUsersUserIdBanPost(UUID userId) {
        UserProfile user = userService.findById(userId);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // Ban = delete the user (simplified)
        userService.deleteByEmail(user.getEmail());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<Build> buildsBuildIdReviewPost(
            UUID buildId, ReviewRequest reviewRequest) {
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