package pl.edu.pwr.tkubik.ism.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.pwr.tkubik.ism.entity.BuildEntity;
import pl.edu.pwr.tkubik.ism.entity.UserEntity;
import pl.edu.pwr.tkubik.ism.entity.VoteEntity;
import pl.edu.pwr.tkubik.ism.model.VoteResponse;
import pl.edu.pwr.tkubik.ism.repository.BuildRepository;
import pl.edu.pwr.tkubik.ism.repository.UserRepository;
import pl.edu.pwr.tkubik.ism.repository.VoteRepository;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class VoteServiceImpl implements VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private BuildRepository buildRepository;

    @Autowired
    private UserRepository userRepository;

    private VoteResponse buildResponse(UUID buildId, UUID currentUserId) {
        int upvotes = voteRepository.countUpvotesByBuildId(buildId);
        int downvotes = voteRepository.countDownvotesByBuildId(buildId);

        VoteResponse response = new VoteResponse();
        response.setUpvotes(upvotes);
        response.setDownvotes(downvotes);

        // Check what the current user voted (anonymous viewer → none)
        Optional<VoteEntity> userVote = currentUserId == null
                ? Optional.empty()
                : voteRepository.findByBuildIdAndUserId(buildId, currentUserId);
        if (userVote.isPresent()) {
            String v = userVote.get().getVote();
            if ("up".equals(v)) {
                response.setUserVote(VoteResponse.UserVoteEnum.UP);
            } else if ("down".equals(v)) {
                response.setUserVote(VoteResponse.UserVoteEnum.DOWN);
            } else {
                response.setUserVote(VoteResponse.UserVoteEnum.NONE);
            }
        } else {
            response.setUserVote(VoteResponse.UserVoteEnum.NONE);
        }

        return response;
    }

    @Override
    public VoteResponse getVotes(UUID buildId, UUID currentUserId) {
        return buildResponse(buildId, currentUserId);
    }

    @Override
    public VoteResponse castVote(UUID buildId, UUID userId, String vote) {
        Optional<BuildEntity> buildOpt = buildRepository.findById(buildId);
        if (buildOpt.isEmpty()) return null;

        // Check if this user already voted on this build
        Optional<VoteEntity> existingVote =
                voteRepository.findByBuildIdAndUserId(buildId, userId);

        if ("none".equals(vote)) {
            // Remove the vote if it exists
            existingVote.ifPresent(voteRepository::delete);
        } else if (existingVote.isPresent()) {
            // Update existing vote
            VoteEntity entity = existingVote.get();
            entity.setVote(vote);
            voteRepository.save(entity);
        } else {
            // Create new vote — need a UserEntity
            Optional<UserEntity> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) return null;

            VoteEntity entity = new VoteEntity(
                    buildOpt.get(), userOpt.get(), vote);
            voteRepository.save(entity);
        }

        return buildResponse(buildId, userId);
    }
}