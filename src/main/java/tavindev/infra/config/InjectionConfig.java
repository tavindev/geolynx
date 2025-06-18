package tavindev.infra.config;

import org.glassfish.hk2.utilities.binding.AbstractBinder;
import tavindev.core.authorization.worksheet.WorksheetAuthorizationChain;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.repositories.UserRepository;
import tavindev.core.authorization.roleChange.RoleChangeAuthorizationChain;
import tavindev.core.authorization.accountState.AccountStateChangeAuthorizationChain;
import tavindev.core.authorization.accountRemoval.AccountRemovalAuthorizationChain;
import tavindev.core.authorization.attributeChange.AttributeChangeAuthorizationChain;
import tavindev.core.services.AuthService;
import tavindev.core.services.UserService;
import tavindev.core.services.WorkSheetService;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.repositories.DatastoreAuthTokenRepository;
import tavindev.infra.repositories.DatastoreUserRepository;
import tavindev.infra.repositories.WorkSheetRepository;

public class InjectionConfig extends AbstractBinder {
    @Override
    protected void configure() {
        bind(DatastoreUserRepository.class).to(UserRepository.class);
        bind(DatastoreAuthTokenRepository.class).to(AuthTokenRepository.class);
        bind(WorkSheetRepository.class).to(WorkSheetRepository.class);
        bind(AuthService.class).to(AuthService.class);
        bind(UserService.class).to(UserService.class);
        bind(AuthUtils.class).to(AuthUtils.class);
        bind(WorkSheetService.class).to(WorkSheetService.class);
        bind(RoleChangeAuthorizationChain.class).to(RoleChangeAuthorizationChain.class);
        bind(AccountStateChangeAuthorizationChain.class).to(AccountStateChangeAuthorizationChain.class);
        bind(AccountRemovalAuthorizationChain.class).to(AccountRemovalAuthorizationChain.class);
        bind(WorksheetAuthorizationChain.class).to(WorksheetAuthorizationChain.class);
        bind(AttributeChangeAuthorizationChain.class).to(AttributeChangeAuthorizationChain.class);
    }
} 