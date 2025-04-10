package tavindev.core.authorization.roleChange.handler;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.exceptions.UnauthorizedException;

public abstract class RoleChangeAuthorizationHandler {
    private RoleChangeAuthorizationHandler nextHandler;

    public RoleChangeAuthorizationHandler setNext(RoleChangeAuthorizationHandler handler) {
        this.nextHandler = handler;
        return handler;
    }

    public void handle(User currentUser, User targetUser, UserRole newRole) {
        if (canHandle(currentUser, targetUser, newRole)) {
            validate(currentUser, targetUser, newRole);
            return;
        }

        if (nextHandler != null) {
            nextHandler.handle(currentUser, targetUser, newRole);
            return;
        }

        throw new UnauthorizedException("Permissões insuficientes para alterar o role deste utilizador.");
    }

    protected abstract boolean canHandle(User currentUser, User targetUser, UserRole newRole);
    protected abstract void validate(User currentUser, User targetUser, UserRole newRole);
} 