package pl.edu.pwr.tkubik.ism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.edu.pwr.tkubik.ism.entity.UserEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM UserEntity u " +
            "WHERE u.id <> ?2 " +
            "AND u.username <> 'system_user' " +
            "AND (LOWER(u.username) LIKE LOWER(CONCAT('%', ?1, '%')) " +
            "  OR LOWER(u.email)    LIKE LOWER(CONCAT('%', ?1, '%'))) " +
            "ORDER BY u.username ASC")
    List<UserEntity> searchByQuery(String q, UUID excludeId);
}