package pl.edu.pwr.tkubik.ism.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
public class MessageEntity {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "sender_id")
    private UserEntity sender;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "recipient_id")
    private UserEntity recipient;

    @Column(length = 2000) private String content;
    @Column(name = "read_flag") private Boolean readFlag;
    @Column(name = "created_at") private OffsetDateTime createdAt;

    public MessageEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UserEntity getSender() { return sender; }
    public void setSender(UserEntity v) { this.sender = v; }
    public UserEntity getRecipient() { return recipient; }
    public void setRecipient(UserEntity v) { this.recipient = v; }
    public String getContent() { return content; }
    public void setContent(String v) { this.content = v; }
    public Boolean getReadFlag() { return readFlag; }
    public void setReadFlag(Boolean v) { this.readFlag = v; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime v) { this.createdAt = v; }
}
