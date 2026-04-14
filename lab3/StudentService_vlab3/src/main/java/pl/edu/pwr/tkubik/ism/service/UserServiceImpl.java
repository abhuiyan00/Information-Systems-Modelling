package pl.edu.pwr.tkubik.ism.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.pwr.tkubik.ism.entity.UserEntity;
import pl.edu.pwr.tkubik.ism.model.RegisterRequest;
import pl.edu.pwr.tkubik.ism.model.UserProfile;
import pl.edu.pwr.tkubik.ism.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    // ── Conversion: Entity → DTO ──
    // This is where the "rough conversion" the professor mentions happens
    private UserProfile toDTO(UserEntity entity) {
        UserProfile dto = new UserProfile();
        dto.setId(entity.getId());
        dto.setUsername(entity.getUsername());
        dto.setEmail(entity.getEmail());
        dto.setRole(UserProfile.RoleEnum.fromValue(entity.getRole()));
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    @Override
    public UserProfile register(RegisterRequest request) {
        // DTO → Entity (for saving to database)
        UserEntity entity = new UserEntity(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                "member"
        );
        // save returns the entity with generated ID
        entity = userRepository.save(entity);
        // Entity → DTO (for returning to controller)
        return toDTO(entity);
    }

    @Override
    public UserProfile findByEmail(String email) {
        Optional<UserEntity> entity = userRepository.findByEmail(email);
        return entity.map(this::toDTO).orElse(null);
    }

    @Override
    public UserProfile findById(UUID id) {
        Optional<UserEntity> entity = userRepository.findById(id);
        return entity.map(this::toDTO).orElse(null);
    }

    @Override
    public List<UserProfile> findAll() {
        return userRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public void deleteByEmail(String email) {
        Optional<UserEntity> entity = userRepository.findByEmail(email);
        entity.ifPresent(userRepository::delete);
    }
}