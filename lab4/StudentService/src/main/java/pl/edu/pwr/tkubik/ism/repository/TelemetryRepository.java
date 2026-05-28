package pl.edu.pwr.tkubik.ism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pwr.tkubik.ism.entity.TelemetryEntity;

import java.util.List;
import java.util.UUID;

public interface TelemetryRepository extends JpaRepository<TelemetryEntity, UUID> {
    List<TelemetryEntity> findByBuildId(UUID buildId);
}
