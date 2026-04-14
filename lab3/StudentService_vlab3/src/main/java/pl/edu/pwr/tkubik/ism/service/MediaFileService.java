package pl.edu.pwr.tkubik.ism.service;

import pl.edu.pwr.tkubik.ism.model.MediaFile;

import java.util.List;
import java.util.UUID;

public interface MediaFileService {
    MediaFile addMediaFile(UUID buildId, String filename, int sizeBytes, String mimeType);
    List<MediaFile> findByBuildId(UUID buildId);
    boolean deleteMediaFile(UUID buildId, UUID mediaId);
    boolean buildExists(UUID buildId);
    int countByBuildId(UUID buildId);
}