package pl.edu.pwr.tkubik.ism.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import pl.edu.pwr.tkubik.ism.security.AuthInterceptor;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private AuthInterceptor authInterceptor;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Value("${cors.allowed-origins:http://localhost:4200}")
    private String corsAllowedOrigins;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor);
    }

    /**
     * Mount every controller in {@code pl.edu.pwr.tkubik.ism.api} under
     * {@code /api/v1}, matching the openapi.yaml `servers:` URL.
     *
     * Without this, the OpenAPI generator (interfaceOnly=true) emits paths at
     * the root of the context, so e.g. {@code POST /auth/login} would 404
     * for the Angular frontend (which calls {@code /api/v1/auth/login}).
     *
     * StatisticsController also lives in the api package — its own
     * {@code @RequestMapping("/statistics")} is concatenated to {@code /api/v1}
     * and resolves to {@code /api/v1/statistics}.
     */
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.addPathPrefix("/api/v1",
                clazz -> clazz.getPackageName().startsWith("pl.edu.pwr.tkubik.ism.api"));
    }

    // Allow the Angular dev server (and SSR build) to call the API from a different origin.
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(corsAllowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("Content-Type", "Authorization")
                .exposedHeaders("Location")
                .allowCredentials(false)
                .maxAge(3600);
    }

    // Serve uploaded media files at /StudentsApp/uploads/{buildId}/{file}
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path absolute = Paths.get(uploadDir).toAbsolutePath().normalize();
        String location = absolute.toUri().toString(); // "file:/abs/path/uploads/"
        if (!location.endsWith("/")) location = location + "/";
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location)
                .setCachePeriod(3600);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
