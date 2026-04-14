package pl.edu.pwr.tkubik.ism.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;

import java.util.*;

@RestController
public class AuthController implements AuthApi {

    // In-memory "users table"
    //   Key: email  →  Value: UserProfile
    private static Map<String, UserProfile> usersDb = new HashMap<>();

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    // POST /auth/register — create a new account
    // NOTE: Method name should match the generated AuthApi interface
    // Common patterns: authRegisterPost() or registerUser()
    @Override
    public ResponseEntity<UserProfile> authRegisterPost(RegisterRequest registerRequest) {
        // Check if email already taken
        if (usersDb.containsKey(registerRequest.getEmail())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);  // 409
        }

        // Create the new user profile
        UserProfile profile = new UserProfile();
        profile.setId(UUID.randomUUID());
        profile.setUsername(registerRequest.getUsername());
        profile.setEmail(registerRequest.getEmail());
        profile.setRole(UserProfile.RoleEnum.MEMBER);  // everyone starts as member

        // Store by email
        usersDb.put(registerRequest.getEmail(), profile);

        return new ResponseEntity<>(profile, HttpStatus.CREATED);  // 201
    }

    // POST /auth/login — "authenticate" (simplified — no real passwords)
    // NOTE: Method name should match the generated AuthApi interface
    // Common patterns: authLoginPost() or loginUser()
    @Override
    public ResponseEntity<UserProfile> authLoginPost(LoginRequest loginRequest) {
        UserProfile profile = usersDb.get(loginRequest.getEmail());
        if (profile == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);  // 401
        }
        // In a real app we'd check the password hash here.
        // For the lab, we just return the profile if the email exists.
        return new ResponseEntity<>(profile, HttpStatus.OK);
    }

    // POST /auth/logout — invalidate session (stub)
    @Override
    public ResponseEntity<Void> authLogoutPost() {
        // No real session to invalidate in our simple version
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // 204
    }

    // GET /auth/me — return current authenticated user (stub)
    @Override
    public ResponseEntity<UserProfile> authMeGet() {
        // Simplified: return the first user in the DB, or 401 if none
        if (usersDb.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        UserProfile firstUser = usersDb.values().iterator().next();
        return new ResponseEntity<>(firstUser, HttpStatus.OK);
    }

    // ── Helper: expose usersDb for other controllers ──
    public static Map<String, UserProfile> getUsersDb() {
        return usersDb;
    }
}