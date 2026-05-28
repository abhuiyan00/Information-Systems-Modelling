package pl.edu.pwr.tkubik.ism.service;

import pl.edu.pwr.tkubik.ism.model.Collaborator;

import java.util.List;
import java.util.UUID;

public interface CollaborationService {
    List<Collaborator> findByBuildId(UUID buildId);
    boolean inviteCollaborator(UUID buildId, String email);
}
