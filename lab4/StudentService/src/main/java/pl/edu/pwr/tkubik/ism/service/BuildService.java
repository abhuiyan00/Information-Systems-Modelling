package pl.edu.pwr.tkubik.ism.service;

import pl.edu.pwr.tkubik.ism.model.Build;
import pl.edu.pwr.tkubik.ism.model.BuildCreateRequest;

import java.util.List;
import java.util.UUID;

public interface BuildService {
    Build createBuild(BuildCreateRequest request, UUID ownerId);
    Build findById(UUID id);
    List<Build> findAll();
    Build updateBuild(UUID id, BuildCreateRequest request);
    boolean deleteBuild(UUID id);
    Build updateStatus(UUID id, String status);
}