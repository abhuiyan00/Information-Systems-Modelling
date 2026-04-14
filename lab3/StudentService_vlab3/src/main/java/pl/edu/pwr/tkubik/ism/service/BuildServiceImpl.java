package pl.edu.pwr.tkubik.ism.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.pwr.tkubik.ism.entity.BuildEntity;
import pl.edu.pwr.tkubik.ism.entity.UserEntity;
import pl.edu.pwr.tkubik.ism.model.Build;
import pl.edu.pwr.tkubik.ism.model.BuildCreateRequest;
import pl.edu.pwr.tkubik.ism.model.BuildStatus;
import pl.edu.pwr.tkubik.ism.model.BuildType;
import pl.edu.pwr.tkubik.ism.repository.BuildRepository;
import pl.edu.pwr.tkubik.ism.repository.UserRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BuildServiceImpl implements BuildService {

    @Autowired
    private BuildRepository buildRepository;

    @Autowired
    private UserRepository userRepository;

    // ── Conversion: Entity → DTO ──
    private Build toDTO(BuildEntity entity) {
        Build dto = new Build();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setType(BuildType.fromValue(entity.getType()));
        dto.setDescription(entity.getDescription());
        dto.setScale(entity.getScale());
        dto.setWingspanMm(entity.getWingspanMm());
        dto.setFrameSizeMm(entity.getFrameSizeMm());
        dto.setNumMotors(entity.getNumMotors());
        dto.setFlightController(entity.getFlightController());
        dto.setMaxTakeoffWeightG(entity.getMaxTakeoffWeightG());
        dto.setRotorDiameterMm(entity.getRotorDiameterMm());
        dto.setHullLengthMm(entity.getHullLengthMm());
        dto.setWheelbaseMm(entity.getWheelbaseMm());
        dto.setStatus(BuildStatus.fromValue(entity.getStatus()));
        dto.setScore(entity.getScore());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        if (entity.getOwner() != null) {
            dto.setOwnerId(entity.getOwner().getId());
        }
        return dto;
    }

    // ── Copy DTO request fields → Entity ──
    private void applyRequestToEntity(BuildCreateRequest request, BuildEntity entity) {
        entity.setTitle(request.getTitle());
        entity.setType(request.getType().getValue());
        entity.setDescription(request.getDescription());
        entity.setScale(request.getScale());
        entity.setWingspanMm(request.getWingspanMm());
        entity.setFrameSizeMm(request.getFrameSizeMm());
        entity.setNumMotors(request.getNumMotors());
        entity.setFlightController(request.getFlightController());
        entity.setMaxTakeoffWeightG(request.getMaxTakeoffWeightG());
        entity.setRotorDiameterMm(request.getRotorDiameterMm());
        entity.setHullLengthMm(request.getHullLengthMm());
        entity.setWheelbaseMm(request.getWheelbaseMm());
        entity.setUpdatedAt(OffsetDateTime.now());
    }

    @Override
    public Build createBuild(BuildCreateRequest request, UUID ownerId) {
        BuildEntity entity = new BuildEntity(request.getTitle(), request.getType().getValue());
        applyRequestToEntity(request, entity);
        entity.setStatus("draft");
        entity.setCreatedAt(OffsetDateTime.now());

        // Link the owner (look up the UserEntity by ID)
        Optional<UserEntity> owner = userRepository.findById(ownerId);
        owner.ifPresent(entity::setOwner);

        entity = buildRepository.save(entity);
        return toDTO(entity);
    }

    @Override
    public Build findById(UUID id) {
        Optional<BuildEntity> entity = buildRepository.findById(id);
        return entity.map(this::toDTO).orElse(null);
    }

    @Override
    public List<Build> findAll() {
        return buildRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Build updateBuild(UUID id, BuildCreateRequest request) {
        Optional<BuildEntity> opt = buildRepository.findById(id);
        if (opt.isEmpty()) return null;
        BuildEntity entity = opt.get();
        applyRequestToEntity(request, entity);
        entity = buildRepository.save(entity);
        return toDTO(entity);
    }

    @Override
    public boolean deleteBuild(UUID id) {
        if (!buildRepository.existsById(id)) return false;
        buildRepository.deleteById(id);
        return true;
    }

    @Override
    public Build updateStatus(UUID id, String status) {
        Optional<BuildEntity> opt = buildRepository.findById(id);
        if (opt.isEmpty()) return null;
        BuildEntity entity = opt.get();
        entity.setStatus(status);
        entity.setUpdatedAt(OffsetDateTime.now());
        entity = buildRepository.save(entity);
        return toDTO(entity);
    }
}