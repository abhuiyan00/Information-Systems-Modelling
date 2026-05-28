package pl.edu.pwr.tkubik.ism.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pl.edu.pwr.tkubik.ism.entity.BuildEntity;
import pl.edu.pwr.tkubik.ism.entity.MediaFileEntity;
import pl.edu.pwr.tkubik.ism.model.MediaFile;
import pl.edu.pwr.tkubik.ism.repository.BuildRepository;
import pl.edu.pwr.tkubik.ism.repository.MediaFileRepository;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MediaFileServiceImpl implements MediaFileService {

    private static final Logger log = LoggerFactory.getLogger(MediaFileServiceImpl.class);

    @Autowired private MediaFileRepository mediaFileRepository;
    @Autowired private BuildRepository buildRepository;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Value("${app.public.base-url:http://localhost:8080/StudentsApp}")
    private String publicBaseUrl;

    private MediaFile toDTO(MediaFileEntity entity) {
        MediaFile dto = new MediaFile();
        dto.setId(entity.getId());
        dto.setFilename(entity.getFilename());
        dto.setSizeBytes(entity.getSizeBytes());
        dto.setMimeType(entity.getMimeType());
        if (entity.getUrl() != null) {
            dto.setUrl(URI.create(entity.getUrl()));
        }
        return dto;
    }

    private String safeExtension(String filename, String mimeType) {
        if (filename != null && filename.contains(".")) {
            String ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
            if (ext.matches("\\.[a-z0-9]{1,5}")) return ext;
        }
        if (mimeType == null) return "";
        return switch (mimeType.toLowerCase()) {
            case "image/jpeg" -> ".jpg";
            case "image/png"  -> ".png";
            case "image/gif"  -> ".gif";
            case "application/pdf" -> ".pdf";
            case "model/stl", "application/sla" -> ".stl";
            default -> "";
        };
    }

    @Override
    public MediaFile addMediaFile(UUID buildId, MultipartFile file) {
        Optional<BuildEntity> buildOpt = buildRepository.findById(buildId);
        if (buildOpt.isEmpty()) return null;

        MediaFileEntity entity = new MediaFileEntity();
        entity.setBuild(buildOpt.get());
        entity.setFilename(file.getOriginalFilename());
        entity.setSizeBytes((int) file.getSize());
        entity.setMimeType(file.getContentType());
        entity = mediaFileRepository.save(entity); // assigns UUID

        try {
            Path buildDir = Paths.get(uploadDir, buildId.toString()).toAbsolutePath().normalize();
            Files.createDirectories(buildDir);

            String ext = safeExtension(file.getOriginalFilename(), file.getContentType());
            Path target = buildDir.resolve(entity.getId().toString() + ext);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            String url = publicBaseUrl + "/uploads/" + buildId + "/" + entity.getId() + ext;
            entity.setUrl(url);
            entity = mediaFileRepository.save(entity);
            return toDTO(entity);
        } catch (IOException ioe) {
            log.error("Failed to write uploaded file for build {}: {}", buildId, ioe.getMessage());
            // Roll the DB row back if disk write failed.
            mediaFileRepository.delete(entity);
            return null;
        }
    }

    @Override
    public List<MediaFile> findByBuildId(UUID buildId) {
        return mediaFileRepository.findByBuildId(buildId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean deleteMediaFile(UUID buildId, UUID mediaId) {
        List<MediaFileEntity> files = mediaFileRepository.findByBuildId(buildId);
        Optional<MediaFileEntity> target = files.stream()
                .filter(f -> f.getId().equals(mediaId))
                .findFirst();
        if (target.isEmpty()) return false;

        MediaFileEntity entity = target.get();
        try {
            Path buildDir = Paths.get(uploadDir, buildId.toString()).toAbsolutePath().normalize();
            String ext = safeExtension(entity.getFilename(), entity.getMimeType());
            Path file = buildDir.resolve(entity.getId().toString() + ext);
            Files.deleteIfExists(file);
        } catch (IOException ioe) {
            log.warn("Could not delete file for media {}: {}", mediaId, ioe.getMessage());
            // Continue with DB delete anyway — orphan disk files are recoverable manually.
        }
        mediaFileRepository.delete(entity);
        return true;
    }

    @Override
    public boolean buildExists(UUID buildId) {
        return buildRepository.existsById(buildId);
    }

    @Override
    public int countByBuildId(UUID buildId) {
        return mediaFileRepository.findByBuildId(buildId).size();
    }
}
