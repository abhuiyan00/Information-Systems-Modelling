package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;
import pl.edu.pwr.tkubik.ism.security.JwtService;
import pl.edu.pwr.tkubik.ism.service.UserService;

import java.util.Optional;

@RestController
public class AuthController implements AuthApi {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<UserProfile> authRegisterPost(RegisterRequest registerRequest) {
        if (userService.existsByEmail(registerRequest.getEmail())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        UserProfile profile = userService.register(registerRequest);
        return new ResponseEntity<>(profile, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<LoginResponse> authLoginPost(LoginRequest loginRequest) {
        UserProfile profile = userService.verifyCredentials(
                loginRequest.getEmail(), loginRequest.getPassword());
        if (profile == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        String token = jwtService.issue(profile.getId(), profile.getRole().getValue());
        LoginResponse body = new LoginResponse();
        body.setToken(token);
        body.setUser(profile);
        return new ResponseEntity<>(body, HttpStatus.OK);
    }
}
