package tavindev.infra.config;

import org.glassfish.jersey.server.ResourceConfig;
import jakarta.ws.rs.ApplicationPath;
import tavindev.core.AdminAccountCreation;
import tavindev.infra.filters.AuthTokenExtractionFilter;

@ApplicationPath("/api")
public class ApplicationConfig extends ResourceConfig {
    public ApplicationConfig() {
        // Register packages to scan for resources
        packages("tavindev");

        register(new InjectionConfig());
        register(AuthTokenExtractionFilter.class);
        register(AdminAccountCreation.class);
        register(JacksonConfig.class);
    }
}