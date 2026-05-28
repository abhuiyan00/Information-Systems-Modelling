package pl.edu.pwr.tkubik.ism.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private static final long TTL_SECONDS = 24 * 60 * 60L;

    /**
     * Set jwt.secret to a stable base64-encoded 256-bit key in prod.
     * Generate: openssl rand -base64 32
     * If blank, a random key is generated per JVM start (dev mode only —
     * all issued tokens are invalidated on restart).
     */
    @Value("${jwt.secret:}")
    private String jwtSecretBase64;

    private SecretKey key;

    @PostConstruct
    public void init() {
        if (jwtSecretBase64 != null && !jwtSecretBase64.isBlank()) {
            this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecretBase64));
            log.info("JwtService: using configured signing key");
        } else {
            byte[] keyBytes = new byte[32];
            new SecureRandom().nextBytes(keyBytes);
            this.key = Keys.hmacShaKeyFor(keyBytes);
            log.warn("JwtService: jwt.secret not set — random key used, all tokens invalidated on restart. Set jwt.secret for production.");
        }
    }

    public String issue(UUID userId, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(userId.toString())
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(TTL_SECONDS)))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
