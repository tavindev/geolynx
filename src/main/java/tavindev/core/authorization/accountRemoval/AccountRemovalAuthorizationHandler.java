package tavindev.core.authorization.accountRemoval;

import tavindev.core.entities.User;

public interface AccountRemovalAuthorizationHandler {
    void handle(User currentUser, User targetUser);
    AccountRemovalAuthorizationHandler setNext(AccountRemovalAuthorizationHandler next);
} 