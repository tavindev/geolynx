package tavindev.core.authorization.accountRemoval;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.exceptions.UnauthorizedException;

public class BackOfficeAccountRemovalHandler extends BaseAccountRemovalHandler {
    @Override
    protected boolean canHandle(User currentUser, User targetUser) {
        return currentUser.getRole() == UserRole.BACKOFFICE;
    }

    @Override
    protected void doHandle(User currentUser, User targetUser) {
        if (targetUser.getRole() != UserRole.ENDUSER && targetUser.getRole() != UserRole.PARTNER) {
            throw new UnauthorizedException("BACKOFFICE só pode remover contas de ENDUSER ou PARTNER.");
        }
    }
} 