package tavindev.infra.config;

import jakarta.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;
import tavindev.core.AdminAccountCreation;
import tavindev.infra.http.controllers.ExecutionSheetController;
import tavindev.infra.http.controllers.WorkSheetController;
import tavindev.infra.filters.AuthTokenExtractionFilter;
import tavindev.infra.filters.AdditionalResponseHeadersFilter;
import java.util.logging.Logger;
import java.util.logging.Level;

@ApplicationPath("/api")
public class ApplicationConfig extends ResourceConfig {
    private static final Logger logger = Logger.getLogger(ApplicationConfig.class.getName());

    public ApplicationConfig() {
        logger.log(Level.INFO, "ApplicationConfig is being initialized");

        // Register packages to scan for resources
        packages("tavindev");

        register(new InjectionConfig());
        register(AuthTokenExtractionFilter.class);
        register(AdditionalResponseHeadersFilter.class);
        register(AdminAccountCreation.class);
        register(JacksonConfig.class);
        register(WorkSheetController.class);
        register(ExecutionSheetController.class);

        logger.log(Level.INFO, "ApplicationConfig initialization completed");
    }
}