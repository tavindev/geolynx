package tavindev.infra.config;

import org.glassfish.hk2.utilities.binding.AbstractBinder;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.services.AuthService;
import tavindev.core.services.CoordinateTransformationService;
import tavindev.core.services.ExecutionSheetService;
import tavindev.core.services.GeoHashService;
import tavindev.core.services.HistoricalCuriosityService;
import tavindev.core.services.NotificationService;
import tavindev.core.services.AnimalService;
import tavindev.core.services.CorporationService;
import tavindev.core.services.UserService;
import tavindev.core.services.WorkSheetService;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.repositories.AnimalRepository;
import tavindev.infra.repositories.DatastoreAuthTokenRepository;
import tavindev.infra.repositories.DatastoreCorporationRepository;
import tavindev.infra.repositories.DatastoreUserRepository;
import tavindev.infra.repositories.ExecutionSheetRepository;
import tavindev.infra.repositories.HistoricalCuriosityRepository;
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
        bind(CoordinateTransformationService.class).to(CoordinateTransformationService.class);
        bind(ExecutionSheetRepository.class).to(ExecutionSheetRepository.class);
        bind(ExecutionSheetService.class).to(ExecutionSheetService.class);
        bind(HistoricalCuriosityRepository.class).to(HistoricalCuriosityRepository.class);
        bind(HistoricalCuriosityService.class).to(HistoricalCuriosityService.class);
        bind(NotificationService.class).to(NotificationService.class);
        bind(AnimalService.class).to(AnimalService.class);
        bind(AnimalRepository.class).to(AnimalRepository.class);
        bind(GeoHashService.class).to(GeoHashService.class);
        bind(DatastoreCorporationRepository.class).to(DatastoreCorporationRepository.class);
        bind(CorporationService.class).to(CorporationService.class);
    }
}