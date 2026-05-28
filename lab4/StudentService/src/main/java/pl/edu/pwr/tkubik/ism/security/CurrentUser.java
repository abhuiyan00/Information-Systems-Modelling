package pl.edu.pwr.tkubik.ism.security;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.util.UUID;

@Component
@RequestScope
public class CurrentUser {

    private UUID userId;
    private String role;

    public boolean isAuthenticated() {
        return userId != null;
    }

    public boolean isAdmin() {
        return "admin".equals(role);
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
