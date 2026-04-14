package pl.edu.pwr.tkubik.ism.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;

import java.net.URI;
import java.util.*;

@RestController
public class AccountController implements AccountApi {

    // In-memory export status tracker
    private static boolean exportRequested = false;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    // POST /account/export — request personal data export
    @Override
    public ResponseEntity<Void> accountExportPost() {
        exportRequested = true;
        return new ResponseEntity<>(HttpStatus.ACCEPTED);  // 202
    }

    // GET /account/export — check export status
    @Override
    public ResponseEntity<GdprExportStatus> accountExportGet() {
        GdprExportStatus status = new GdprExportStatus();
        if (exportRequested) {
            // Simplified: immediately mark as ready
            status.setStatus(GdprExportStatus.StatusEnum.READY);
            status.setDownloadUrl(URI.create("https://modellingclub.example.com/exports/my-data.zip"));
        } else {
            status.setStatus(GdprExportStatus.StatusEnum.PENDING);
        }
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    // POST /account/delete — delete account and anonymise builds
    @Override
    public ResponseEntity<Void> accountDeletePost() {
        // Simplified: clear the first user from usersDb
        if (!AuthController.getUsersDb().isEmpty()) {
            String firstKey = AuthController.getUsersDb().keySet().iterator().next();
            AuthController.getUsersDb().remove(firstKey);
        }
        exportRequested = false;
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // 204
    }
}