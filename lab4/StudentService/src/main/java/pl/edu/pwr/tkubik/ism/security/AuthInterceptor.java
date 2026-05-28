package pl.edu.pwr.tkubik.ism.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.UUID;

/**
 * Resolves an Authorization: Bearer <jwt> header into a {@link CurrentUser}.
 * Missing/invalid tokens leave CurrentUser unauthenticated; controllers decide
 * whether to reject (401) based on the endpoint's requirements.
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {

    private static final Logger log = LoggerFactory.getLogger(AuthInterceptor.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CurrentUser currentUser;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return true;
        }
        try {
            Claims claims = jwtService.parse(header.substring(7));
            currentUser.setUserId(UUID.fromString(claims.getSubject()));
            currentUser.setRole(claims.get("role", String.class));
        } catch (Exception ex) {
            // Invalid/expired token → leave CurrentUser unauthenticated.
            log.debug("JWT parse failed: {}", ex.getMessage());
        }
        return true;
    }
}
