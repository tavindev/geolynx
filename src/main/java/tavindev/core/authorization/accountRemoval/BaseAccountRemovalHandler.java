package tavindev.core.authorization.accountRemoval;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.exceptions.UnauthorizedException;

public abstract class BaseAccountRemovalHandler implements AccountRemovalAuthorizationHandler {
    private AccountRemovalAuthorizationHandler next;

    @Override
    public AccountRemovalAuthorizationHandler setNext(AccountRemovalAuthorizationHandler next) {
        this.next = next;
        return next;
    }

    @Override
    public void handle(User currentUser, User targetUser) {
        if (canHandle(currentUser, targetUser)) {
            doHandle(currentUser, targetUser);
        } else if (next != null) {
            next.handle(currentUser, targetUser);
        } else {
            throw new UnauthorizedException("Permissões insuficientes para remover esta conta.");
        }
    }

    protected abstract boolean canHandle(User currentUser, User targetUser);
    protected abstract void doHandle(User currentUser, User targetUser);
} 