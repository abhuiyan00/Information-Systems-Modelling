package pl.edu.pwr.tkubik.ism.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.pwr.tkubik.ism.entity.BuildEntity;
import pl.edu.pwr.tkubik.ism.entity.CommentEntity;
import pl.edu.pwr.tkubik.ism.entity.UserEntity;
import pl.edu.pwr.tkubik.ism.model.Comment;
import pl.edu.pwr.tkubik.ism.repository.BuildRepository;
import pl.edu.pwr.tkubik.ism.repository.CommentRepository;
import pl.edu.pwr.tkubik.ism.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private BuildRepository buildRepository;

    @Autowired
    private UserRepository userRepository;

    // ── Conversion: Entity → DTO ──
    private Comment toDTO(CommentEntity entity) {
        Comment dto = new Comment();
        dto.setId(entity.getId());
        dto.setContent(entity.getContent());
        dto.setCreatedAt(entity.getCreatedAt());
        if (entity.getAuthor() != null) {
            dto.setAuthorId(entity.getAuthor().getId());
            dto.setAuthorUsername(entity.getAuthor().getUsername());
        }
        return dto;
    }

    @Override
    public Comment addComment(UUID buildId, UUID authorId, String content) {
        Optional<BuildEntity> buildOpt = buildRepository.findById(buildId);
        if (buildOpt.isEmpty()) return null;

        UserEntity author = userRepository.findById(authorId).orElse(null);
        if (author == null) return null;

        CommentEntity entity = new CommentEntity(content, buildOpt.get(), author);
        entity = commentRepository.save(entity);
        return toDTO(entity);
    }

    @Override
    public List<Comment> findByBuildId(UUID buildId) {
        return commentRepository.findByBuildId(buildId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
