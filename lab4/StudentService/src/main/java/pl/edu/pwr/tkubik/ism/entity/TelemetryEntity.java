package pl.edu.pwr.tkubik.ism.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "telemetry")
public class TelemetryEntity {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "build_id")
    private BuildEntity build;

    @Column(name = "recorded_at")        private OffsetDateTime recordedAt;
    @Column(name = "max_speed_kmh")      private Double maxSpeedKmh;
    @Column(name = "duration_sec")       private Integer durationSec;
    @Column(name = "battery_used_pct")   private Double batteryUsedPct;
    @Column(name = "range_m")            private Integer rangeM;
    @Column(name = "max_altitude_m")     private Double maxAltitudeM;
    @Column(name = "crash_count")        private Integer crashCount;
    @Column                              private String terrain;
    @Column(name = "lap_time_sec")       private Double lapTimeSec;

    public TelemetryEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public BuildEntity getBuild() { return build; }
    public void setBuild(BuildEntity v) { this.build = v; }
    public OffsetDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(OffsetDateTime v) { this.recordedAt = v; }
    public Double getMaxSpeedKmh() { return maxSpeedKmh; }
    public void setMaxSpeedKmh(Double v) { this.maxSpeedKmh = v; }
    public Integer getDurationSec() { return durationSec; }
    public void setDurationSec(Integer v) { this.durationSec = v; }
    public Double getBatteryUsedPct() { return batteryUsedPct; }
    public void setBatteryUsedPct(Double v) { this.batteryUsedPct = v; }
    public Integer getRangeM() { return rangeM; }
    public void setRangeM(Integer v) { this.rangeM = v; }
    public Double getMaxAltitudeM() { return maxAltitudeM; }
    public void setMaxAltitudeM(Double v) { this.maxAltitudeM = v; }
    public Integer getCrashCount() { return crashCount; }
    public void setCrashCount(Integer v) { this.crashCount = v; }
    public String getTerrain() { return terrain; }
    public void setTerrain(String v) { this.terrain = v; }
    public Double getLapTimeSec() { return lapTimeSec; }
    public void setLapTimeSec(Double v) { this.lapTimeSec = v; }
}
