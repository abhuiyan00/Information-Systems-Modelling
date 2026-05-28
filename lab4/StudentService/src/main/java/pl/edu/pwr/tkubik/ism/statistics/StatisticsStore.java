package pl.edu.pwr.tkubik.ism.statistics;

import org.springframework.stereotype.Component;
import pl.edu.pwr.tkubik.ism.model.Build;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe in-memory store of API call statistics.
 *
 * Snapshot returned by {@link #getSnapshot()} matches the shape consumed by
 * the Angular Statistics dashboard:
 * {
 *   "total_calls": long,
 *   "endpoint_usage": { "<methodName>": { "calls": long, "percentage": double }, ... },
 *   "data_insights": {
 *     "most_common_build_type": string,
 *     "total_builds_retrieved": long,
 *     "most_called_endpoint": string
 *   }
 * }
 */
@Component
public class StatisticsStore {

    private final ConcurrentHashMap<String, AtomicLong> endpointCallCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> buildTypeCounts = new ConcurrentHashMap<>();
    private final AtomicLong totalBuildsSeen = new AtomicLong(0);
    private final AtomicLong totalCalls = new AtomicLong(0);

    public void recordEndpointCall(String methodName) {
        endpointCallCounts
                .computeIfAbsent(methodName, k -> new AtomicLong(0))
                .incrementAndGet();
        totalCalls.incrementAndGet();
    }

    public void recordBuildListData(List<Build> builds) {
        if (builds == null || builds.isEmpty()) return;
        for (Build b : builds) {
            if (b.getType() != null) {
                buildTypeCounts
                        .computeIfAbsent(b.getType().getValue(), k -> new AtomicLong(0))
                        .incrementAndGet();
            }
            totalBuildsSeen.incrementAndGet();
        }
    }

    public Map<String, Object> getSnapshot() {
        long total = totalCalls.get();

        Map<String, Map<String, Object>> usage = new LinkedHashMap<>();
        String mostCalled = "";
        long mostCalledCount = -1;
        for (Map.Entry<String, AtomicLong> e : endpointCallCounts.entrySet()) {
            long calls = e.getValue().get();
            double pct = total == 0 ? 0.0 : Math.round((calls * 10000.0) / total) / 100.0;
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("calls", calls);
            entry.put("percentage", pct);
            usage.put(e.getKey(), entry);

            if (calls > mostCalledCount) {
                mostCalledCount = calls;
                mostCalled = e.getKey();
            }
        }

        String mostCommonType = "";
        long mostCommonTypeCount = -1;
        for (Map.Entry<String, AtomicLong> e : buildTypeCounts.entrySet()) {
            long c = e.getValue().get();
            if (c > mostCommonTypeCount) {
                mostCommonTypeCount = c;
                mostCommonType = e.getKey();
            }
        }

        Map<String, Object> insights = new LinkedHashMap<>();
        insights.put("most_common_build_type", mostCommonType);
        insights.put("total_builds_retrieved", totalBuildsSeen.get());
        insights.put("most_called_endpoint", mostCalled);

        Map<String, Object> snapshot = new LinkedHashMap<>();
        snapshot.put("total_calls", total);
        snapshot.put("endpoint_usage", usage);
        snapshot.put("data_insights", insights);
        return snapshot;
    }
}
