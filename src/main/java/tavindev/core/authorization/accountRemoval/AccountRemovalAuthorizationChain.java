package tavindev.core.authorization.accountRemoval;

import jakarta.inject.Singleton;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.User;

@Singleton
@Service
public class AccountRemovalAuthorizationChain {
    private final AccountRemovalAuthorizationHandler chain;
    
    public AccountRemovalAuthorizationChain() {
        AccountRemovalAuthorizationHandler backOfficeHandler = new BackOfficeAccountRemovalHandler();
        AccountRemovalAuthorizationHandler adminHandler = new AdminAccountRemovalHandler();

        this.chain = backOfficeHandler.setNext(adminHandler);
    }

    public void handle(User currentUser, User targetUser) {
        chain.handle(currentUser, targetUser);
    }
} 