package pl.edu.pwr.tkubik.ism.studentservice;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import pl.edu.pwr.tkubik.ism.repository.BuildRepository;
import pl.edu.pwr.tkubik.ism.repository.UserRepository;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BuildsControllerIntegrationTest {

    private static final UUID SWAGGER_UUID_PLACEHOLDER =
            UUID.fromString("3fa85f64-5717-4562-b3fc-2c963f66afa6");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BuildRepository buildRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void buildsPostReturnsPersistedBuildIdAndLocationHeader() throws Exception {
        String email = "build-test-" + UUID.randomUUID() + "@example.com";
        String password = "TestPass123";

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "build-tester",
                                  "email": "%s",
                                  "password": "%s"
                                }
                                """.formatted(email, password)))
                .andExpect(status().isCreated());

        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "%s"
                                }
                                """.formatted(email, password)))
                .andExpect(status().isOk())
                .andReturn();
        String token = objectMapper
                .readTree(loginResult.getResponse().getContentAsString())
                .get("token").asText();

        String requestBody = """
                {
                  "title": "Swagger ID check",
                  "type": "drone"
                }
                """;

        MvcResult result = mockMvc.perform(post("/api/v1/builds")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andReturn();

        JsonNode responseJson = objectMapper.readTree(result.getResponse().getContentAsString());
        UUID createdId = UUID.fromString(responseJson.get("id").asText());

        assertNotEquals(SWAGGER_UUID_PLACEHOLDER, createdId,
                "Returned ID should be the persisted build ID, not Swagger's UUID placeholder");
        assertEquals("/builds/" + createdId, result.getResponse().getHeader("Location"));
        assertTrue(buildRepository.findById(createdId).isPresent(),
                "Build ID returned by the API should exist in the database");

        buildRepository.deleteById(createdId);
        userRepository.findByEmail(email).ifPresent(userRepository::delete);
    }
}
