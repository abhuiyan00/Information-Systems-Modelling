package pl.edu.pwr.tkubik.ism.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.pwr.tkubik.ism.entity.BuildEntity;
import pl.edu.pwr.tkubik.ism.entity.CommentEntity;
import pl.edu.pwr.tkubik.ism.entity.UserEntity;
import pl.edu.pwr.tkubik.ism.repository.UserRepository;

import java.io.ByteArrayOutputStream;
import java.io.UncheckedIOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@Transactional(readOnly = true)
public class AccountServiceImpl implements AccountService {

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper json = new ObjectMapper()
            .findAndRegisterModules()
            .enable(SerializationFeature.INDENT_OUTPUT);

    @Override
    public byte[] exportZip(UUID userId) {
        Optional<UserEntity> opt = userRepository.findById(userId);
        if (opt.isEmpty()) return null;
        UserEntity user = opt.get();

        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());
        profile.put("created_at", user.getCreatedAt());

        List<Map<String, Object>> builds = user.getBuilds().stream()
                .map(this::buildSummary).toList();

        List<Map<String, Object>> comments = user.getComments().stream()
                .map(this::commentSummary).toList();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             ZipOutputStream zip = new ZipOutputStream(out)) {

            writeJsonEntry(zip, "profile.json", profile);
            writeJsonEntry(zip, "builds.json", builds);
            writeJsonEntry(zip, "comments.json", comments);

            zip.finish();
            return out.toByteArray();
        } catch (java.io.IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private void writeJsonEntry(ZipOutputStream zip, String name, Object payload)
            throws java.io.IOException {
        zip.putNextEntry(new ZipEntry(name));
        zip.write(json.writeValueAsBytes(payload));
        zip.closeEntry();
    }

    private Map<String, Object> buildSummary(BuildEntity b) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", b.getId());
        m.put("title", b.getTitle());
        m.put("type", b.getType());
        m.put("status", b.getStatus());
        m.put("created_at", b.getCreatedAt());
        return m;
    }

    private Map<String, Object> commentSummary(CommentEntity c) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", c.getId());
        m.put("build_id", c.getBuild() != null ? c.getBuild().getId() : null);
        m.put("content", c.getContent());
        m.put("created_at", c.getCreatedAt());
        return m;
    }
}
