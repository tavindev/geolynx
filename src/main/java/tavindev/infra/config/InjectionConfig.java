package tavindev.infra.config;

import org.glassfish.hk2.utilities.binding.AbstractBinder;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.repositories.UserRepository;
import tavindev.core.authorization.roleChange.RoleChangeAuthorizationChain;
import tavindev.core.authorization.accountState.AccountStateChangeAuthorizationChain;
import tavindev.core.authorization.accountRemoval.AccountRemovalAuthorizationChain;
import tavindev.core.authorization.attributeChange.AttributeChangeAuthorizationChain;
import tavindev.core.services.AuthService;
import tavindev.core.services.UserService;
import tavindev.infra.repositories.FirebaseAuthTokenRepository;
import tavindev.infra.repositories.FirebaseUserRepository;

public class InjectionConfig extends AbstractBinder {
    @Override
    protected void configure() {
        bind(FirebaseUserRepository.class).to(UserRepository.class);
        bind(FirebaseAuthTokenRepository.class).to(AuthTokenRepository.class);
        bind(AuthService.class).to(AuthService.class);
        bind(UserService.class).to(UserService.class);
        bind(RoleChangeAuthorizationChain.class).to(RoleChangeAuthorizationChain.class);
        bind(AccountStateChangeAuthorizationChain.class).to(AccountStateChangeAuthorizationChain.class);
        bind(AccountRemovalAuthorizationChain.class).to(AccountRemovalAuthorizationChain.class);
        bind(AttributeChangeAuthorizationChain.class).to(AttributeChangeAuthorizationChain.class);
    }
} 