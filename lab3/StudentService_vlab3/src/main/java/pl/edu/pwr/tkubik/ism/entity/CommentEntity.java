package pl.edu.pwr.tkubik.ism.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "comments")
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "content", nullable = false, length = 1000)
    private String content;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "build_id")
    private BuildEntity build;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;

    // constructors
    public CommentEntity() {
    }

    public CommentEntity(String content, BuildEntity build, UserEntity author) {
        this.content = content;
        this.build = build;
        this.author = author;
        this.createdAt = OffsetDateTime.now();
    }

    // getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public BuildEntity getBuild() { return build; }
    public void setBuild(BuildEntity build) { this.build = build; }

    public UserEntity getAuthor() { return author; }
    public void setAuthor(UserEntity author) { this.author = author; }
}