package pl.edu.pwr.tkubik.ism.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Seeds a deterministic "system" user on startup so every controller
 * that relies on the hardcoded CURRENT_USER_ID always finds a real row.
 *
 * Without this seed, builds/comments/votes would have null foreign keys
 * or return 404 from the vote endpoint.
 *
 * Implemented as an ApplicationRunner so it runs AFTER Hibernate has
 * finished creating the tables (ddl-auto) — @PostConstruct can run too
 * early in some Spring lifecycles.
 *
 * We use a native INSERT because UserEntity declares
 * @GeneratedValue(strategy = GenerationType.UUID). Going through the
 * JPA repository would cause Hibernate to overwrite our chosen id.
 *
 * Idempotent: if the system user already exists we skip the insert,
 * so the app can restart safely with ddl-auto=update.
 */
@Configuration
public class DataInitializer {

    public static final UUID SYSTEM_USER_ID =
            UUID.fromString("00000000-0000-0000-0000-000000000001");

    @Bean
    public ApplicationRunner seedSystemUser(JdbcTemplate jdbc) {
        return args -> seed(jdbc);
    }

    @Transactional
    public void seed(JdbcTemplate jdbc) {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM USERS WHERE id = ?",
                Integer.class,
                SYSTEM_USER_ID);

        if (count != null && count > 0) {
            return;
        }

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
}
