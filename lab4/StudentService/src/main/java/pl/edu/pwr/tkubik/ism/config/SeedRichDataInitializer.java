package pl.edu.pwr.tkubik.ism.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

/**
 * Seeds analytics-grade rich data on first run:
 *   - 10 extra members across Polish cities with reputation rows
 *   - 24 test runs (past + upcoming) with attendees, weather, GPS
 *   - 60 telemetry rows across drone/plane/boat/heli/car builds
 *   - 20 marketplace listings (parts trade)
 *   - 30 direct messages
 *   - 6 car-type builds (so all 5 vehicle types are populated)
 * Idempotent: skips if first rich-seed user already exists.
 */
@Configuration
public class SeedRichDataInitializer {

    private static final Logger log = LoggerFactory.getLogger(SeedRichDataInitializer.class);
    private static final UUID FIRST_USER = UUID.fromString("00000000-0000-0000-0000-000000000020");

    private record SeedUser(UUID id, String username, String email, String skill) {}
    private record SeedRun(int dayOffset, String city, String country, double lat, double lon,
                           String weather, int maxP, String status, double rating) {}
    private record SeedListing(String title, String partCategory, String brand, String cond,
                               double pricePln, String description) {}

    private static final List<SeedUser> USERS = List.of(
            new SeedUser(FIRST_USER, "anna_drone", "anna@modellingclub.local", "expert"),
            new SeedUser(uuid(0x21), "marek_fpv", "marek@modellingclub.local", "master"),
            new SeedUser(uuid(0x22), "kasia_glider", "kasia@modellingclub.local", "intermediate"),
            new SeedUser(uuid(0x23), "piotr_rc", "piotr@modellingclub.local", "expert"),
            new SeedUser(uuid(0x24), "tomek_heli", "tomek@modellingclub.local", "intermediate"),
            new SeedUser(uuid(0x25), "ola_scale", "ola@modellingclub.local", "novice"),
            new SeedUser(uuid(0x26), "jan_boat", "jan@modellingclub.local", "expert"),
            new SeedUser(uuid(0x27), "ewa_pilot", "ewa@modellingclub.local", "intermediate"),
            new SeedUser(uuid(0x28), "michal_car", "michal@modellingclub.local", "master"),
            new SeedUser(uuid(0x29), "zofia_aero", "zofia@modellingclub.local", "novice")
    );

    private static final List<SeedRun> RUNS = List.of(
            new SeedRun(-21, "Wrocław", "PL", 51.1079, 17.0385, "SUNNY", 10, "completed", 4.6),
            new SeedRun(-18, "Warsaw", "PL", 52.2297, 21.0122, "CLOUDY", 8, "completed", 4.1),
            new SeedRun(-15, "Kraków", "PL", 50.0647, 19.9450, "WINDY", 12, "completed", 3.8),
            new SeedRun(-12, "Gdańsk", "PL", 54.3520, 18.6466, "SUNNY", 15, "completed", 4.9),
            new SeedRun(-10, "Wrocław", "PL", 51.1100, 17.0500, "RAIN", 6, "cancelled", 0.0),
            new SeedRun(-8,  "Poznań", "PL", 52.4064, 16.9252, "SUNNY", 10, "completed", 4.3),
            new SeedRun(-7,  "Łódź", "PL", 51.7592, 19.4560, "CLOUDY", 9, "completed", 4.0),
            new SeedRun(-5,  "Wrocław", "PL", 51.1078, 17.0386, "SUNNY", 12, "completed", 4.7),
            new SeedRun(-4,  "Berlin", "DE", 52.5200, 13.4050, "WINDY", 20, "completed", 4.2),
            new SeedRun(-3,  "Prague", "CZ", 50.0755, 14.4378, "SUNNY", 14, "completed", 4.5),
            new SeedRun(-2,  "Wrocław", "PL", 51.1095, 17.0392, "CLOUDY", 10, "completed", 4.0),
            new SeedRun(-1,  "Warsaw", "PL", 52.2300, 21.0125, "SUNNY", 8, "completed", 4.4),
            new SeedRun(1,   "Wrocław", "PL", 51.1080, 17.0388, "SUNNY", 15, "scheduled", 0.0),
            new SeedRun(2,   "Kraków", "PL", 50.0650, 19.9455, "CLOUDY", 12, "scheduled", 0.0),
            new SeedRun(3,   "Gdańsk", "PL", 54.3525, 18.6470, "WINDY", 20, "scheduled", 0.0),
            new SeedRun(5,   "Wrocław", "PL", 51.1085, 17.0395, "SUNNY", 10, "scheduled", 0.0),
            new SeedRun(7,   "Poznań", "PL", 52.4065, 16.9255, "SUNNY", 14, "scheduled", 0.0),
            new SeedRun(9,   "Warsaw", "PL", 52.2298, 21.0128, "CLOUDY", 16, "scheduled", 0.0),
            new SeedRun(12,  "Łódź", "PL", 51.7595, 19.4565, "SUNNY", 8, "scheduled", 0.0),
            new SeedRun(14,  "Wrocław", "PL", 51.1075, 17.0380, "SUNNY", 20, "scheduled", 0.0),
            new SeedRun(17,  "Berlin", "DE", 52.5205, 13.4055, "CLOUDY", 25, "scheduled", 0.0),
            new SeedRun(20,  "Prague", "CZ", 50.0760, 14.4380, "SUNNY", 18, "scheduled", 0.0),
            new SeedRun(-30, "Wrocław", "PL", 51.1090, 17.0390, "SUNNY", 10, "completed", 4.8),
            new SeedRun(-25, "Kraków", "PL", 50.0645, 19.9445, "CLOUDY", 11, "completed", 4.2)
    );

    private static final List<SeedListing> LISTINGS = List.of(
            new SeedListing("EMAX RS2205 2300KV brushless motor (pair)", "motor", "EMAX", "used", 95.0, "Pair, low hours, balanced. Pulled from working quad."),
            new SeedListing("BLHeli32 45A 4-in-1 ESC", "esc", "T-Motor", "new", 280.0, "Sealed. Supports DShot600."),
            new SeedListing("CNHL Black Series 1300mAh 6S 100C LiPo", "battery", "CNHL", "new", 145.0, "Brand new pack, fresh cells."),
            new SeedListing("GemFan Hurricane 51466 props (10 pcs)", "propeller", "GemFan", "new", 60.0, "5\" tri-blade, 10-pack mixed colors."),
            new SeedListing("TBS Crossfire Nano RX V2", "radio", "TBS", "used", 220.0, "Working perfect, firmware up to date."),
            new SeedListing("Holybro Kakute H7 V2 flight controller", "fc", "Holybro", "new", 380.0, "H7 dual-camera support, MPU6000."),
            new SeedListing("DJI O3 Air Unit + goggles bundle", "video", "DJI", "used", 2400.0, "Goggles 2 + air unit, ~30 flights."),
            new SeedListing("Foxeer Razer Mini 1200TVL FPV camera", "camera", "Foxeer", "new", 130.0, "Latest revision, low-light tuned."),
            new SeedListing("Armattan Marmotte 5\" carbon frame", "frame", "Armattan", "used", 410.0, "Lifetime warranty intact, minor scratches."),
            new SeedListing("RunCam Thumb Pro action camera", "camera", "RunCam", "new", 480.0, "4K naked-gopro, no marks."),
            new SeedListing("ZOHD Dart XL 1000mm wing PNP", "airframe", "ZOHD", "used", 650.0, "EPP wing, dual servos, includes motor."),
            new SeedListing("Castle Mamba X 25.2V brushless ESC", "esc", "Castle Creations", "new", 720.0, "RC car ESC, sensored capable."),
            new SeedListing("Traxxas Slash 4x4 chassis + electronics", "chassis", "Traxxas", "used", 980.0, "Roller + ESC + motor combo. No battery."),
            new SeedListing("Align T-Rex 470L main blades carbon", "blade", "Align", "new", 240.0, "Stock spare set, sealed."),
            new SeedListing("Spektrum DX6e transmitter", "radio", "Spektrum", "used", 380.0, "Mode 2, AA tray, working perfectly."),
            new SeedListing("Tamiya 1:48 Bf-109 plastic kit", "kit", "Tamiya", "new", 110.0, "Sealed kit, includes decals."),
            new SeedListing("Vallejo Model Air paint set (16 colors)", "paint", "Vallejo", "new", 220.0, "WWII Luftwaffe palette."),
            new SeedListing("Pro-Boat Veles 29 RC catamaran hull", "hull", "Pro-Boat", "used", 450.0, "Bare hull, no electronics."),
            new SeedListing("Hobbywing SeaKing 180A water-cooled ESC", "esc", "Hobbywing", "new", 540.0, "For RC boats, 1:8 scale."),
            new SeedListing("ZTW Beatles 32bit 45A ESC", "esc", "ZTW", "new", 240.0, "ESC32 protocol support.")
    );

    @Bean
    @Order(30)
    public ApplicationRunner seedRichData(JdbcTemplate jdbc, PasswordEncoder encoder) {
        return args -> seed(jdbc, encoder);
    }

    @Transactional
    public void seed(JdbcTemplate jdbc, PasswordEncoder encoder) {
        Integer exists = jdbc.queryForObject(
                "SELECT COUNT(*) FROM USERS WHERE id = ?", Integer.class, FIRST_USER);
        if (exists != null && exists > 0) return;

        OffsetDateTime now = OffsetDateTime.now();
        Random rnd = new Random(42);

        // 1) Users
        String hashed = encoder.encode("Password1");
        for (SeedUser u : USERS) {
            jdbc.update(
                    "INSERT INTO USERS (id, username, email, password, role, created_at) " +
                            "VALUES (?, ?, ?, ?, ?, ?)",
                    u.id(), u.username(), u.email(), hashed, "member",
                    now.minusDays(90 + rnd.nextInt(180)));
        }

        // 2) Reputation rows
        for (SeedUser u : USERS) {
            jdbc.update(
                    "INSERT INTO reputation (id, user_id, builder_score, helpfulness_score, " +
                            "organizer_score, reliability_score, skill_level, updated_at) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), u.id(),
                    3.0 + rnd.nextDouble() * 2.0,
                    3.0 + rnd.nextDouble() * 2.0,
                    2.0 + rnd.nextDouble() * 3.0,
                    3.5 + rnd.nextDouble() * 1.5,
                    u.skill(), now);
        }

        // 3) Car-type builds (vehicle coverage)
        seedCarBuilds(jdbc, now);

        // 4) Test runs + attendees, anchored to existing seed builds
        List<UUID> buildIds = jdbc.queryForList("SELECT id FROM BUILDS", UUID.class);
        if (buildIds.isEmpty()) return;

        for (int i = 0; i < RUNS.size(); i++) {
            SeedRun r = RUNS.get(i);
            UUID runId = UUID.randomUUID();
            UUID organizer = USERS.get(i % USERS.size()).id();
            UUID build = buildIds.get(rnd.nextInt(buildIds.size()));
            jdbc.update(
                    "INSERT INTO test_runs (id, build_id, organizer_id, scheduled_at, " +
                            "location_name, latitude, longitude, country, city, weather, " +
                            "max_participants, status, success_rating, created_at) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    runId, build, organizer, now.plusDays(r.dayOffset()),
                    r.city() + " Modellers Field",
                    r.lat(), r.lon(), r.country(), r.city(), r.weather(),
                    r.maxP(), r.status(), r.rating(), now.minusDays(5));

            // 3-7 attendees per run
            int attCount = 3 + rnd.nextInt(5);
            for (int j = 0; j < attCount && j < USERS.size(); j++) {
                jdbc.update(
                        "INSERT INTO test_run_attendees (id, test_run_id, user_id, attended, distance_km) " +
                                "VALUES (?, ?, ?, ?, ?)",
                        UUID.randomUUID(), runId, USERS.get(j).id(),
                        r.status().equals("completed") ? rnd.nextDouble() > 0.15 : null,
                        5.0 + rnd.nextDouble() * 200.0);
            }
        }

        // 5) Telemetry — 5 rows per existing build
        for (UUID buildId : buildIds) {
            String type = jdbc.queryForObject(
                    "SELECT type FROM BUILDS WHERE id = ?", String.class, buildId);
            for (int k = 0; k < 5; k++) {
                Double speed, alt, lap;
                Integer duration, range, crashes;
                String terrain;
                switch (type) {
                    case "drone" -> {
                        speed = 80.0 + rnd.nextDouble() * 60.0;
                        alt = 30.0 + rnd.nextDouble() * 80.0;
                        duration = 240 + rnd.nextInt(360);
                        range = 200 + rnd.nextInt(1500);
                        crashes = rnd.nextInt(3);
                        terrain = "open_field";
                        lap = null;
                    }
                    case "fixed_wing" -> {
                        speed = 50.0 + rnd.nextDouble() * 80.0;
                        alt = 80.0 + rnd.nextDouble() * 200.0;
                        duration = 600 + rnd.nextInt(1800);
                        range = 1000 + rnd.nextInt(5000);
                        crashes = rnd.nextInt(2);
                        terrain = "hill";
                        lap = null;
                    }
                    case "helicopter" -> {
                        speed = 60.0 + rnd.nextDouble() * 40.0;
                        alt = 20.0 + rnd.nextDouble() * 60.0;
                        duration = 300 + rnd.nextInt(600);
                        range = 100 + rnd.nextInt(800);
                        crashes = rnd.nextInt(2);
                        terrain = "open_field";
                        lap = null;
                    }
                    case "boat" -> {
                        speed = 40.0 + rnd.nextDouble() * 60.0;
                        alt = 0.0;
                        duration = 600 + rnd.nextInt(900);
                        range = 500 + rnd.nextInt(2000);
                        crashes = rnd.nextInt(2);
                        terrain = "lake";
                        lap = 18.0 + rnd.nextDouble() * 12.0;
                    }
                    case "car" -> {
                        speed = 50.0 + rnd.nextDouble() * 80.0;
                        alt = 0.0;
                        duration = 300 + rnd.nextInt(600);
                        range = 200 + rnd.nextInt(800);
                        crashes = rnd.nextInt(3);
                        terrain = "asphalt";
                        lap = 15.0 + rnd.nextDouble() * 10.0;
                    }
                    default -> { continue; }
                }
                jdbc.update(
                        "INSERT INTO telemetry (id, build_id, recorded_at, max_speed_kmh, duration_sec, " +
                                "battery_used_pct, range_m, max_altitude_m, crash_count, terrain, lap_time_sec) " +
                                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        UUID.randomUUID(), buildId, now.minusDays(rnd.nextInt(60)),
                        speed, duration, 50.0 + rnd.nextDouble() * 45.0,
                        range, alt, crashes, terrain, lap);
            }
        }

        // 6) Marketplace listings
        for (int i = 0; i < LISTINGS.size(); i++) {
            SeedListing L = LISTINGS.get(i);
            jdbc.update(
                    "INSERT INTO marketplace_listings (id, seller_id, build_id, title, part_category, " +
                            "brand, condition_, price_pln, currency, status, description, created_at) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), USERS.get(i % USERS.size()).id(), null,
                    L.title(), L.partCategory(), L.brand(), L.cond(),
                    L.pricePln(), "PLN",
                    rnd.nextDouble() > 0.25 ? "active" : "sold",
                    L.description(),
                    now.minusDays(rnd.nextInt(45)));
        }

        // 7) Messages
        int[] hourPool = {9, 10, 12, 13, 15, 17, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23};
        for (int i = 0; i < 30; i++) {
            UUID a = USERS.get(rnd.nextInt(USERS.size())).id();
            UUID b;
            do { b = USERS.get(rnd.nextInt(USERS.size())).id(); } while (b.equals(a));
            int daysBack = rnd.nextInt(45);
            int hour = hourPool[rnd.nextInt(hourPool.length)];
            int min = rnd.nextInt(60);
            int sec = rnd.nextInt(60);
            OffsetDateTime ts = now.minusDays(daysBack)
                    .withHour(hour).withMinute(min).withSecond(sec).withNano(0);
            jdbc.update(
                    "INSERT INTO messages (id, sender_id, recipient_id, content, read_flag, created_at) " +
                            "VALUES (?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), a, b,
                    SAMPLE_MESSAGES[i % SAMPLE_MESSAGES.length],
                    rnd.nextBoolean(),
                    ts);
        }

        log.info("Seeded rich data: {} users, {} runs, {} listings, telemetry + messages",
                USERS.size(), RUNS.size(), LISTINGS.size());
    }

    private void seedCarBuilds(JdbcTemplate jdbc, OffsetDateTime now) {
        List<String[]> cars = List.of(
                new String[]{"Traxxas Slash 4x4 brushless", "Short-course truck with Castle Mamba X swap. 80 km/h on grass.", "published"},
                new String[]{"Tamiya TT-02 Touring Car", "Beginner 1:10 touring car. Stock motor swap to brushless.", "published"},
                new String[]{"HPI Savage XS Flux 1:12 monster truck", "Brushless mini monster, indoor bash setup.", "published"},
                new String[]{"Arrma Kraton 6S BLX", "1:8 speed monster, ProLine tires, 90 km/h tested.", "published"},
                new String[]{"Losi Mini-T 2.0 stadium truck", "1:18 brushed bash truck, fun project for kids.", "draft"},
                new String[]{"Element RC Enduro Trail Truck", "Crawler scale build, 4-link rear suspension.", "published"}
        );
        UUID seller = USERS.get(8).id(); // michal_car
        for (int i = 0; i < cars.size(); i++) {
            String[] c = cars.get(i);
            UUID id = UUID.fromString(String.format("22222222-2222-2222-2222-%012d", i + 1));
            Integer exists = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM BUILDS WHERE id = ?", Integer.class, id);
            if (exists != null && exists > 0) continue;
            jdbc.update(
                    "INSERT INTO BUILDS (id, title, type, description, status, owner_id, " +
                            "wheelbase_mm, score, created_at, updated_at) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    id, c[0], "car", c[1], c[2], seller,
                    280 + i * 12, 0f, now, now);
        }
    }

    private static UUID uuid(int last) {
        return UUID.fromString(String.format("00000000-0000-0000-0000-0000000000%02x", last));
    }

    private static final String[] SAMPLE_MESSAGES = {
            "Hey, nice build! Which ESC would you recommend for a 5\" freestyle?",
            "Are you flying at Pole Marsowe on Saturday? Forecast looks decent.",
            "Still have that frame for sale? I can pick it up after work tomorrow.",
            "Thanks for the PID tuning tips — second flight today and it locks in solid.",
            "Is 6S on that motor not a bit much? Mine got hot fast last weekend.",
            "I can bring my camera Sunday and shoot some footage of your bird.",
            "Meet-up cancelled — wind gusts above 12 m/s, not worth the props.",
            "Got a few spare 5\" props if you need any before the race.",
            "Did your battery pack arrive yet? Mine is stuck in customs.",
            "Cool car build. What gearing are you running for the brushless swap?",
            "Send me the BetaFlight dump when you get a chance, want to compare rates.",
            "I'll be late to the meet, traffic on A4 is brutal.",
            "Anyone has a spare XT60 to XT90 adapter I can borrow Saturday?",
            "Bring the spare LiPo charger if you can, mine died yesterday.",
            "Saw your scale Bf-109 on Explore — paintwork is insane, what brand?",
            "Pushed the maiden flight to next weekend, CG is still off.",
            "Heli rotor head arrived, will install tonight and test hover tomorrow.",
            "Anybody driving from Kraków on Sunday? I can split fuel.",
            "Quick question — does that flight controller support DJI O3?",
            "I dropped the price on the Tamiya kit, let me know if still interested.",
            "Try lowering D-term on roll by 4 points, helped me a lot.",
            "Crashed at the field today, props gone but frame survived.",
            "Confirmed for the boat meet at Bagry on June 7th, weather looks ok.",
            "Marketplace listing for the gimbal still up? Friend is asking."
    };
}
