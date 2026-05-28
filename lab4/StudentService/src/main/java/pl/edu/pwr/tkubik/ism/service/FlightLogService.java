package pl.edu.pwr.tkubik.ism.service;

import pl.edu.pwr.tkubik.ism.model.FlightLog;
import pl.edu.pwr.tkubik.ism.model.FlightLogCreateRequest;

import java.util.List;
import java.util.UUID;

public interface FlightLogService {
    FlightLog addFlightLog(UUID buildId, FlightLogCreateRequest request);
    List<FlightLog> findByBuildId(UUID buildId);
    String getBuildType(UUID buildId);
}