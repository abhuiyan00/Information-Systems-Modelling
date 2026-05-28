package pl.edu.pwr.tkubik.ism.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.pwr.tkubik.ism.entity.UserEntity;
import pl.edu.pwr.tkubik.ism.repository.UserRepository;
import pl.edu.pwr.tkubik.ism.security.CurrentUser;

import java.util.*;

/**
 * Lightweight public directory used by the message recipient picker.
 * Returns only id + username + email so the inbox UI can offer a typeahead
 * instead of forcing users to paste UUIDs. Any authenticated member can call
 * this; the system user and the caller themselves are excluded.
 */
@RestController
@RequestMapping("/users")
public class UserDirectoryController {

    @Autowired private UserRepository userRepo;
    @Autowired private CurrentUser currentUser;

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> search(@RequestParam(value = "q", required = false) String q) {
        if (!currentUser.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String query = (q == null) ? "" : q.trim();
        UUID me = currentUser.getUserId();
        List<UserEntity> rows = userRepo.searchByQuery(query, me);
        List<Map<String, Object>> out = new ArrayList<>();
        int limit = Math.min(rows.size(), 20);
        for (int i = 0; i < limit; i++) {
            UserEntity u = rows.get(i);
            Map<String, Object> r = new LinkedHashMap<>();
            r.put("id", u.getId());
            r.put("username", u.getUsername());
            r.put("email", u.getEmail());
            out.add(r);
        }
        return ResponseEntity.ok(out);
    }
}
