package pl.edu.pwr.tkubik.ism.service;

import pl.edu.pwr.tkubik.ism.model.VoteResponse;

import java.util.UUID;

public interface VoteService {
    VoteResponse getVotes(UUID buildId, UUID currentUserId);
    VoteResponse castVote(UUID buildId, UUID userId, String vote);
}