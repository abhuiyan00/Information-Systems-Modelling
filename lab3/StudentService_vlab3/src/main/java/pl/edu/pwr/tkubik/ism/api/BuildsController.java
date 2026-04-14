package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;
import pl.edu.pwr.tkubik.ism.service.BuildService;

import java.net.URI;
import java.util.*;

@RestController
public class BuildsController implements BuildsApi {

    @Autowired
    private BuildService buildService;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<Build> buildsPost(BuildCreateRequest buildCreateRequest) {
        UUID ownerId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        Build build = buildService.createBuild(buildCreateRequest, ownerId);
        if (build.getId() == null) {
            return new ResponseEntity<>(build, HttpStatus.CREATED);
        }
        return ResponseEntity.created(URI.create("/builds/" + build.getId())).body(build);
    }

    @Override
    public ResponseEntity<BuildList> buildsGet(String q, BuildType type, String author,
                                               Integer page, Integer size) {
        List<Build> items = buildService.findAll();
        BuildList result = new BuildList();
        result.setItems(items);
        result.setTotal(items.size());
        result.setPage(page != null ? page : 1);
        result.setSize(size != null ? size : 20);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Build> buildsBuildIdGet(UUID buildId) {
        Build build = buildService.findById(buildId);
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(build, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Build> buildsBuildIdPut(UUID buildId, BuildCreateRequest request) {
        Build build = buildService.updateBuild(buildId, request);
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(build, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> buildsBuildIdDelete(UUID buildId) {
        boolean deleted = buildService.deleteBuild(buildId);
        if (!deleted) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<Build> buildsBuildIdSubmitPost(UUID buildId) {
        Build build = buildService.updateStatus(buildId, "pending_review");
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(build, HttpStatus.OK);
    }
}