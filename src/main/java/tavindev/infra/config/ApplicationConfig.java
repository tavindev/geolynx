package tavindev.infra.config;

import jakarta.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;
import tavindev.core.TestAccountCreation;
import tavindev.core.TestAnimalsCreation;
import tavindev.infra.http.controllers.ExecutionSheetController;
import tavindev.infra.http.controllers.WorkSheetController;
import tavindev.infra.filters.AuthTokenExtractionFilter;
import tavindev.infra.filters.AdditionalResponseHeadersFilter;
import tavindev.infra.http.exception.DomainExceptionMapper;
import tavindev.infra.http.exception.IllegalArgumentExceptionMapper;
import tavindev.infra.http.exception.NotFoundExceptionMapper;
import tavindev.infra.http.exception.IllegalStateExceptionMapper;
import tavindev.infra.http.exception.RuntimeExceptionMapper;
import tavindev.infra.http.exception.ValidationExceptionMapper;
import tavindev.infra.http.exception.WebApplicationExceptionMapper;
import tavindev.infra.http.exception.GenericExceptionMapper;
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
        register(TestAccountCreation.class);
        register(TestAnimalsCreation.class);
        register(JacksonConfig.class);
        register(WorkSheetController.class);
        register(ExecutionSheetController.class);

        // Register exception mappers
        register(DomainExceptionMapper.class);
        register(IllegalArgumentExceptionMapper.class);
        register(NotFoundExceptionMapper.class);
        register(IllegalStateExceptionMapper.class);
        register(RuntimeExceptionMapper.class);
        register(ValidationExceptionMapper.class);
        register(WebApplicationExceptionMapper.class);
        register(GenericExceptionMapper.class);

        logger.log(Level.INFO, "ApplicationConfig initialization completed");
    }
}