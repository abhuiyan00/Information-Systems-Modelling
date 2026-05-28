package pl.edu.pwr.tkubik.ism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pwr.tkubik.ism.entity.TestRunAttendeeEntity;

import java.util.List;
import java.util.UUID;

public interface TestRunAttendeeRepository extends JpaRepository<TestRunAttendeeEntity, UUID> {
    List<TestRunAttendeeEntity> findByTestRunId(UUID testRunId);
    List<TestRunAttendeeEntity> findByUserId(UUID userId);
}
