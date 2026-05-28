package pl.edu.pwr.tkubik.ism.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;

/**
 * Pure JDBC-driven aggregations for all 8 analytics categories.
 * Keeps responses as free-form maps so consumers don't need OpenAPI codegen.
 */
@Service
public class AnalyticsService {

    @Autowired private JdbcTemplate jdbc;

    /* ───────────────────── 1. Community engagement ───────────────────── */
    public Map<String, Object> community() {
        Map<String, Object> r = new LinkedHashMap<>();
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime day = now.minusDays(1);
        OffsetDateTime month = now.minusDays(30);

        Integer dau = jdbc.queryForObject(
                "SELECT COUNT(DISTINCT author_id) FROM comments WHERE created_at >= ?",
                Integer.class, day);
        Integer mau = jdbc.queryForObject(
                "SELECT COUNT(DISTINCT author_id) FROM comments WHERE created_at >= ?",
                Integer.class, month);
        Integer collabs = jdbc.queryForObject(
                "SELECT COUNT(*) FROM collaborators", Integer.class);
        Integer totalComments = jdbc.queryForObject(
                "SELECT COUNT(*) FROM comments", Integer.class);
        Integer totalBuilds = jdbc.queryForObject(
                "SELECT COUNT(*) FROM builds", Integer.class);
        double avgCommentsPerBuild = totalBuilds == null || totalBuilds == 0
                ? 0 : (double) totalComments / totalBuilds;

        String topType = jdbc.query(
                "SELECT type, COUNT(*) c FROM builds GROUP BY type ORDER BY c DESC LIMIT 1",
                rs -> rs.next() ? rs.getString("type") : "n/a");

        List<Map<String, Object>> hours = jdbc.query(
                "SELECT EXTRACT(HOUR FROM created_at) AS h, COUNT(*) AS c " +
                        "FROM comments GROUP BY h ORDER BY c DESC LIMIT 3",
                (rs, i) -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("hour", rs.getInt("h"));
                    m.put("activity", rs.getInt("c"));
                    return m;
                });

        Integer activeUsers = jdbc.queryForObject(
                "SELECT COUNT(DISTINCT author_id) FROM comments", Integer.class);
        Integer totalUsers = jdbc.queryForObject(
                "SELECT COUNT(*) FROM users WHERE role = 'member'", Integer.class);
        double retention = totalUsers == null || totalUsers == 0
                ? 0 : (activeUsers == null ? 0 : (double) activeUsers / totalUsers);

        r.put("dau", dau == null ? 0 : dau);
        r.put("mau", mau == null ? 0 : mau);
        r.put("collaborations", collabs == null ? 0 : collabs);
        r.put("avg_comments_per_project", round2(avgCommentsPerBuild));
        r.put("top_hobby_category", topType);
        r.put("peak_hours", hours);
        r.put("retention_rate", round2(retention));
        return r;
    }

    /* ───────────────────── 2. Test runs / events ───────────────────── */
    public Map<String, Object> testRuns() {
        Map<String, Object> r = new LinkedHashMap<>();
        Integer scheduled = jdbc.queryForObject(
                "SELECT COUNT(*) FROM test_runs WHERE status = 'scheduled'", Integer.class);
        Integer completed = jdbc.queryForObject(
                "SELECT COUNT(*) FROM test_runs WHERE status = 'completed'", Integer.class);
        Integer cancelled = jdbc.queryForObject(
                "SELECT COUNT(*) FROM test_runs WHERE status = 'cancelled'", Integer.class);

        Integer attendanceTotal = jdbc.queryForObject(
                "SELECT COUNT(*) FROM test_run_attendees WHERE attended = TRUE",
                Integer.class);
        Integer attendanceSlots = jdbc.queryForObject(
                "SELECT COUNT(*) FROM test_run_attendees WHERE attended IS NOT NULL",
                Integer.class);
        double attendancePct = attendanceSlots == null || attendanceSlots == 0
                ? 0 : (double) attendanceTotal / attendanceSlots;

        List<Map<String, Object>> popularLocations = jdbc.query(
                "SELECT city, COUNT(*) c FROM test_runs GROUP BY city ORDER BY c DESC LIMIT 5",
                (rs, i) -> Map.of("city", rs.getString("city"), "count", rs.getInt("c")));

        List<Map<String, Object>> weatherImpact = jdbc.query(
                "SELECT weather, AVG(success_rating) avg_r FROM test_runs " +
                        "WHERE status = 'completed' GROUP BY weather",
                (rs, i) -> Map.of("weather", rs.getString("weather"),
                        "avg_rating", round2(rs.getDouble("avg_r"))));

        Double avgDistance = jdbc.queryForObject(
                "SELECT AVG(distance_km) FROM test_run_attendees", Double.class);
        Double avgSuccess = jdbc.queryForObject(
                "SELECT AVG(success_rating) FROM test_runs WHERE status = 'completed'",
                Double.class);

        int total = (scheduled == null ? 0 : scheduled)
                + (completed == null ? 0 : completed)
                + (cancelled == null ? 0 : cancelled);
        double cancelRate = total == 0 ? 0 : (cancelled == null ? 0 : (double) cancelled / total);

        Integer repeatAttendees = jdbc.queryForObject(
                "SELECT COUNT(*) FROM (SELECT user_id, COUNT(*) c " +
                        "FROM test_run_attendees WHERE attended = TRUE " +
                        "GROUP BY user_id HAVING COUNT(*) > 1) repeats",
                Integer.class);

        r.put("scheduled", scheduled == null ? 0 : scheduled);
        r.put("completed", completed == null ? 0 : completed);
        r.put("cancelled", cancelled == null ? 0 : cancelled);
        r.put("attendance_rate", round2(attendancePct));
        r.put("popular_locations", popularLocations);
        r.put("weather_impact", weatherImpact);
        r.put("avg_travel_distance_km", round2(avgDistance == null ? 0 : avgDistance));
        r.put("cancellation_rate", round2(cancelRate));
        r.put("avg_success_rating", round2(avgSuccess == null ? 0 : avgSuccess));
        r.put("repeat_attendees", repeatAttendees == null ? 0 : repeatAttendees);
        return r;
    }

    /* ───────────────────── 3. Build & project stats ───────────────────── */
    public Map<String, Object> builds() {
        Map<String, Object> r = new LinkedHashMap<>();

        List<Map<String, Object>> popularModels = jdbc.query(
                "SELECT type, COUNT(*) c FROM builds GROUP BY type ORDER BY c DESC",
                (rs, i) -> Map.of("type", rs.getString("type"), "count", rs.getInt("c")));

        Integer total = jdbc.queryForObject("SELECT COUNT(*) FROM builds", Integer.class);
        Integer published = jdbc.queryForObject(
                "SELECT COUNT(*) FROM builds WHERE status = 'published'", Integer.class);
        double completionRate = total == null || total == 0
                ? 0 : (published == null ? 0 : (double) published / total);

        Double avgBuildDays = jdbc.queryForObject(
                "SELECT AVG(DATEDIFF('DAY', created_at, updated_at)) FROM builds " +
                        "WHERE status = 'published'",
                Double.class);

        List<Map<String, Object>> brands = jdbc.query(
                "SELECT flight_controller, COUNT(*) c FROM builds " +
                        "WHERE flight_controller IS NOT NULL " +
                        "GROUP BY flight_controller ORDER BY c DESC LIMIT 5",
                (rs, i) -> Map.of("flight_controller", rs.getString("flight_controller"),
                        "count", rs.getInt("c")));

        Double avgScore = jdbc.queryForObject(
                "SELECT AVG(score) FROM builds WHERE score > 0", Double.class);

        r.put("popular_models", popularModels);
        r.put("completion_rate", round2(completionRate));
        r.put("avg_build_duration_days", round2(avgBuildDays == null ? 0 : avgBuildDays));
        r.put("common_flight_controllers", brands);
        r.put("avg_difficulty_rating", round2(avgScore == null ? 0 : avgScore));
        r.put("tutorial_count", 0);
        return r;
    }

    /* ───────────────────── 4. Telemetry / performance ───────────────────── */
    public Map<String, Object> telemetry() {
        Map<String, Object> r = new LinkedHashMap<>();
        Double avgSpeed = jdbc.queryForObject(
                "SELECT AVG(max_speed_kmh) FROM telemetry", Double.class);
        Double maxSpeed = jdbc.queryForObject(
                "SELECT MAX(max_speed_kmh) FROM telemetry", Double.class);
        Double avgDuration = jdbc.queryForObject(
                "SELECT AVG(duration_sec) FROM telemetry", Double.class);
        Double maxDuration = jdbc.queryForObject(
                "SELECT MAX(duration_sec) FROM telemetry", Double.class);
        Double avgBattery = jdbc.queryForObject(
                "SELECT AVG(battery_used_pct) FROM telemetry", Double.class);
        Double avgRange = jdbc.queryForObject(
                "SELECT AVG(range_m) FROM telemetry", Double.class);
        Double avgAlt = jdbc.queryForObject(
                "SELECT AVG(max_altitude_m) FROM telemetry WHERE max_altitude_m > 0",
                Double.class);
        Integer crashes = jdbc.queryForObject(
                "SELECT SUM(crash_count) FROM telemetry", Integer.class);
        Double bestLap = jdbc.queryForObject(
                "SELECT MIN(lap_time_sec) FROM telemetry WHERE lap_time_sec IS NOT NULL",
                Double.class);

        List<Map<String, Object>> terrain = jdbc.query(
                "SELECT terrain, COUNT(*) c FROM telemetry " +
                        "WHERE terrain IS NOT NULL GROUP BY terrain ORDER BY c DESC",
                (rs, i) -> Map.of("terrain", rs.getString("terrain"),
                        "runs", rs.getInt("c")));

        r.put("avg_speed_kmh", round2(avgSpeed == null ? 0 : avgSpeed));
        r.put("top_speed_kmh", round2(maxSpeed == null ? 0 : maxSpeed));
        r.put("avg_flight_duration_sec", round2(avgDuration == null ? 0 : avgDuration));
        r.put("longest_flight_sec", round2(maxDuration == null ? 0 : maxDuration));
        r.put("avg_battery_used_pct", round2(avgBattery == null ? 0 : avgBattery));
        r.put("avg_range_m", round2(avgRange == null ? 0 : avgRange));
        r.put("avg_altitude_m", round2(avgAlt == null ? 0 : avgAlt));
        r.put("total_crashes", crashes == null ? 0 : crashes);
        r.put("best_lap_time_sec", round2(bestLap == null ? 0 : bestLap));
        r.put("terrain_breakdown", terrain);
        return r;
    }

    /* ───────────────────── 5. Geography ───────────────────── */
    public Map<String, Object> geography() {
        Map<String, Object> r = new LinkedHashMap<>();
        List<Map<String, Object>> cities = jdbc.query(
                "SELECT city, country, COUNT(*) runs, AVG(latitude) lat, AVG(longitude) lon " +
                        "FROM test_runs GROUP BY city, country ORDER BY runs DESC",
                (rs, i) -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("city", rs.getString("city"));
                    m.put("country", rs.getString("country"));
                    m.put("runs", rs.getInt("runs"));
                    m.put("latitude", rs.getDouble("lat"));
                    m.put("longitude", rs.getDouble("lon"));
                    return m;
                });

        List<Map<String, Object>> countries = jdbc.query(
                "SELECT country, COUNT(*) runs FROM test_runs " +
                        "GROUP BY country ORDER BY runs DESC",
                (rs, i) -> Map.of("country", rs.getString("country"),
                        "runs", rs.getInt("runs")));

        List<Map<String, Object>> regionalModels = jdbc.query(
                "SELECT tr.city, b.type, COUNT(*) c FROM test_runs tr " +
                        "JOIN builds b ON tr.build_id = b.id " +
                        "GROUP BY tr.city, b.type ORDER BY tr.city, c DESC",
                (rs, i) -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("city", rs.getString("city"));
                    m.put("type", rs.getString("type"));
                    m.put("count", rs.getInt("c"));
                    return m;
                });

        List<Map<String, Object>> seasonal = jdbc.query(
                "SELECT EXTRACT(MONTH FROM scheduled_at) m, COUNT(*) c FROM test_runs " +
                        "GROUP BY m ORDER BY m",
                (rs, i) -> Map.of("month", rs.getInt("m"), "runs", rs.getInt("c")));

        r.put("active_cities", cities);
        r.put("active_countries", countries);
        r.put("regional_model_preferences", regionalModels);
        r.put("seasonal_participation", seasonal);
        return r;
    }

    /* ───────────────────── 6. Marketplace ───────────────────── */
    public Map<String, Object> marketplace() {
        Map<String, Object> r = new LinkedHashMap<>();
        List<Map<String, Object>> topParts = jdbc.query(
                "SELECT part_category, COUNT(*) c FROM marketplace_listings " +
                        "GROUP BY part_category ORDER BY c DESC LIMIT 10",
                (rs, i) -> Map.of("part_category", rs.getString("part_category"),
                        "listings", rs.getInt("c")));

        Double avgPrice = jdbc.queryForObject(
                "SELECT AVG(price_pln) FROM marketplace_listings", Double.class);

        List<Map<String, Object>> brands = jdbc.query(
                "SELECT brand, COUNT(*) c FROM marketplace_listings " +
                        "GROUP BY brand ORDER BY c DESC LIMIT 5",
                (rs, i) -> Map.of("brand", rs.getString("brand"),
                        "listings", rs.getInt("c")));

        List<Map<String, Object>> conditionMix = jdbc.query(
                "SELECT condition_, COUNT(*) c FROM marketplace_listings " +
                        "GROUP BY condition_",
                (rs, i) -> Map.of("condition", rs.getString("condition_"),
                        "listings", rs.getInt("c")));

        Integer active = jdbc.queryForObject(
                "SELECT COUNT(*) FROM marketplace_listings WHERE status = 'active'",
                Integer.class);
        Integer sold = jdbc.queryForObject(
                "SELECT COUNT(*) FROM marketplace_listings WHERE status = 'sold'",
                Integer.class);

        r.put("most_traded_parts", topParts);
        r.put("avg_listing_price_pln", round2(avgPrice == null ? 0 : avgPrice));
        r.put("popular_brands", brands);
        r.put("condition_mix", conditionMix);
        r.put("active_listings", active == null ? 0 : active);
        r.put("sold_listings", sold == null ? 0 : sold);
        return r;
    }

    /* ───────────────────── 7. Social reputation ───────────────────── */
    public Map<String, Object> social() {
        Map<String, Object> r = new LinkedHashMap<>();
        List<Map<String, Object>> topBuilders = jdbc.query(
                "SELECT u.username, r.builder_score, r.skill_level FROM reputation r " +
                        "JOIN users u ON r.user_id = u.id ORDER BY r.builder_score DESC LIMIT 5",
                (rs, i) -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("username", rs.getString("username"));
                    m.put("score", round2(rs.getDouble("builder_score")));
                    m.put("skill_level", rs.getString("skill_level"));
                    return m;
                });
        List<Map<String, Object>> topHelpers = jdbc.query(
                "SELECT u.username, r.helpfulness_score FROM reputation r " +
                        "JOIN users u ON r.user_id = u.id ORDER BY r.helpfulness_score DESC LIMIT 5",
                (rs, i) -> Map.of("username", rs.getString("username"),
                        "score", round2(rs.getDouble("helpfulness_score"))));
        List<Map<String, Object>> topOrganizers = jdbc.query(
                "SELECT u.username, r.organizer_score FROM reputation r " +
                        "JOIN users u ON r.user_id = u.id ORDER BY r.organizer_score DESC LIMIT 5",
                (rs, i) -> Map.of("username", rs.getString("username"),
                        "score", round2(rs.getDouble("organizer_score"))));
        Double avgRel = jdbc.queryForObject(
                "SELECT AVG(reliability_score) FROM reputation", Double.class);
        List<Map<String, Object>> skillProgression = jdbc.query(
                "SELECT skill_level, COUNT(*) c FROM reputation GROUP BY skill_level",
                (rs, i) -> Map.of("skill_level", rs.getString("skill_level"),
                        "count", rs.getInt("c")));

        r.put("top_builders", topBuilders);
        r.put("top_helpful_collaborators", topHelpers);
        r.put("best_organizers", topOrganizers);
        r.put("avg_reliability_score", round2(avgRel == null ? 0 : avgRel));
        r.put("skill_progression", skillProgression);
        return r;
    }

    /* ───────────────────── 8. AI / Recommendations ───────────────────── */
    public Map<String, Object> ai(UUID userId) {
        Map<String, Object> r = new LinkedHashMap<>();

        // Suggested collaborators = top builders in user's most-built type
        List<Map<String, Object>> suggested;
        if (userId != null) {
            String myTopType = jdbc.query(
                    "SELECT type FROM builds WHERE owner_id = ? GROUP BY type " +
                            "ORDER BY COUNT(*) DESC LIMIT 1",
                    rs -> rs.next() ? rs.getString("type") : null, userId);
            if (myTopType != null) {
                suggested = jdbc.query(
                        "SELECT DISTINCT u.username, u.id FROM builds b " +
                                "JOIN users u ON b.owner_id = u.id " +
                                "WHERE b.type = ? AND u.id <> ? LIMIT 5",
                        (rs, i) -> Map.of("username", rs.getString("username"),
                                "user_id", rs.getString("id")),
                        myTopType, userId);
            } else {
                suggested = List.of();
            }
        } else {
            suggested = jdbc.query(
                    "SELECT u.username, u.id FROM reputation r " +
                            "JOIN users u ON r.user_id = u.id " +
                            "ORDER BY r.builder_score DESC LIMIT 5",
                    (rs, i) -> Map.of("username", rs.getString("username"),
                            "user_id", rs.getString("id")));
        }

        // Suggested locations = most-attended cities
        List<Map<String, Object>> suggestedLocations = jdbc.query(
                "SELECT city, AVG(success_rating) avg_r, COUNT(*) c FROM test_runs " +
                        "WHERE status = 'completed' GROUP BY city " +
                        "ORDER BY avg_r DESC LIMIT 5",
                (rs, i) -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("city", rs.getString("city"));
                    m.put("avg_rating", round2(rs.getDouble("avg_r")));
                    m.put("runs", rs.getInt("c"));
                    return m;
                });

        // Trending build category = most created in last 30 days
        OffsetDateTime month = OffsetDateTime.now().minusDays(30);
        List<Map<String, Object>> trending = jdbc.query(
                "SELECT type, COUNT(*) c FROM builds WHERE created_at >= ? " +
                        "GROUP BY type ORDER BY c DESC LIMIT 3",
                (rs, i) -> Map.of("type", rs.getString("type"),
                        "new_builds", rs.getInt("c")),
                month);

        // Maintenance alerts = builds with >5 crash_count cumulative
        List<Map<String, Object>> maintenance = jdbc.query(
                "SELECT b.id, b.title, SUM(t.crash_count) crashes FROM builds b " +
                        "JOIN telemetry t ON t.build_id = b.id " +
                        "GROUP BY b.id, b.title HAVING SUM(t.crash_count) >= 3 " +
                        "ORDER BY crashes DESC LIMIT 5",
                (rs, i) -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("build_id", rs.getString("id"));
                    m.put("title", rs.getString("title"));
                    m.put("total_crashes", rs.getInt("crashes"));
                    m.put("alert", "Consider inspecting frame + motors");
                    return m;
                });

        // Event predictions = upcoming scheduled run count + best weather forecast match
        Integer upcoming = jdbc.queryForObject(
                "SELECT COUNT(*) FROM test_runs WHERE status = 'scheduled' " +
                        "AND scheduled_at > CURRENT_TIMESTAMP",
                Integer.class);

        r.put("suggested_collaborators", suggested);
        r.put("suggested_test_locations", suggestedLocations);
        r.put("trending_categories", trending);
        r.put("maintenance_alerts", maintenance);
        r.put("upcoming_events", upcoming == null ? 0 : upcoming);
        r.put("event_prediction", upcoming != null && upcoming > 3
                ? "high_activity_window" : "low_activity_window");
        return r;
    }

    /* ───────────────────── Dashboard summary (admin/home) ───────────────────── */
    public Map<String, Object> dashboard() {
        Map<String, Object> r = new LinkedHashMap<>();
        OffsetDateTime day = OffsetDateTime.now().minusDays(1);
        Integer activePilots = jdbc.queryForObject(
                "SELECT COUNT(DISTINCT user_id) FROM test_run_attendees ta " +
                        "JOIN test_runs tr ON tr.id = ta.test_run_id " +
                        "WHERE tr.scheduled_at >= ?", Integer.class, day);
        Integer scheduledRuns = jdbc.queryForObject(
                "SELECT COUNT(*) FROM test_runs WHERE status = 'scheduled'", Integer.class);
        String topType = jdbc.query(
                "SELECT type, COUNT(*) c FROM builds GROUP BY type ORDER BY c DESC LIMIT 1",
                rs -> rs.next() ? rs.getString("type") : "n/a");
        Double avgAttendance = jdbc.queryForObject(
                "SELECT AVG(c) FROM (SELECT COUNT(*) c FROM test_run_attendees " +
                        "WHERE attended = TRUE GROUP BY test_run_id) ag",
                Double.class);
        Double fastest = jdbc.queryForObject(
                "SELECT MAX(t.max_speed_kmh) FROM telemetry t JOIN builds b ON t.build_id = b.id " +
                        "WHERE b.type = 'car'", Double.class);
        Double longestFlight = jdbc.queryForObject(
                "SELECT MAX(t.duration_sec) FROM telemetry t JOIN builds b ON t.build_id = b.id " +
                        "WHERE b.type IN ('drone','fixed_wing','helicopter')", Double.class);

        r.put("active_pilots_today", activePilots == null ? 0 : activePilots);
        r.put("scheduled_runs", scheduledRuns == null ? 0 : scheduledRuns);
        r.put("most_popular_category", topType);
        r.put("avg_attendance", round2(avgAttendance == null ? 0 : avgAttendance));
        r.put("fastest_car_kmh", round2(fastest == null ? 0 : fastest));
        r.put("longest_flight_sec", round2(longestFlight == null ? 0 : longestFlight));
        return r;
    }

    private static double round2(double v) { return Math.round(v * 100.0) / 100.0; }
}
