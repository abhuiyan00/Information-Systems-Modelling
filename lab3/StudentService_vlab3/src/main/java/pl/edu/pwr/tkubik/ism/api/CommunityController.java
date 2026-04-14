package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;
import pl.edu.pwr.tkubik.ism.service.CommentService;
import pl.edu.pwr.tkubik.ism.service.VoteService;

import java.util.*;

@RestController
public class CommunityController implements CommunityApi {

    @Autowired
    private CommentService commentService;

    @Autowired
    private VoteService voteService;

    // Simplified: fixed user ID (no real auth)
    private static final UUID CURRENT_USER_ID =
            UUID.fromString("00000000-0000-0000-0000-000000000001");

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
        Comment comment = commentService.addComment(buildId, commentRequest.getContent());
        if (comment == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<VoteResponse> buildsBuildIdVoteGet(UUID buildId) {
        VoteResponse response = voteService.getVotes(buildId, CURRENT_USER_ID);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<VoteResponse> buildsBuildIdVotePost(
            UUID buildId, VoteRequest voteRequest) {
        VoteResponse response = voteService.castVote(
                buildId, CURRENT_USER_ID, voteRequest.getVote().getValue());
        if (response == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}