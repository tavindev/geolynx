package tavindev.core.authorization.accountRemoval;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;

public class AdminAccountRemovalHandler extends BaseAccountRemovalHandler {
    @Override
    protected boolean canHandle(User currentUser, User targetUser) {
        return currentUser.getRole() == UserRole.ADMIN;
    }

    @Override
    protected void doHandle(User currentUser, User targetUser) {
        // ADMIN can remove any account, no additional checks needed
    }
} 