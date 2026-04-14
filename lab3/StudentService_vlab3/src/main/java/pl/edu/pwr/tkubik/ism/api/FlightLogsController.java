package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;
import pl.edu.pwr.tkubik.ism.service.FlightLogService;

import java.math.BigDecimal;
import java.util.*;

@RestController
public class FlightLogsController implements FlightLogsApi {

    @Autowired
    private FlightLogService flightLogService;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<List<FlightLog>> buildsBuildIdFlightLogsGet(UUID buildId) {
        List<FlightLog> logs = flightLogService.findByBuildId(buildId);
        return new ResponseEntity<>(logs, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<FlightLog> buildsBuildIdFlightLogsPost(
            UUID buildId, FlightLogCreateRequest flightLogCreateRequest) {

        // Check that the build exists and is a drone type
        String buildType = flightLogService.getBuildType(buildId);
        if (buildType == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (!"drone".equals(buildType)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        // Validate altitude does not exceed 120 m EU limit
        if (flightLogCreateRequest.getMaxAltitudeM() != null
                && flightLogCreateRequest.getMaxAltitudeM()
                .compareTo(BigDecimal.valueOf(120)) > 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Validate drone identifier format
        String droneId = flightLogCreateRequest.getDroneIdentifier();
        if (droneId != null && !droneId.matches("^[A-Z]{2}-[A-Z0-9]{6,12}$")) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        FlightLog log = flightLogService.addFlightLog(buildId, flightLogCreateRequest);
        if (log == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(log, HttpStatus.CREATED);
    }
}