package pl.edu.pwr.tkubik.ism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.edu.pwr.tkubik.ism.entity.MessageEntity;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<MessageEntity, UUID> {
    @Query("SELECT m FROM MessageEntity m WHERE m.sender.id = ?1 OR m.recipient.id = ?1 ORDER BY m.createdAt DESC")
    List<MessageEntity> findInbox(UUID userId);
}
