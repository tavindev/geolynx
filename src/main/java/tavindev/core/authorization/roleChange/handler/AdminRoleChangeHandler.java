package tavindev.core.authorization.roleChange.handler;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;

public class AdminRoleChangeHandler extends RoleChangeAuthorizationHandler {
    @Override
    protected boolean canHandle(User currentUser, User targetUser, UserRole newRole) {
        return currentUser.getRole() == UserRole.ADMIN;
    }

    @Override
    protected void validate(User currentUser, User targetUser, UserRole newRole) {}
} 