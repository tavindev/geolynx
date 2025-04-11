package tavindev.core.authorization.worksheet;

import tavindev.core.entities.User;
import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.UserRole;
import tavindev.core.exceptions.UnauthorizedException;

public class BackOfficeWorksheetHandler extends BaseWorksheetHandler {
    @Override
    protected boolean canHandle(User currentUser, WorkSheet workSheet, WorksheetAction action) {
        return currentUser.getRole() == UserRole.BACKOFFICE;
    }

    @Override
    protected void doHandle(User currentUser, WorkSheet workSheet, WorksheetAction action) {
    }
} 