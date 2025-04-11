package tavindev.core.authorization.worksheet;

import tavindev.core.entities.User;
import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.UserRole;

public class AdminWorksheetHandler extends BaseWorksheetHandler {
    @Override
    protected boolean canHandle(User currentUser, WorkSheet workSheet, WorksheetAction action) {
        return currentUser.getRole() == UserRole.ADMIN;
    }

    @Override
    protected void doHandle(User currentUser, WorkSheet workSheet, WorksheetAction action) {
    }
} 