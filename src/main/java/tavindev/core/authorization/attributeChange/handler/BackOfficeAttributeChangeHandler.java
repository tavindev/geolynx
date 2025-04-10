package tavindev.core.authorization.attributeChange.handler;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.exceptions.UnauthorizedException;

public class BackOfficeAttributeChangeHandler extends BaseAttributeChangeHandler {
    private static final String[] RESTRICTED_ATTRIBUTES = {
        "username", "userid", "email"
    };

    @Override
    protected boolean canHandle(User currentUser, User targetUser, String attributeName) {
        return currentUser.getRole() == UserRole.BACKOFFICE && 
               (targetUser.getRole() == UserRole.ENDUSER || targetUser.getRole() == UserRole.PARTNER);
    }

    @Override
    protected void doHandle(User currentUser, User targetUser, String attributeName) {
        for (String restricted : RESTRICTED_ATTRIBUTES) {
            if (attributeName.equalsIgnoreCase(restricted)) {
                throw new UnauthorizedException("Não tem permissão para modificar este atributo.");
            }
        }
    }
} 