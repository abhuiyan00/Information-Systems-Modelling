package pl.edu.pwr.tkubik.ism.service;

import org.springframework.web.multipart.MultipartFile;
import pl.edu.pwr.tkubik.ism.model.MediaFile;

import java.util.List;
import java.util.UUID;

public interface MediaFileService {
    MediaFile addMediaFile(UUID buildId, MultipartFile file);
    List<MediaFile> findByBuildId(UUID buildId);
    boolean deleteMediaFile(UUID buildId, UUID mediaId);
    boolean buildExists(UUID buildId);
    int countByBuildId(UUID buildId);
}
