package pl.edu.pwr.tkubik.ism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pwr.tkubik.ism.entity.FlightLogEntity;

import java.util.List;
import java.util.UUID;

public interface FlightLogRepository extends JpaRepository<FlightLogEntity, UUID> {
    List<FlightLogEntity> findByBuildId(UUID buildId);
}