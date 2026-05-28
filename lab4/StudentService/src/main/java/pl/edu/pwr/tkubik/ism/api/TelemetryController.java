package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.tkubik.ism.entity.BuildEntity;
import pl.edu.pwr.tkubik.ism.entity.TelemetryEntity;
import pl.edu.pwr.tkubik.ism.repository.BuildRepository;
import pl.edu.pwr.tkubik.ism.repository.TelemetryRepository;
import pl.edu.pwr.tkubik.ism.security.CurrentUser;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/builds/{buildId}/telemetry")
public class TelemetryController {

    @Autowired private TelemetryRepository repo;
    @Autowired private BuildRepository buildRepo;
    @Autowired private CurrentUser currentUser;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list(@PathVariable UUID buildId) {
        if (!buildRepo.existsById(buildId)) return ResponseEntity.notFound().build();
        List<TelemetryEntity> rows = repo.findByBuildId(buildId);
        List<Map<String, Object>> out = new ArrayList<>();
        for (TelemetryEntity t : rows) out.add(toDto(t));
        return ResponseEntity.ok(out);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@PathVariable UUID buildId,
                                                       @RequestBody Map<String, Object> body) {
        if (!currentUser.isAuthenticated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        BuildEntity b = buildRepo.findById(buildId).orElse(null);
        if (b == null) return ResponseEntity.notFound().build();
        TelemetryEntity t = new TelemetryEntity();
        t.setBuild(b);
        t.setRecordedAt(OffsetDateTime.now());
        t.setMaxSpeedKmh(toD(body.get("max_speed_kmh")));
        t.setDurationSec(toI(body.get("duration_sec")));
        t.setBatteryUsedPct(toD(body.get("battery_used_pct")));
        t.setRangeM(toI(body.get("range_m")));
        t.setMaxAltitudeM(toD(body.get("max_altitude_m")));
        t.setCrashCount(toI(body.getOrDefault("crash_count", 0)));
        t.setTerrain((String) body.get("terrain"));
        t.setLapTimeSec(toD(body.get("lap_time_sec")));
        repo.save(t);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(t));
    }

    private Map<String, Object> toDto(TelemetryEntity t) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", t.getId());
        m.put("build_id", t.getBuild() == null ? null : t.getBuild().getId());
        m.put("recorded_at", t.getRecordedAt() == null ? "" : t.getRecordedAt().toString());
        m.put("max_speed_kmh", t.getMaxSpeedKmh());
        m.put("duration_sec", t.getDurationSec());
        m.put("battery_used_pct", t.getBatteryUsedPct());
        m.put("range_m", t.getRangeM());
        m.put("max_altitude_m", t.getMaxAltitudeM());
        m.put("crash_count", t.getCrashCount());
        m.put("terrain", t.getTerrain());
        m.put("lap_time_sec", t.getLapTimeSec());
        return m;
    }

    private static Double toD(Object o) { return o == null ? null : ((Number) o).doubleValue(); }
    private static Integer toI(Object o) { return o == null ? null : ((Number) o).intValue(); }
}
