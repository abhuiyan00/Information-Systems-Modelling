package pl.edu.pwr.tkubik.ism.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "collaborators")
public class CollaboratorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "role")
    private String role;

    @ManyToOne
    @JoinColumn(name = "build_id")
    private BuildEntity build;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    // constructors
    public CollaboratorEntity() {
    }

    public CollaboratorEntity(BuildEntity build, UserEntity user, String role) {
        this.build = build;
        this.user = user;
        this.role = role;
    }

    // getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public BuildEntity getBuild() { return build; }
    public void setBuild(BuildEntity build) { this.build = build; }

    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
}