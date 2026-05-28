package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.multipart.MultipartFile;
import pl.edu.pwr.tkubik.ism.model.*;
import pl.edu.pwr.tkubik.ism.security.CurrentUser;
import pl.edu.pwr.tkubik.ism.service.MediaFileService;

import java.util.*;

@RestController
public class MediaController implements MediaApi {

    @Autowired
    private MediaFileService mediaFileService;

    @Autowired
    private CurrentUser currentUser;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif",
            "application/pdf", "model/stl", "application/sla"
    );

    private static final long MAX_FILE_SIZE = 20L * 1024 * 1024; // 20 MB
    private static final int MAX_FILES_PER_BUILD = 50;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<List<MediaFile>> buildsBuildIdMediaGet(UUID buildId) {
        if (!mediaFileService.buildExists(buildId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<MediaFile> files = mediaFileService.findByBuildId(buildId);
        return new ResponseEntity<>(files, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<MediaFile>> buildsBuildIdMediaPost(
            UUID buildId, List<MultipartFile> files) {

        if (!currentUser.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (files == null || files.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        int existingCount = mediaFileService.countByBuildId(buildId);
        if (existingCount + files.size() > MAX_FILES_PER_BUILD) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<MediaFile> uploaded = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.getSize() > MAX_FILE_SIZE) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            String contentType = file.getContentType();
            if (contentType == null
                    || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            MediaFile mediaFile = mediaFileService.addMediaFile(buildId, file);

            if (mediaFile != null) {
                uploaded.add(mediaFile);
            }
        }

        return new ResponseEntity<>(uploaded, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<Void> buildsBuildIdMediaMediaIdDelete(
            UUID buildId, UUID mediaId) {
        if (!currentUser.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        boolean removed = mediaFileService.deleteMediaFile(buildId, mediaId);
        if (!removed) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}