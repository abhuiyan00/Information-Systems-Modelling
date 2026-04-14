package pl.edu.pwr.tkubik.ism.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;

import java.util.*;

@RestController
public class CommunityController implements CommunityApi {

    // Comments storage: buildId  →  list of comments on that build
    private static Map<String, List<Comment>> commentsDb = new HashMap<>();

    // Votes storage: buildId  →  { userId → vote }
    private static Map<String, Map<String, VoteRequest.VoteEnum>> votesDb = new HashMap<>();

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    // GET /builds/{buildId}/comments — list all comments on a build
    // NOTE: Method name should match the generated CommunityApi interface
    // Common patterns: buildsBuildIdCommentsGet() or listComments()
    @Override
    public ResponseEntity<List<Comment>> buildsBuildIdCommentsGet(UUID buildId) {
        List<Comment> comments = commentsDb.getOrDefault(
                buildId.toString(), new ArrayList<>()
        );
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    // POST /builds/{buildId}/comments — post a new comment
    // NOTE: Method name should match the generated CommunityApi interface
    // Common patterns: buildsBuildIdCommentsPost() or postComment()
    @Override
    public ResponseEntity<Comment> buildsBuildIdCommentsPost(UUID buildId, CommentRequest commentRequest) {
        Comment comment = new Comment();
        comment.setId(UUID.randomUUID());
        comment.setContent(commentRequest.getContent());
        comment.setAuthorUsername("anonymous");  // simplified — no real auth
        comment.setAuthorId(UUID.fromString("00000000-0000-0000-0000-000000000001"));

        // Get or create the list for this build, then add the comment
        List<Comment> comments = commentsDb.computeIfAbsent(
                buildId.toString(), k -> new ArrayList<>()
        );
        comments.add(comment);

        return new ResponseEntity<>(comment, HttpStatus.CREATED);  // 201
    }

    // GET /builds/{buildId}/vote — get vote counts
    @Override
    public ResponseEntity<VoteResponse> buildsBuildIdVoteGet(UUID buildId) {
        Map<String, VoteRequest.VoteEnum> buildVotes =
                votesDb.getOrDefault(buildId.toString(), new HashMap<>());

        int upvotes = 0;
        int downvotes = 0;
        for (VoteRequest.VoteEnum v : buildVotes.values()) {
            if (v == VoteRequest.VoteEnum.UP) upvotes++;
            else if (v == VoteRequest.VoteEnum.DOWN) downvotes++;
        }

        VoteResponse response = new VoteResponse();
        response.setUpvotes(upvotes);
        response.setDownvotes(downvotes);
        response.setUserVote(VoteResponse.UserVoteEnum.NONE);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // POST /builds/{buildId}/vote — cast or change a vote
    @Override
    public ResponseEntity<VoteResponse> buildsBuildIdVotePost(UUID buildId, VoteRequest voteRequest) {
        // Simplified: use a fixed user ID (no real auth)
        String currentUserId = "00000000-0000-0000-0000-000000000001";

        Map<String, VoteRequest.VoteEnum> buildVotes =
                votesDb.computeIfAbsent(buildId.toString(), k -> new HashMap<>());

        if (voteRequest.getVote() == VoteRequest.VoteEnum.NONE) {
            buildVotes.remove(currentUserId);
        } else {
            buildVotes.put(currentUserId, voteRequest.getVote());
        }

        // Recount
        int upvotes = 0;
        int downvotes = 0;
        for (VoteRequest.VoteEnum v : buildVotes.values()) {
            if (v == VoteRequest.VoteEnum.UP) upvotes++;
            else if (v == VoteRequest.VoteEnum.DOWN) downvotes++;
        }

        VoteResponse response = new VoteResponse();
        response.setUpvotes(upvotes);
        response.setDownvotes(downvotes);

        // Map the enum
        switch (voteRequest.getVote()) {
            case UP:   response.setUserVote(VoteResponse.UserVoteEnum.UP); break;
            case DOWN: response.setUserVote(VoteResponse.UserVoteEnum.DOWN); break;
            default:   response.setUserVote(VoteResponse.UserVoteEnum.NONE); break;
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}