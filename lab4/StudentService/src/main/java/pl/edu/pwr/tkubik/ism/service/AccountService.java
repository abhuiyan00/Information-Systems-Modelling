package pl.edu.pwr.tkubik.ism.service;

import java.util.UUID;

public interface AccountService {
    /**
     * Builds a ZIP archive containing the user's profile, builds, and comments
     * as JSON files. Returns null if the user does not exist.
     */
    byte[] exportZip(UUID userId);
}
