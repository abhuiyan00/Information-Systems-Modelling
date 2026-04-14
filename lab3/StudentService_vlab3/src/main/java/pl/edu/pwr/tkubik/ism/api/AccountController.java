package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;
import pl.edu.pwr.tkubik.ism.service.UserService;

import java.net.URI;
import java.util.*;

@RestController
public class AccountController implements AccountApi {

    @Autowired
    private UserService userService;

    private static boolean exportRequested = false;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<Void> accountExportPost() {
        exportRequested = true;
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @Override
    public ResponseEntity<GdprExportStatus> accountExportGet() {
        GdprExportStatus status = new GdprExportStatus();
        if (exportRequested) {
            status.setStatus(GdprExportStatus.StatusEnum.READY);
            status.setDownloadUrl(URI.create(
                    "https://modellingclub.example.com/exports/my-data.zip"));
        } else {
            status.setStatus(GdprExportStatus.StatusEnum.PENDING);
        }
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> accountDeletePost() {
        List<UserProfile> all = userService.findAll();
        if (!all.isEmpty()) {
            userService.deleteByEmail(all.get(0).getEmail());
        }
        exportRequested = false;
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}