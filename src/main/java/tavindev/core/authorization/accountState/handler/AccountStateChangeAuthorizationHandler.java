package tavindev.core.authorization.accountState.handler;

import tavindev.core.entities.User;
import tavindev.core.entities.AccountStatus;
import tavindev.core.exceptions.UnauthorizedException;

public abstract class AccountStateChangeAuthorizationHandler {
    private AccountStateChangeAuthorizationHandler nextHandler;

    public AccountStateChangeAuthorizationHandler setNext(AccountStateChangeAuthorizationHandler handler) {
        this.nextHandler = handler;
        return handler;
    }

    public void handle(User currentUser, User targetUser, AccountStatus newState) {
        if (canHandle(currentUser, targetUser, newState)) {
            validate(currentUser, targetUser, newState);
            return;
        }

        if (nextHandler != null) {
            nextHandler.handle(currentUser, targetUser, newState);
            return;
        }

        throw new UnauthorizedException("Permissões insuficientes para alterar o estado desta conta.");
    }

    protected abstract boolean canHandle(User currentUser, User targetUser, AccountStatus newState);
    protected abstract void validate(User currentUser, User targetUser, AccountStatus newState);
} 