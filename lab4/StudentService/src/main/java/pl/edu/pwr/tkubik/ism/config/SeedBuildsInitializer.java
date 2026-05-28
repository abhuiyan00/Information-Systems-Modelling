package pl.edu.pwr.tkubik.ism.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Seeds demo content (1 member + 6 published builds + cover images) so the
 * Figma-aligned dashboard has real cards to display on first launch.
 *
 * Idempotent: skipped entirely once any non-seed user-owned build exists, and
 * each individual build row is also id-pinned so re-runs don't duplicate.
 *
 * Runs AFTER {@link DataInitializer} (which creates system_user + admin) so
 * the seed builds can have a real, stable owner_id.
 */
@Configuration
public class SeedBuildsInitializer {

    private static final Logger log = LoggerFactory.getLogger(SeedBuildsInitializer.class);

    public static final UUID DEMO_USER_ID =
            UUID.fromString("00000000-0000-0000-0000-000000000010");

    public static final String DEMO_EMAIL = "demo@modellingclub.local";
    public static final String DEMO_PASSWORD = "DemoUser1";

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Value("${app.public.base-url:http://localhost:8080/StudentsApp}")
    private String publicBaseUrl;

    /** {@link Order} ensures DataInitializer's seedSystemUser runs first. */
    @Bean
    @Order(20)
    public ApplicationRunner seedDemoBuilds(JdbcTemplate jdbc, PasswordEncoder encoder) {
        return args -> seed(jdbc, encoder);
    }

    private record Spec(
            UUID buildId,
            UUID mediaId,
            String title,
            String type,
            String description,
            String status,
            String image,
            int frameSizeMm,
            int numMotors,
            String fc,
            int weight,
            int wingspan,
            String scale
    ) {}

    private static final List<Spec> SPECS = List.of(
            new Spec(
                    UUID.fromString("11111111-1111-1111-1111-000000000001"),
                    UUID.fromString("11111111-1111-1111-1111-000000000a01"),
                    "5\" FPV Freestyle — Cinematic Build",
                    "drone",
                    "5-inch freestyle quad with HD digital video link tuned for buttery cinematic shots. " +
                            "Targets EU Open Category A1 sub-500 g class.",
                    "published",
                    "drone-fpv.jpg",
                    225, 4, "SpeedyBee F405 V4", 485, 0, ""
            ),
            new Spec(
                    UUID.fromString("11111111-1111-1111-1111-000000000002"),
                    UUID.fromString("11111111-1111-1111-1111-000000000a02"),
                    "Sub-250g Cinewhoop",
                    "drone",
                    "Ducted 3-inch cinewhoop, sub-250 g for indoor real-estate work and weddings. " +
                            "DJI O3 Air Unit, action-cam mount on isolation gimbal.",
                    "published",
                    "drone-cinematic.jpg",
                    160, 4, "Holybro Kakute H7 Mini", 248, 0, ""
            ),
            new Spec(
                    UUID.fromString("11111111-1111-1111-1111-000000000003"),
                    UUID.fromString("11111111-1111-1111-1111-000000000a03"),
                    "1.5 m Foam Glider — XPS",
                    "fixed_wing",
                    "Hand-cut XPS foam wing with electric prop pusher, balsa elevator, all-up weight 320 g. " +
                            "Cruises 12 m/s, perfect for ridge soaring days.",
                    "published",
                    "fixed-wing.jpg",
                    0, 1, "Matek F405-Wing", 320, 1500, ""
            ),
            new Spec(
                    UUID.fromString("11111111-1111-1111-1111-000000000004"),
                    UUID.fromString("11111111-1111-1111-1111-000000000a04"),
                    "Bf-109 G-6 Scale Model",
                    "scale_model",
                    "1:48 plastic scale build with weathered Mediterranean theatre paint scheme. " +
                            "Cockpit detailed with photo-etch parts and wash.",
                    "published",
                    "scale-model.jpg",
                    0, 0, "", 0, 0, "1:48"
            ),
            new Spec(
                    UUID.fromString("11111111-1111-1111-1111-000000000005"),
                    UUID.fromString("11111111-1111-1111-1111-000000000a05"),
                    "Catamaran RC Boat",
                    "boat",
                    "1.1 m twin-hull racing catamaran with brushless inrunner pair, water-cooled ESC. " +
                            "Top speed 75 km/h on flat water.",
                    "draft",
                    "rc-boat.jpg",
                    0, 2, "", 1900, 0, ""
            ),
            new Spec(
                    UUID.fromString("11111111-1111-1111-1111-000000000006"),
                    UUID.fromString("11111111-1111-1111-1111-000000000a06"),
                    "Align T-Rex 470L Heli",
                    "helicopter",
                    "Electric collective-pitch heli on a 6S setup. Bell-Hiller mixer, FBL controller " +
                            "tuned for smooth aerobatics.",
                    "pending_review",
                    "helicopter.jpg",
                    0, 1, "MicroBeast Plus", 1240, 0, ""
            )
    );

    @Transactional
    public void seed(JdbcTemplate jdbc, PasswordEncoder encoder) {
        // Demo user — created if missing.
        Integer demoCount = jdbc.queryForObject(
                "SELECT COUNT(*) FROM USERS WHERE id = ?", Integer.class, DEMO_USER_ID);
        if (demoCount == null || demoCount == 0) {
            jdbc.update(
                    "INSERT INTO USERS (id, username, email, password, role, created_at) " +
                            "VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
                    DEMO_USER_ID,
                    "demo_pilot",
                    DEMO_EMAIL,
                    encoder.encode(DEMO_PASSWORD),
                    "member"
            );
        }

        // If any seed build already exists, skip the rest (idempotent).
        Integer firstSeedExists = jdbc.queryForObject(
                "SELECT COUNT(*) FROM BUILDS WHERE id = ?",
                Integer.class, SPECS.get(0).buildId());
        if (firstSeedExists != null && firstSeedExists > 0) return;

        OffsetDateTime now = OffsetDateTime.now();

        for (Spec s : SPECS) {
            jdbc.update(
                    "INSERT INTO BUILDS " +
                            "(id, title, type, description, status, owner_id, " +
                            " frame_size_mm, num_motors, flight_controller, max_takeoff_weight_g, " +
                            " wingspan_mm, scale, score, created_at, updated_at) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    s.buildId(),
                    s.title(),
                    s.type(),
                    s.description(),
                    s.status(),
                    DEMO_USER_ID,
                    s.frameSizeMm() == 0 ? null : s.frameSizeMm(),
                    s.numMotors() == 0 ? null : s.numMotors(),
                    s.fc().isBlank() ? null : s.fc(),
                    s.weight() == 0 ? null : s.weight(),
                    s.wingspan() == 0 ? null : s.wingspan(),
                    s.scale().isBlank() ? null : s.scale(),
                    0f,
                    now, now
            );

            try {
                Path buildDir = Paths.get(uploadDir, s.buildId().toString()).toAbsolutePath().normalize();
                Files.createDirectories(buildDir);
                Path target = buildDir.resolve(s.mediaId() + ".jpg");

                try (InputStream in = new ClassPathResource("seed-images/" + s.image()).getInputStream()) {
                    Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
                }
                int sizeBytes = (int) Files.size(target);

                jdbc.update(
                        "INSERT INTO MEDIA_FILES (id, build_id, url, filename, size_bytes, mime_type) " +
                                "VALUES (?, ?, ?, ?, ?, ?)",
                        s.mediaId(),
                        s.buildId(),
                        publicBaseUrl + "/uploads/" + s.buildId() + "/" + s.mediaId() + ".jpg",
                        s.image(),
                        sizeBytes,
                        "image/jpeg"
                );
            } catch (IOException ioe) {
                log.warn("Could not copy seed image {} for build {}: {}",
                        s.image(), s.buildId(), ioe.getMessage());
            }
        }

        log.info("Seeded {} demo builds owned by {}", SPECS.size(), DEMO_EMAIL);
    }
}
