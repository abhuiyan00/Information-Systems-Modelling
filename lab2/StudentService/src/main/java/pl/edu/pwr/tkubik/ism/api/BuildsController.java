package pl.edu.pwr.tkubik.ism.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.Build;
import pl.edu.pwr.tkubik.ism.model.BuildCreateRequest;
import pl.edu.pwr.tkubik.ism.model.BuildList;
import pl.edu.pwr.tkubik.ism.model.BuildStatus;
import pl.edu.pwr.tkubik.ism.model.BuildType;

import java.util.*;

@RestController
public class BuildsController implements BuildsApi {

    // IN-MEMORY DATABASE
    // Key: UUID string  →  Value: Build object
    private static Map<String, Build> buildsDb = new HashMap<>();

    // ── Helper: expose buildsDb for other controllers ──
    public static Map<String, Build> getBuildsDb() {
        return buildsDb;
    }

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    // POST /builds — create a new build (starts as draft)
    @Override
    public ResponseEntity<Build> buildsPost(BuildCreateRequest buildCreateRequest) {
        Build build = new Build();
        build.setTitle(buildCreateRequest.getTitle());
        build.setType(buildCreateRequest.getType());
        build.setDescription(buildCreateRequest.getDescription());

        UUID newId = UUID.randomUUID();
        build.setId(newId);
        build.setStatus(BuildStatus.DRAFT);
        build.setOwnerId(UUID.fromString("00000000-0000-0000-0000-000000000001"));

        buildsDb.put(newId.toString(), build);

        return new ResponseEntity<>(build, HttpStatus.CREATED);
    }

    // GET /builds — list all builds
    @Override
    public ResponseEntity<BuildList> buildsGet(String q, BuildType type, String author, Integer page, Integer size) {
        BuildList result = new BuildList();
        List<Build> items = new ArrayList<>(buildsDb.values());
        result.setItems(items);
        result.setTotal(items.size());
        result.setPage(page != null ? page : 1);
        result.setSize(size != null ? size : 20);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // GET /builds/{buildId} — get one build by ID
    @Override
    public ResponseEntity<Build> buildsBuildIdGet(UUID buildId) {
        Build build = buildsDb.get(buildId.toString());
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(build, HttpStatus.OK);
    }

    // PUT /builds/{buildId} — update an existing build
    @Override
    public ResponseEntity<Build> buildsBuildIdPut(UUID buildId, BuildCreateRequest buildCreateRequest) {
        Build existing = buildsDb.get(buildId.toString());
        if (existing == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        existing.setTitle(buildCreateRequest.getTitle());
        existing.setDescription(buildCreateRequest.getDescription());
        existing.setType(buildCreateRequest.getType());
        buildsDb.put(buildId.toString(), existing);

        return new ResponseEntity<>(existing, HttpStatus.OK);
    }

    // DELETE /builds/{buildId} — delete a build
    @Override
    public ResponseEntity<Void> buildsBuildIdDelete(UUID buildId) {
        Build removed = buildsDb.remove(buildId.toString());
        if (removed == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // POST /builds/{buildId}/submit — submit a draft for review
    @Override
    public ResponseEntity<Build> buildsBuildIdSubmitPost(UUID buildId) {
        Build build = buildsDb.get(buildId.toString());
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        build.setStatus(BuildStatus.PENDING_REVIEW);
        buildsDb.put(buildId.toString(), build);

        return new ResponseEntity<>(build, HttpStatus.OK);
    }
}