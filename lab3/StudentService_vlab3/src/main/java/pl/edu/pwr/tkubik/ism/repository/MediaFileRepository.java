package pl.edu.pwr.tkubik.ism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pwr.tkubik.ism.entity.MediaFileEntity;

import java.util.List;
import java.util.UUID;

public interface MediaFileRepository extends JpaRepository<MediaFileEntity, UUID> {
    List<MediaFileEntity> findByBuildId(UUID buildId);
}