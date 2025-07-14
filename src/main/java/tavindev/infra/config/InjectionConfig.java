package tavindev.infra.config;

import org.glassfish.hk2.utilities.binding.AbstractBinder;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.services.AuthService;
import tavindev.core.services.CoordinateTransformationService;
import tavindev.core.services.ExecutionSheetService;
import tavindev.core.services.GeohashService;
import tavindev.core.services.UserService;
import tavindev.core.services.WorkSheetService;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.repositories.DatastoreAuthTokenRepository;
import tavindev.infra.repositories.DatastoreUserRepository;
import tavindev.infra.repositories.ExecutionSheetRepository;
import tavindev.infra.repositories.WorkSheetRepository;

public class InjectionConfig extends AbstractBinder {
    @Override
    protected void configure() {
        bind(DatastoreUserRepository.class).to(DatastoreUserRepository.class);
        bind(DatastoreAuthTokenRepository.class).to(AuthTokenRepository.class);
        bind(WorkSheetRepository.class).to(WorkSheetRepository.class);
        bind(AuthService.class).to(AuthService.class);
        bind(UserService.class).to(UserService.class);
        bind(AuthUtils.class).to(AuthUtils.class);
        bind(WorkSheetService.class).to(WorkSheetService.class);
        bind(GeohashService.class).to(GeohashService.class);
        bind(CoordinateTransformationService.class).to(CoordinateTransformationService.class);
        bind(ExecutionSheetRepository.class).to(ExecutionSheetRepository.class);
        bind(ExecutionSheetService.class).to(ExecutionSheetService.class);
    }
}