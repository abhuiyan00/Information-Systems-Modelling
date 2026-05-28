package pl.edu.pwr.tkubik.ism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.edu.pwr.tkubik.ism.entity.VoteEntity;

import java.util.Optional;
import java.util.UUID;

public interface VoteRepository extends JpaRepository<VoteEntity, UUID> {
    Optional<VoteEntity> findByBuildIdAndUserId(UUID buildId, UUID userId);

    @Query("SELECT COUNT(v) FROM VoteEntity v WHERE v.build.id = ?1 AND v.vote = 'up'")
    int countUpvotesByBuildId(UUID buildId);

    @Query("SELECT COUNT(v) FROM VoteEntity v WHERE v.build.id = ?1 AND v.vote = 'down'")
    int countDownvotesByBuildId(UUID buildId);
}