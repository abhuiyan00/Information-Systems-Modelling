package pl.edu.pwr.tkubik.ism.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.HealthGet200Response;

import java.util.Optional;

@RestController
public class SystemController implements SystemApi {

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    // ─────────────────────────────────────────────────────────────
    // GET /health — health check
    // ─────────────────────────────────────────────────────────────
    @Override
    public ResponseEntity<HealthGet200Response> healthGet() {
        HealthGet200Response response = new HealthGet200Response();
        response.setStatus("ok");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}