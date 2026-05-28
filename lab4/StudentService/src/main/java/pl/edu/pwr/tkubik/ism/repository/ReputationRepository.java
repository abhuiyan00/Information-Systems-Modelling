package pl.edu.pwr.tkubik.ism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pwr.tkubik.ism.entity.ReputationEntity;

import java.util.Optional;
import java.util.UUID;

public interface ReputationRepository extends JpaRepository<ReputationEntity, UUID> {
    Optional<ReputationEntity> findByUserId(UUID userId);
}
