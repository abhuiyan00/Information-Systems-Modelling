package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.pwr.tkubik.ism.security.CurrentUser;
import pl.edu.pwr.tkubik.ism.service.AnalyticsService;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired private AnalyticsService analytics;
    @Autowired private CurrentUser currentUser;

    @GetMapping("/dashboard")    public ResponseEntity<Map<String, Object>> dashboard()    { return ResponseEntity.ok(analytics.dashboard()); }
    @GetMapping("/community")    public ResponseEntity<Map<String, Object>> community()    { return ResponseEntity.ok(analytics.community()); }
    @GetMapping("/test-runs")    public ResponseEntity<Map<String, Object>> testRuns()     { return ResponseEntity.ok(analytics.testRuns()); }
    @GetMapping("/builds")       public ResponseEntity<Map<String, Object>> builds()       { return ResponseEntity.ok(analytics.builds()); }
    @GetMapping("/telemetry")    public ResponseEntity<Map<String, Object>> telemetry()    { return ResponseEntity.ok(analytics.telemetry()); }
    @GetMapping("/geography")    public ResponseEntity<Map<String, Object>> geography()    { return ResponseEntity.ok(analytics.geography()); }
    @GetMapping("/marketplace")  public ResponseEntity<Map<String, Object>> marketplace()  { return ResponseEntity.ok(analytics.marketplace()); }
    @GetMapping("/social")       public ResponseEntity<Map<String, Object>> social()       { return ResponseEntity.ok(analytics.social()); }
    @GetMapping("/ai")           public ResponseEntity<Map<String, Object>> ai()           {
        return ResponseEntity.ok(analytics.ai(currentUser.isAuthenticated() ? currentUser.getUserId() : null));
    }
}
