package pl.edu.pwr.tkubik.ism.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.pwr.tkubik.ism.entity.BuildEntity;
import pl.edu.pwr.tkubik.ism.entity.FlightLogEntity;
import pl.edu.pwr.tkubik.ism.model.FlightLog;
import pl.edu.pwr.tkubik.ism.model.FlightLogCreateRequest;
import pl.edu.pwr.tkubik.ism.repository.BuildRepository;
import pl.edu.pwr.tkubik.ism.repository.FlightLogRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class FlightLogServiceImpl implements FlightLogService {

    @Autowired
    private FlightLogRepository flightLogRepository;

    @Autowired
    private BuildRepository buildRepository;

    // ── Conversion: Entity → DTO ──
    private FlightLog toDTO(FlightLogEntity entity) {
        FlightLog dto = new FlightLog();
        dto.setId(entity.getId());
        dto.setFlightDate(entity.getFlightDate());
        dto.setLocationName(entity.getLocationName());
        dto.setDurationMin(entity.getDurationMin());
        dto.setMaxAltitudeM(entity.getMaxAltitudeM());
        dto.setDroneIdentifier(entity.getDroneIdentifier());
        if (entity.getConditions() != null) {
            dto.setConditions(
                    FlightLog.ConditionsEnum.fromValue(entity.getConditions()));
        }
        dto.setNotebook(entity.getNotebook());
        dto.setCreatedAt(entity.getCreatedAt());
        if (entity.getBuild() != null) {
            dto.setBuildId(entity.getBuild().getId());
        }
        return dto;
    }

    @Override
    public FlightLog addFlightLog(UUID buildId, FlightLogCreateRequest request) {
        Optional<BuildEntity> buildOpt = buildRepository.findById(buildId);
        if (buildOpt.isEmpty()) return null;

        FlightLogEntity entity = new FlightLogEntity();
        entity.setBuild(buildOpt.get());
        entity.setFlightDate(request.getFlightDate());
        entity.setLocationName(request.getLocationName());
        entity.setDurationMin(request.getDurationMin());
        entity.setMaxAltitudeM(request.getMaxAltitudeM());
        entity.setDroneIdentifier(request.getDroneIdentifier());
        if (request.getConditions() != null) {
            entity.setConditions(request.getConditions().getValue());
        }
        entity.setNotebook(request.getNotebook());
        entity.setCreatedAt(OffsetDateTime.now());

        entity = flightLogRepository.save(entity);
        return toDTO(entity);
    }

    @Override
    public List<FlightLog> findByBuildId(UUID buildId) {
        return flightLogRepository.findByBuildId(buildId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public String getBuildType(UUID buildId) {
        Optional<BuildEntity> buildOpt = buildRepository.findById(buildId);
        return buildOpt.map(BuildEntity::getType).orElse(null);
    }
}