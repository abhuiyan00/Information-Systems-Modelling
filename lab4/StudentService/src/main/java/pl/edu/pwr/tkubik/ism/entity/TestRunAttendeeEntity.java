package pl.edu.pwr.tkubik.ism.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "test_run_attendees",
       uniqueConstraints = @UniqueConstraint(columnNames = {"test_run_id", "user_id"}))
public class TestRunAttendeeEntity {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "test_run_id")
    private TestRunEntity testRun;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column private Boolean attended;
    @Column(name = "distance_km") private Double distanceKm;

    public TestRunAttendeeEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public TestRunEntity getTestRun() { return testRun; }
    public void setTestRun(TestRunEntity v) { this.testRun = v; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity v) { this.user = v; }
    public Boolean getAttended() { return attended; }
    public void setAttended(Boolean v) { this.attended = v; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double v) { this.distanceKm = v; }
}
