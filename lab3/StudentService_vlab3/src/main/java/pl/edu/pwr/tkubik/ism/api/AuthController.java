package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;
import pl.edu.pwr.tkubik.ism.service.UserService;

import java.util.Optional;

@RestController
public class AuthController implements AuthApi {

    @Autowired
    private UserService userService;

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
    public ResponseEntity<UserProfile> authLoginPost(LoginRequest loginRequest) {
        UserProfile profile = userService.findByEmail(loginRequest.getEmail());
        if (profile == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(profile, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> authLogoutPost() {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<UserProfile> authMeGet() {
        var all = userService.findAll();
        if (all.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(all.get(0), HttpStatus.OK);
    }
}