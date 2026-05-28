package pl.edu.pwr.tkubik.ism.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "reputation",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id"}))
public class ReputationEntity {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(name = "builder_score")      private Double builderScore;
    @Column(name = "helpfulness_score")  private Double helpfulnessScore;
    @Column(name = "organizer_score")    private Double organizerScore;
    @Column(name = "reliability_score")  private Double reliabilityScore;
    @Column(name = "skill_level")        private String skillLevel;
    @Column(name = "updated_at")         private OffsetDateTime updatedAt;

    public ReputationEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity v) { this.user = v; }
    public Double getBuilderScore() { return builderScore; }
    public void setBuilderScore(Double v) { this.builderScore = v; }
    public Double getHelpfulnessScore() { return helpfulnessScore; }
    public void setHelpfulnessScore(Double v) { this.helpfulnessScore = v; }
    public Double getOrganizerScore() { return organizerScore; }
    public void setOrganizerScore(Double v) { this.organizerScore = v; }
    public Double getReliabilityScore() { return reliabilityScore; }
    public void setReliabilityScore(Double v) { this.reliabilityScore = v; }
    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String v) { this.skillLevel = v; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime v) { this.updatedAt = v; }
}
