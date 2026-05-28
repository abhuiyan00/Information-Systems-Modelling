package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.tkubik.ism.entity.MessageEntity;
import pl.edu.pwr.tkubik.ism.entity.UserEntity;
import pl.edu.pwr.tkubik.ism.repository.MessageRepository;
import pl.edu.pwr.tkubik.ism.repository.UserRepository;
import pl.edu.pwr.tkubik.ism.security.CurrentUser;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired private MessageRepository repo;
    @Autowired private UserRepository userRepo;
    @Autowired private CurrentUser currentUser;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> inbox() {
        if (!currentUser.isAuthenticated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        List<MessageEntity> rows = repo.findInbox(currentUser.getUserId());
        List<Map<String, Object>> out = new ArrayList<>();
        for (MessageEntity m : rows) out.add(toDto(m));
        return ResponseEntity.ok(out);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> send(@RequestBody Map<String, Object> body) {
        if (!currentUser.isAuthenticated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        String to = (String) body.get("recipient_id");
        String content = (String) body.get("content");
        if (to == null || content == null || content.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        UUID recipientId;
        try {
            recipientId = UUID.fromString(to);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        UserEntity recipient = userRepo.findById(recipientId).orElse(null);
        if (recipient == null) return ResponseEntity.badRequest().build();
        MessageEntity m = new MessageEntity();
        m.setSender(userRepo.findById(currentUser.getUserId()).orElse(null));
        m.setRecipient(recipient);
        m.setContent(content);
        m.setReadFlag(false);
        m.setCreatedAt(OffsetDateTime.now());
        repo.save(m);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(m));
    }

    private Map<String, Object> toDto(MessageEntity m) {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("id", m.getId());
        r.put("sender_id", m.getSender() == null ? null : m.getSender().getId());
        r.put("sender_username", m.getSender() == null ? null : m.getSender().getUsername());
        r.put("recipient_id", m.getRecipient() == null ? null : m.getRecipient().getId());
        r.put("recipient_username", m.getRecipient() == null ? null : m.getRecipient().getUsername());
        r.put("content", m.getContent());
        r.put("read", m.getReadFlag());
        r.put("created_at", m.getCreatedAt() == null ? "" : m.getCreatedAt().toString());
        return r;
    }
}
