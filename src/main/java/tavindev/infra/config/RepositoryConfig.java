package tavindev.infra.config;

import org.glassfish.hk2.utilities.binding.AbstractBinder;
import tavindev.core.UserRepository;
import tavindev.core.services.AuthService;
import tavindev.core.services.UserService;
import tavindev.infra.repositories.FirebaseUserRepository;

public class RepositoryConfig extends AbstractBinder {
    @Override
    protected void configure() {
        bind(FirebaseUserRepository.class).to(UserRepository.class);
        bind(UserService.class).to(UserService.class);
        bind(AuthService.class).to(AuthService.class);
    }
} 