package pl.edu.pwr.tkubik.ism.service;

import pl.edu.pwr.tkubik.ism.model.UserProfile;
import pl.edu.pwr.tkubik.ism.model.RegisterRequest;

import java.util.List;
import java.util.UUID;

public interface UserService {
    UserProfile register(RegisterRequest request);
    UserProfile findByEmail(String email);
    UserProfile findById(UUID id);
    List<UserProfile> findAll();
    boolean existsByEmail(String email);
    void deleteByEmail(String email);
}