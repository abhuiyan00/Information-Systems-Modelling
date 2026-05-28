package pl.edu.pwr.tkubik.ism.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Seeds two deterministic users on startup:
 *
 *   1) "system_user" (id 0...001) — placeholder owner for orphaned data
 *      after a member deletes their account. Cannot be logged into:
 *      its password column is the literal "not-used" which never bcrypt-matches.
 *
 *   2) "admin" (id 0...002) — a real, loggable administrator account so
 *      the moderation UI is reachable out-of-the-box.
 *      Email:    admin&#64;modellingclub.local
 *      Password: admin123
 *      Role:     admin
 *
 * Using JdbcTemplate (not the JPA repository) lets us pin a UUID even though
 * UserEntity is annotated with @GeneratedValue(strategy = GenerationType.UUID).
 *
 * Idempotent: each seed checks COUNT(*) by id first, so restarts under
 * ddl-auto=update are safe.
 */
@Configuration
public class DataInitializer {

    public static final UUID SYSTEM_USER_ID =
            UUID.fromString("00000000-0000-0000-0000-000000000001");

    public static final UUID DEFAULT_ADMIN_ID =
            UUID.fromString("00000000-0000-0000-0000-000000000002");

    public static final String DEFAULT_ADMIN_EMAIL = "admin@modellingclub.local";
    public static final String DEFAULT_ADMIN_PASSWORD = "admin123";

    @Bean
    @Order(10)
    public ApplicationRunner seedSystemUser(JdbcTemplate jdbc, PasswordEncoder encoder) {
        return args -> seed(jdbc, encoder);
    }

    @Transactional
    public void seed(JdbcTemplate jdbc, PasswordEncoder encoder) {
        Integer systemCount = jdbc.queryForObject(
                "SELECT COUNT(*) FROM USERS WHERE id = ?",
                Integer.class, SYSTEM_USER_ID);
        if (systemCount == null || systemCount == 0) {
            jdbc.update(
                    "INSERT INTO USERS (id, username, email, password, role, created_at) " +
                            "VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
                    SYSTEM_USER_ID,
                    "system_user",
                    "system@modellingclub.local",
                    "not-used",
                    "admin"
            );
        }

        Integer adminCount = jdbc.queryForObject(
                "SELECT COUNT(*) FROM USERS WHERE id = ?",
                Integer.class, DEFAULT_ADMIN_ID);
        if (adminCount == null || adminCount == 0) {
            jdbc.update(
                    "INSERT INTO USERS (id, username, email, password, role, created_at) " +
                            "VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
                    DEFAULT_ADMIN_ID,
                    "admin",
                    DEFAULT_ADMIN_EMAIL,
                    encoder.encode(DEFAULT_ADMIN_PASSWORD),
                    "admin"
            );
        }
    }
}
