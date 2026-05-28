package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.pwr.tkubik.ism.statistics.StatisticsStore;

import java.util.Map;

/**
 * Exposes the AOP-collected API usage statistics.
 *
 * Bypasses the OpenAPI generator on purpose: the response shape is a free-form
 * Map and not worth modelling as a typed schema.
 */
@RestController
@RequestMapping("/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsStore store;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getStatistics() {
        return ResponseEntity.ok(store.getSnapshot());
    }
}
