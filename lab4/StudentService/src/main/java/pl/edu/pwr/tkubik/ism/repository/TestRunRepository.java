package pl.edu.pwr.tkubik.ism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.edu.pwr.tkubik.ism.entity.TestRunEntity;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface TestRunRepository extends JpaRepository<TestRunEntity, UUID> {
    List<TestRunEntity> findByBuildId(UUID buildId);
    List<TestRunEntity> findByOrganizerId(UUID organizerId);
    @Query("SELECT t FROM TestRunEntity t WHERE t.scheduledAt >= ?1 ORDER BY t.scheduledAt ASC")
    List<TestRunEntity> findUpcoming(OffsetDateTime from);
}
