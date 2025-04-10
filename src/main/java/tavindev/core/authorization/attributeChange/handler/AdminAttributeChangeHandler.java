package tavindev.core.authorization.attributeChange.handler;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;

public class AdminAttributeChangeHandler extends BaseAttributeChangeHandler {
    @Override
    protected boolean canHandle(User currentUser, User targetUser, String attributeName) {
        return currentUser.getRole() == UserRole.ADMIN;
    }

    @Override
    protected void doHandle(User currentUser, User targetUser, String attributeName) {
        // Admin can modify any attribute
    }
} 