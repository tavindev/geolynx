package tavindev.core.authorization.roleChange;

import jakarta.inject.Singleton;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.authorization.roleChange.handler.AdminRoleChangeHandler;
import tavindev.core.authorization.roleChange.handler.BackOfficeRoleChangeHandler;
import tavindev.core.authorization.roleChange.handler.EndUserRoleChangeHandler;
import tavindev.core.authorization.roleChange.handler.RoleChangeAuthorizationHandler;
import tavindev.core.entities.AccountStatus;
import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;

@Singleton
public class RoleChangeAuthorizationChain {
    private final RoleChangeAuthorizationHandler chain;
    
    public RoleChangeAuthorizationChain() {
        RoleChangeAuthorizationHandler endUserHandler = new EndUserRoleChangeHandler();
        RoleChangeAuthorizationHandler backOfficeHandler = new BackOfficeRoleChangeHandler();
        RoleChangeAuthorizationHandler adminHandler = new AdminRoleChangeHandler();

        this.chain = endUserHandler.setNext(backOfficeHandler).setNext(adminHandler);
    }

    public void handle(User currentUser, User targetUser, UserRole newRole) {
        chain.handle(currentUser, targetUser, newRole);
    }
}