package tavindev.core.authorization.accountState.handler;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.entities.AccountStatus;

public class AdminAccountStateChangeHandler extends AccountStateChangeAuthorizationHandler {
    @Override
    protected boolean canHandle(User currentUser, User targetUser, AccountStatus newState) {
        return currentUser.getRole() == UserRole.ADMIN;
    }

    @Override
    protected void validate(User currentUser, User targetUser, AccountStatus newState) {
        // ADMIN can change any account state, no validation needed
    }
} 