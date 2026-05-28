package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.tkubik.ism.entity.*;
import pl.edu.pwr.tkubik.ism.repository.*;
import pl.edu.pwr.tkubik.ism.security.CurrentUser;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/test-runs")
public class TestRunController {

    @Autowired private TestRunRepository runRepo;
    @Autowired private TestRunAttendeeRepository attRepo;
    @Autowired private BuildRepository buildRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private CurrentUser currentUser;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list(@RequestParam(required = false) String status) {
        List<TestRunEntity> rows = runRepo.findAll();
        List<Map<String, Object>> out = new ArrayList<>();
        for (TestRunEntity r : rows) {
            if (status != null && !status.isBlank() && !status.equals(r.getStatus())) continue;
            out.add(toDto(r));
        }
        out.sort((a, b) -> ((String) b.get("scheduled_at")).compareTo((String) a.get("scheduled_at")));
        return ResponseEntity.ok(out);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> get(@PathVariable UUID id) {
        return runRepo.findById(id).map(r -> ResponseEntity.ok(toDto(r)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        if (!currentUser.isAuthenticated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        TestRunEntity r = new TestRunEntity();
        r.setOrganizer(userRepo.findById(currentUser.getUserId()).orElse(null));
        String buildIdStr = (String) body.get("build_id");
        if (buildIdStr != null) {
            r.setBuild(buildRepo.findById(UUID.fromString(buildIdStr)).orElse(null));
        }
        String when = (String) body.get("scheduled_at");
        r.setScheduledAt(when != null ? OffsetDateTime.parse(when) : OffsetDateTime.now().plusDays(7));
        r.setLocationName((String) body.get("location_name"));
        r.setCity((String) body.get("city"));
        r.setCountry((String) body.getOrDefault("country", "PL"));
        r.setLatitude(toDouble(body.get("latitude")));
        r.setLongitude(toDouble(body.get("longitude")));
        r.setWeather((String) body.getOrDefault("weather", "SUNNY"));
        r.setMaxParticipants(toInt(body.getOrDefault("max_participants", 10)));
        r.setStatus("scheduled");
        r.setSuccessRating(0.0);
        r.setCreatedAt(OffsetDateTime.now());
        runRepo.save(r);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(r));
    }

    @PostMapping("/{id}/attendees")
    public ResponseEntity<Map<String, Object>> join(@PathVariable UUID id, @RequestBody(required = false) Map<String, Object> body) {
        if (!currentUser.isAuthenticated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        TestRunEntity run = runRepo.findById(id).orElse(null);
        if (run == null) return ResponseEntity.notFound().build();
        TestRunAttendeeEntity a = new TestRunAttendeeEntity();
        a.setTestRun(run);
        a.setUser(userRepo.findById(currentUser.getUserId()).orElse(null));
        a.setAttended(null);
        if (body != null && body.get("distance_km") != null) a.setDistanceKm(toDouble(body.get("distance_km")));
        attRepo.save(a);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("test_run_id", id, "user_id", currentUser.getUserId()));
    }

    @GetMapping("/{id}/attendees")
    public ResponseEntity<List<Map<String, Object>>> attendees(@PathVariable UUID id) {
        List<TestRunAttendeeEntity> rows = attRepo.findByTestRunId(id);
        List<Map<String, Object>> out = new ArrayList<>();
        for (TestRunAttendeeEntity a : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("user_id", a.getUser() == null ? null : a.getUser().getId());
            m.put("username", a.getUser() == null ? null : a.getUser().getUsername());
            m.put("attended", a.getAttended());
            m.put("distance_km", a.getDistanceKm());
            out.add(m);
        }
        return ResponseEntity.ok(out);
    }

    private Map<String, Object> toDto(TestRunEntity r) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", r.getId());
        m.put("build_id", r.getBuild() == null ? null : r.getBuild().getId());
        m.put("organizer_id", r.getOrganizer() == null ? null : r.getOrganizer().getId());
        m.put("organizer_username", r.getOrganizer() == null ? null : r.getOrganizer().getUsername());
        m.put("scheduled_at", r.getScheduledAt() == null ? "" : r.getScheduledAt().toString());
        m.put("location_name", r.getLocationName());
        m.put("city", r.getCity());
        m.put("country", r.getCountry());
        m.put("latitude", r.getLatitude());
        m.put("longitude", r.getLongitude());
        m.put("weather", r.getWeather());
        m.put("max_participants", r.getMaxParticipants());
        m.put("status", r.getStatus());
        m.put("success_rating", r.getSuccessRating());
        return m;
    }

    private static Double toDouble(Object o) {
        if (o == null) return null;
        if (o instanceof Number n) return n.doubleValue();
        return Double.parseDouble(o.toString());
    }
    private static Integer toInt(Object o) {
        if (o == null) return null;
        if (o instanceof Number n) return n.intValue();
        return Integer.parseInt(o.toString());
    }
}
