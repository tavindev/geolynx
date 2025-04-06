package tavindev.infra.config;

import org.glassfish.jersey.server.ResourceConfig;
import jakarta.ws.rs.ApplicationPath;

@ApplicationPath("/api")
public class ApplicationConfig extends ResourceConfig {
    public ApplicationConfig() {
        // Register packages to scan for resources
        packages("tavindev");
        
        // Register the repository configuration
        register(new RepositoryConfig());
    }
} 