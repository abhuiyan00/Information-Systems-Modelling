package pl.edu.pwr.tkubik.ism.service;

import pl.edu.pwr.tkubik.ism.model.Comment;

import java.util.List;
import java.util.UUID;

public interface CommentService {
    Comment addComment(UUID buildId, UUID authorId, String content);
    List<Comment> findByBuildId(UUID buildId);
}