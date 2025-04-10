package tavindev.core.authorization.accountState.handler;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.entities.AccountStatus;
import tavindev.core.exceptions.UnauthorizedException;

public class BackOfficeAccountStateChangeHandler extends AccountStateChangeAuthorizationHandler {
    @Override
    protected boolean canHandle(User currentUser, User targetUser, AccountStatus newState) {
        return currentUser.getRole() == UserRole.BACKOFFICE;
    }

    @Override
    protected void validate(User currentUser, User targetUser, AccountStatus newState) {
        if (newState != AccountStatus.ATIVADA && newState != AccountStatus.DESATIVADA) {
            throw new UnauthorizedException("Permissões insuficientes para alterar o estado desta conta.");
        }
    }
} 