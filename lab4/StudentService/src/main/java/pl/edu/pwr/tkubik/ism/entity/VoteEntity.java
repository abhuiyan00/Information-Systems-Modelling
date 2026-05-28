package pl.edu.pwr.tkubik.ism.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "votes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"build_id", "user_id"}))
public class VoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "vote", nullable = false)
    private String vote;

    @ManyToOne
    @JoinColumn(name = "build_id")
    private BuildEntity build;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    // constructors
    public VoteEntity() {
    }

    public VoteEntity(BuildEntity build, UserEntity user, String vote) {
        this.build = build;
        this.user = user;
        this.vote = vote;
    }

    // getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getVote() { return vote; }
    public void setVote(String vote) { this.vote = vote; }

    public BuildEntity getBuild() { return build; }
    public void setBuild(BuildEntity build) { this.build = build; }

    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
}