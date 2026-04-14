package pl.edu.pwr.tkubik.ism.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class AdminController implements AdminApi {

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    // GET /admin/queue — list builds pending moderation review
    @Override
    public ResponseEntity<BuildList> adminQueueGet() {
        // Access the shared builds database from BuildsController
        // Filter for PENDING_REVIEW status
        List<Build> pending = BuildsController.getBuildsDb().values().stream()
                .filter(b -> b.getStatus() == BuildStatus.PENDING_REVIEW)
                .collect(Collectors.toList());

        BuildList result = new BuildList();
        result.setItems(pending);
        result.setTotal(pending.size());
        result.setPage(1);
        result.setSize(20);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // GET /admin/users — list all users (admin only)
    @Override
    public ResponseEntity<AdminUsersGet200Response> adminUsersGet(Integer page, Integer size) {
        List<UserProfile> allUsers = new ArrayList<>(AuthController.getUsersDb().values());

        AdminUsersGet200Response response = new AdminUsersGet200Response();
        response.setItems(allUsers);
        response.setTotal(allUsers.size());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // POST /admin/users/{userId}/ban — ban a user account
    @Override
    public ResponseEntity<Void> adminUsersUserIdBanPost(UUID userId) {
        // Look up the user by ID
        UserProfile found = null;
        String foundKey = null;
        for (Map.Entry<String, UserProfile> entry : AuthController.getUsersDb().entrySet()) {
            if (entry.getValue().getId().equals(userId)) {
                found = entry.getValue();
                foundKey = entry.getKey();
                break;
            }
        }

        if (found == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Remove the user (simplified ban)
        AuthController.getUsersDb().remove(foundKey);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // POST /builds/{buildId}/review — admin approve or reject a build
    @Override
    public ResponseEntity<Build> buildsBuildIdReviewPost(UUID buildId, ReviewRequest reviewRequest) {
        Build build = BuildsController.getBuildsDb().get(buildId.toString());
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // If rejecting, reason must be provided
        if (reviewRequest.getAction() == ReviewRequest.ActionEnum.REJECT) {
            if (reviewRequest.getReason() == null || reviewRequest.getReason().isBlank()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            build.setStatus(BuildStatus.REJECTED);
        } else {
            build.setStatus(BuildStatus.PUBLISHED);
        }

        BuildsController.getBuildsDb().put(buildId.toString(), build);

        return new ResponseEntity<>(build, HttpStatus.OK);
    }
}