package pl.edu.pwr.tkubik.ism.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.pwr.tkubik.ism.entity.BuildEntity;
import pl.edu.pwr.tkubik.ism.entity.MediaFileEntity;
import pl.edu.pwr.tkubik.ism.model.MediaFile;
import pl.edu.pwr.tkubik.ism.repository.BuildRepository;
import pl.edu.pwr.tkubik.ism.repository.MediaFileRepository;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MediaFileServiceImpl implements MediaFileService {

    @Autowired
    private MediaFileRepository mediaFileRepository;

    @Autowired
    private BuildRepository buildRepository;

    // ── Conversion: Entity → DTO ──
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

    @Override
    public MediaFile addMediaFile(UUID buildId, String filename,
                                  int sizeBytes, String mimeType) {
        Optional<BuildEntity> buildOpt = buildRepository.findById(buildId);
        if (buildOpt.isEmpty()) return null;

        MediaFileEntity entity = new MediaFileEntity();
        entity.setBuild(buildOpt.get());
        entity.setFilename(filename);
        entity.setSizeBytes(sizeBytes);
        entity.setMimeType(mimeType);
        entity.setUrl("https://modellingclub.example.com/media/" + UUID.randomUUID());

        entity = mediaFileRepository.save(entity);
        return toDTO(entity);
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
        mediaFileRepository.delete(target.get());
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