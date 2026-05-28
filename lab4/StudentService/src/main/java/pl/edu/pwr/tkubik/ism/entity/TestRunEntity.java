package pl.edu.pwr.tkubik.ism.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "test_runs")
public class TestRunEntity {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "build_id")
    private BuildEntity build;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "organizer_id")
    private UserEntity organizer;

    @Column(name = "scheduled_at")     private OffsetDateTime scheduledAt;
    @Column(name = "location_name")    private String locationName;
    @Column                            private Double latitude;
    @Column                            private Double longitude;
    @Column                            private String country;
    @Column                            private String city;
    @Column                            private String weather;
    @Column(name = "max_participants") private Integer maxParticipants;
    @Column                            private String status;
    @Column(name = "success_rating")   private Double successRating;
    @Column(name = "created_at")       private OffsetDateTime createdAt;

    public TestRunEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public BuildEntity getBuild() { return build; }
    public void setBuild(BuildEntity build) { this.build = build; }
    public UserEntity getOrganizer() { return organizer; }
    public void setOrganizer(UserEntity organizer) { this.organizer = organizer; }
    public OffsetDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(OffsetDateTime v) { this.scheduledAt = v; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String v) { this.locationName = v; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double v) { this.longitude = v; }
    public String getCountry() { return country; }
    public void setCountry(String v) { this.country = v; }
    public String getCity() { return city; }
    public void setCity(String v) { this.city = v; }
    public String getWeather() { return weather; }
    public void setWeather(String v) { this.weather = v; }
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer v) { this.maxParticipants = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public Double getSuccessRating() { return successRating; }
    public void setSuccessRating(Double v) { this.successRating = v; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime v) { this.createdAt = v; }
}
