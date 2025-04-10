package tavindev.core.authorization.roleChange.handler;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.exceptions.UnauthorizedException;

public class EndUserRoleChangeHandler extends RoleChangeAuthorizationHandler {
    @Override
    protected boolean canHandle(User currentUser, User targetUser, UserRole newRole) {
        return currentUser.getRole() == UserRole.ENDUSER;
    }

    @Override
    protected void validate(User currentUser, User targetUser, UserRole newRole) {
        throw new UnauthorizedException("Permissões insuficientes para alterar o role deste utilizador.");
    }
} 