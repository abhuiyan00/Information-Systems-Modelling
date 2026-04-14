package pl.edu.pwr.tkubik.ism.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import pl.edu.pwr.tkubik.ism.model.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

@RestController
public class FlightLogsController implements FlightLogsApi {

    // Flight logs storage: buildId  →  list of flight log entries
    private static Map<String, List<FlightLog>> flightLogsDb = new HashMap<>();

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    // ── Helper: expose flightLogsDb for other controllers ──
    public static Map<String, List<FlightLog>> getFlightLogsDb() {
        return flightLogsDb;
    }

    // GET /builds/{buildId}/flight-logs — list flight logs
    @Override
    public ResponseEntity<List<FlightLog>> buildsBuildIdFlightLogsGet(UUID buildId) {
        List<FlightLog> logs =
                flightLogsDb.getOrDefault(buildId.toString(), new ArrayList<>());
        return new ResponseEntity<>(logs, HttpStatus.OK);
    }

    // POST /builds/{buildId}/flight-logs — add a flight log entry
    @Override
    public ResponseEntity<FlightLog> buildsBuildIdFlightLogsPost(UUID buildId,
                                                                 FlightLogCreateRequest flightLogCreateRequest) {

        // Check that the build exists and is a drone type
        Build build = BuildsController.getBuildsDb().get(buildId.toString());
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (build.getType() != BuildType.DRONE) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);  // 403
        }

        // Validate altitude does not exceed 120 m EU limit
        if (flightLogCreateRequest.getMaxAltitudeM() != null
                && flightLogCreateRequest.getMaxAltitudeM().compareTo(BigDecimal.valueOf(120)) > 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);  // 400
        }

        // Validate drone identifier format: XX-XXXXXX (2 uppercase + dash + 6-12 alphanum)
        String droneId = flightLogCreateRequest.getDroneIdentifier();
        if (droneId != null && !droneId.matches("^[A-Z]{2}-[A-Z0-9]{6,12}$")) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);  // 400
        }

        // Create the flight log entry
        FlightLog log = new FlightLog();
        log.setId(UUID.randomUUID());
        log.setBuildId(buildId);
        log.setFlightDate(flightLogCreateRequest.getFlightDate());
        log.setLocationName(flightLogCreateRequest.getLocationName());
        log.setDurationMin(flightLogCreateRequest.getDurationMin());
        log.setMaxAltitudeM(flightLogCreateRequest.getMaxAltitudeM());
        log.setDroneIdentifier(flightLogCreateRequest.getDroneIdentifier());
        log.setConditions(
                FlightLog.ConditionsEnum.fromValue(
                        flightLogCreateRequest.getConditions().getValue()));
        log.setNotebook(flightLogCreateRequest.getNotebook());
        log.setCreatedAt(OffsetDateTime.now());

        flightLogsDb.computeIfAbsent(buildId.toString(), k -> new ArrayList<>()).add(log);

        return new ResponseEntity<>(log, HttpStatus.CREATED);  // 201
    }
}