package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.tkubik.ism.entity.MarketplaceListingEntity;
import pl.edu.pwr.tkubik.ism.repository.BuildRepository;
import pl.edu.pwr.tkubik.ism.repository.MarketplaceListingRepository;
import pl.edu.pwr.tkubik.ism.repository.UserRepository;
import pl.edu.pwr.tkubik.ism.security.CurrentUser;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/marketplace")
public class MarketplaceController {

    @Autowired private MarketplaceListingRepository repo;
    @Autowired private UserRepository userRepo;
    @Autowired private BuildRepository buildRepo;
    @Autowired private CurrentUser currentUser;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list(@RequestParam(required = false) String status,
                                                          @RequestParam(required = false) String category) {
        List<MarketplaceListingEntity> rows = repo.findAll();
        List<Map<String, Object>> out = new ArrayList<>();
        for (MarketplaceListingEntity m : rows) {
            if (status != null && !status.isBlank() && !status.equals(m.getStatus())) continue;
            if (category != null && !category.isBlank() && !category.equals(m.getPartCategory())) continue;
            out.add(toDto(m));
        }
        out.sort((a, b) -> ((String) b.get("created_at")).compareTo((String) a.get("created_at")));
        return ResponseEntity.ok(out);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> get(@PathVariable UUID id) {
        return repo.findById(id).map(m -> ResponseEntity.ok(toDto(m)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        if (!currentUser.isAuthenticated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        MarketplaceListingEntity m = new MarketplaceListingEntity();
        m.setSeller(userRepo.findById(currentUser.getUserId()).orElse(null));
        String buildIdStr = (String) body.get("build_id");
        if (buildIdStr != null) {
            m.setBuild(buildRepo.findById(UUID.fromString(buildIdStr)).orElse(null));
        }
        m.setTitle((String) body.get("title"));
        m.setPartCategory((String) body.get("part_category"));
        m.setBrand((String) body.get("brand"));
        m.setCondition((String) body.getOrDefault("condition", "used"));
        Object price = body.get("price_pln");
        m.setPricePln(price == null ? 0.0 : ((Number) price).doubleValue());
        m.setCurrency((String) body.getOrDefault("currency", "PLN"));
        m.setStatus("active");
        m.setDescription((String) body.get("description"));
        m.setCreatedAt(OffsetDateTime.now());
        repo.save(m);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(m));
    }

    @PatchMapping("/{id}/sold")
    public ResponseEntity<Map<String, Object>> markSold(@PathVariable UUID id) {
        if (!currentUser.isAuthenticated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        MarketplaceListingEntity m = repo.findById(id).orElse(null);
        if (m == null) return ResponseEntity.notFound().build();
        if (m.getSeller() == null || !m.getSeller().getId().equals(currentUser.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        m.setStatus("sold");
        repo.save(m);
        return ResponseEntity.ok(toDto(m));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!currentUser.isAuthenticated()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        MarketplaceListingEntity m = repo.findById(id).orElse(null);
        if (m == null) return ResponseEntity.notFound().build();
        if (m.getSeller() == null || (!m.getSeller().getId().equals(currentUser.getUserId()) && !currentUser.isAdmin())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        repo.delete(m);
        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> toDto(MarketplaceListingEntity m) {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("id", m.getId());
        r.put("seller_id", m.getSeller() == null ? null : m.getSeller().getId());
        r.put("seller_username", m.getSeller() == null ? null : m.getSeller().getUsername());
        r.put("build_id", m.getBuild() == null ? null : m.getBuild().getId());
        r.put("title", m.getTitle());
        r.put("part_category", m.getPartCategory());
        r.put("brand", m.getBrand());
        r.put("condition", m.getCondition());
        r.put("price_pln", m.getPricePln());
        r.put("currency", m.getCurrency());
        r.put("status", m.getStatus());
        r.put("description", m.getDescription());
        r.put("created_at", m.getCreatedAt() == null ? "" : m.getCreatedAt().toString());
        return r;
    }
}
