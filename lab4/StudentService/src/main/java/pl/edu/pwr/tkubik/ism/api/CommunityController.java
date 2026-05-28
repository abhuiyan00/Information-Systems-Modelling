package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;
import pl.edu.pwr.tkubik.ism.security.CurrentUser;
import pl.edu.pwr.tkubik.ism.service.BuildService;
import pl.edu.pwr.tkubik.ism.service.CommentService;
import pl.edu.pwr.tkubik.ism.service.VoteService;

import java.util.*;

@RestController
public class CommunityController implements CommunityApi {

    @Autowired
    private CommentService commentService;

    @Autowired
    private VoteService voteService;

    @Autowired
    private BuildService buildService;

    @Autowired
    private CurrentUser currentUser;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<List<Comment>> buildsBuildIdCommentsGet(UUID buildId) {
        List<Comment> comments = commentService.findByBuildId(buildId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Comment> buildsBuildIdCommentsPost(
            UUID buildId, CommentRequest commentRequest) {
        if (!currentUser.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Comment comment = commentService.addComment(
                buildId, currentUser.getUserId(), commentRequest.getContent());
        if (comment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<VoteResponse> buildsBuildIdVoteGet(UUID buildId) {
        UUID voterId = currentUser.isAuthenticated() ? currentUser.getUserId() : null;
        VoteResponse response = voteService.getVotes(buildId, voterId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<VoteResponse> buildsBuildIdVotePost(
            UUID buildId, VoteRequest voteRequest) {
        if (!currentUser.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Build build = buildService.findById(buildId);
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (currentUser.getUserId().equals(build.getOwnerId())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        VoteResponse response = voteService.castVote(
                buildId, currentUser.getUserId(), voteRequest.getVote().getValue());
        if (response == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
