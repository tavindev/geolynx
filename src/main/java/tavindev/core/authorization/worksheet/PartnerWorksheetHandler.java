package tavindev.core.authorization.worksheet;

import tavindev.core.entities.User;
import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.UserRole;
import tavindev.core.exceptions.UnauthorizedException;

public class PartnerWorksheetHandler extends BaseWorksheetHandler {
    @Override
    protected boolean canHandle(User currentUser, WorkSheet workSheet, WorksheetAction action) {
        return currentUser.getRole() == UserRole.PARTNER;
    }

    @Override
    protected void doHandle(User currentUser, WorkSheet workSheet, WorksheetAction action) {
        switch (action) {
            case UPDATE_STATUS:
                if (!workSheet.getEntityAccount().equals(currentUser.getUsername())) {
                    throw new UnauthorizedException("Parceiro só pode atualizar o estado das suas próprias obras.");
                }
                break;
            default:
                throw new UnauthorizedException("Ação não permitida para PARCEIRO.");
        }
    }
} 