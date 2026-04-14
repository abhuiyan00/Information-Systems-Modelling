package pl.edu.pwr.tkubik.ism.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.multipart.MultipartFile;
import pl.edu.pwr.tkubik.ism.model.*;

import java.net.URI;
import java.util.*;

@RestController
public class MediaController implements MediaApi {

    // Media storage: buildId  →  list of media files
    private static Map<String, List<MediaFile>> mediaDb = new HashMap<>();

    // Allowed MIME types per spec
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

    // ── Helper: expose mediaDb for other controllers ──
    public static Map<String, List<MediaFile>> getMediaDb() {
        return mediaDb;
    }

    // GET /builds/{buildId}/media — list media files for a build
    @Override
    public ResponseEntity<List<MediaFile>> buildsBuildIdMediaGet(UUID buildId) {
        // Check that the build exists
        Build build = BuildsController.getBuildsDb().get(buildId.toString());
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<MediaFile> files =
                mediaDb.getOrDefault(buildId.toString(), new ArrayList<>());
        return new ResponseEntity<>(files, HttpStatus.OK);
    }

    // POST /builds/{buildId}/media — upload media files
    @Override
    public ResponseEntity<List<MediaFile>> buildsBuildIdMediaPost(UUID buildId,
                                                                  List<MultipartFile> files) {

        if (files == null || files.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<MediaFile> existingFiles =
                mediaDb.getOrDefault(buildId.toString(), new ArrayList<>());

        // Check 50-file limit
        if (existingFiles.size() + files.size() > MAX_FILES_PER_BUILD) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<MediaFile> uploaded = new ArrayList<>();

        for (MultipartFile file : files) {
            // Validate file size
            if (file.getSize() > MAX_FILE_SIZE) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            // Validate MIME type
            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            MediaFile mediaFile = new MediaFile();
            mediaFile.setId(UUID.randomUUID());
            mediaFile.setFilename(file.getOriginalFilename());
            mediaFile.setSizeBytes((int) file.getSize());
            mediaFile.setMimeType(contentType);
            mediaFile.setUrl(URI.create(
                    "https://modellingclub.example.com/media/" + mediaFile.getId()));

            uploaded.add(mediaFile);
        }

        // Store all uploaded files
        existingFiles.addAll(uploaded);
        mediaDb.put(buildId.toString(), existingFiles);

        return new ResponseEntity<>(uploaded, HttpStatus.CREATED);  // 201
    }

    // DELETE /builds/{buildId}/media/{mediaId} — delete a media file
    @Override
    public ResponseEntity<Void> buildsBuildIdMediaMediaIdDelete(UUID buildId, UUID mediaId) {
        List<MediaFile> files = mediaDb.get(buildId.toString());
        if (files == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        boolean removed = files.removeIf(f -> f.getId().equals(mediaId));
        if (!removed) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // 204
    }
}