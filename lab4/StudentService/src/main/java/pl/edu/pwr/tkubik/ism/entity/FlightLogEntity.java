package pl.edu.pwr.tkubik.ism.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "flight_logs")
public class FlightLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "flight_date")
    private LocalDate flightDate;

    @Column(name = "location_name", length = 200)
    private String locationName;

    @Column(name = "duration_min")
    private Integer durationMin;

    @Column(name = "max_altitude_m")
    private BigDecimal maxAltitudeM;

    @Column(name = "drone_identifier")
    private String droneIdentifier;

    @Column(name = "conditions")
    private String conditions;

    @Column(name = "notebook", length = 1000)
    private String notebook;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "build_id")
    private BuildEntity build;

    // constructors
    public FlightLogEntity() {
    }

    // getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public LocalDate getFlightDate() { return flightDate; }
    public void setFlightDate(LocalDate flightDate) { this.flightDate = flightDate; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Integer getDurationMin() { return durationMin; }
    public void setDurationMin(Integer durationMin) { this.durationMin = durationMin; }

    public BigDecimal getMaxAltitudeM() { return maxAltitudeM; }
    public void setMaxAltitudeM(BigDecimal maxAltitudeM) { this.maxAltitudeM = maxAltitudeM; }

    public String getDroneIdentifier() { return droneIdentifier; }
    public void setDroneIdentifier(String droneIdentifier) { this.droneIdentifier = droneIdentifier; }

    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }

    public String getNotebook() { return notebook; }
    public void setNotebook(String notebook) { this.notebook = notebook; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public BuildEntity getBuild() { return build; }
    public void setBuild(BuildEntity build) { this.build = build; }
}