package pl.edu.pwr.tkubik.ism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pwr.tkubik.ism.entity.CollaboratorEntity;

import java.util.List;
import java.util.UUID;

public interface CollaboratorRepository extends JpaRepository<CollaboratorEntity, UUID> {
    List<CollaboratorEntity> findByBuildId(UUID buildId);
}