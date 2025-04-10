package tavindev.core.authorization.accountState;

import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.authorization.accountState.handler.AccountStateChangeAuthorizationHandler;
import tavindev.core.authorization.accountState.handler.AdminAccountStateChangeHandler;
import tavindev.core.authorization.accountState.handler.BackOfficeAccountStateChangeHandler;
import tavindev.core.entities.User;
import tavindev.core.entities.AccountStatus;

@Singleton
public class AccountStateChangeAuthorizationChain {
    private final AccountStateChangeAuthorizationHandler chain;

    @Inject
    public AccountStateChangeAuthorizationChain() {
        AccountStateChangeAuthorizationHandler adminHandler = new AdminAccountStateChangeHandler();
        AccountStateChangeAuthorizationHandler backOfficeHandler = new BackOfficeAccountStateChangeHandler();

        this.chain = adminHandler.setNext(backOfficeHandler);
    }

    public void handle(User currentUser, User targetUser, AccountStatus newState) {
        chain.handle(currentUser, targetUser, newState);
    }
} 