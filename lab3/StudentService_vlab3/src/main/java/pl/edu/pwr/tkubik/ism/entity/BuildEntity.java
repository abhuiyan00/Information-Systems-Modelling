package pl.edu.pwr.tkubik.ism.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "builds")
public class BuildEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "title", nullable = false, length = 120)
    private String title;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "scale")
    private String scale;

    @Column(name = "wingspan_mm")
    private Integer wingspanMm;

    @Column(name = "frame_size_mm")
    private Integer frameSizeMm;

    @Column(name = "num_motors")
    private Integer numMotors;

    @Column(name = "flight_controller")
    private String flightController;

    @Column(name = "max_takeoff_weight_g")
    private Integer maxTakeoffWeightG;

    @Column(name = "rotor_diameter_mm")
    private Integer rotorDiameterMm;

    @Column(name = "hull_length_mm")
    private Integer hullLengthMm;

    @Column(name = "wheelbase_mm")
    private Integer wheelbaseMm;

    @Column(name = "status")
    private String status;

    @Column(name = "score")
    private Float score;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private UserEntity owner;

    @OneToMany(mappedBy = "build", cascade = CascadeType.ALL)
    private Set<CommentEntity> comments = new HashSet<>();

    @OneToMany(mappedBy = "build", cascade = CascadeType.ALL)
    private Set<FlightLogEntity> flightLogs = new HashSet<>();

    @OneToMany(mappedBy = "build", cascade = CascadeType.ALL)
    private Set<MediaFileEntity> mediaFiles = new HashSet<>();

    @OneToMany(mappedBy = "build", cascade = CascadeType.ALL)
    private Set<CollaboratorEntity> collaborators = new HashSet<>();

    @OneToMany(mappedBy = "build", cascade = CascadeType.ALL)
    private Set<VoteEntity> votes = new HashSet<>();

    // constructors
    public BuildEntity() {
    }

    public BuildEntity(String title, String type) {
        this.title = title;
        this.type = type;
        this.status = "draft";
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    // getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getScale() { return scale; }
    public void setScale(String scale) { this.scale = scale; }

    public Integer getWingspanMm() { return wingspanMm; }
    public void setWingspanMm(Integer wingspanMm) { this.wingspanMm = wingspanMm; }

    public Integer getFrameSizeMm() { return frameSizeMm; }
    public void setFrameSizeMm(Integer frameSizeMm) { this.frameSizeMm = frameSizeMm; }

    public Integer getNumMotors() { return numMotors; }
    public void setNumMotors(Integer numMotors) { this.numMotors = numMotors; }

    public String getFlightController() { return flightController; }
    public void setFlightController(String flightController) { this.flightController = flightController; }

    public Integer getMaxTakeoffWeightG() { return maxTakeoffWeightG; }
    public void setMaxTakeoffWeightG(Integer maxTakeoffWeightG) { this.maxTakeoffWeightG = maxTakeoffWeightG; }

    public Integer getRotorDiameterMm() { return rotorDiameterMm; }
    public void setRotorDiameterMm(Integer rotorDiameterMm) { this.rotorDiameterMm = rotorDiameterMm; }

    public Integer getHullLengthMm() { return hullLengthMm; }
    public void setHullLengthMm(Integer hullLengthMm) { this.hullLengthMm = hullLengthMm; }

    public Integer getWheelbaseMm() { return wheelbaseMm; }
    public void setWheelbaseMm(Integer wheelbaseMm) { this.wheelbaseMm = wheelbaseMm; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Float getScore() { return score; }
    public void setScore(Float score) { this.score = score; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public UserEntity getOwner() { return owner; }
    public void setOwner(UserEntity owner) { this.owner = owner; }

    public Set<CommentEntity> getComments() { return comments; }
    public void setComments(Set<CommentEntity> comments) { this.comments = comments; }

    public Set<FlightLogEntity> getFlightLogs() { return flightLogs; }
    public void setFlightLogs(Set<FlightLogEntity> flightLogs) { this.flightLogs = flightLogs; }

    public Set<MediaFileEntity> getMediaFiles() { return mediaFiles; }
    public void setMediaFiles(Set<MediaFileEntity> mediaFiles) { this.mediaFiles = mediaFiles; }

    public Set<CollaboratorEntity> getCollaborators() { return collaborators; }
    public void setCollaborators(Set<CollaboratorEntity> collaborators) { this.collaborators = collaborators; }

    public Set<VoteEntity> getVotes() { return votes; }
    public void setVotes(Set<VoteEntity> votes) { this.votes = votes; }
}