package tavindev.core.authorization.worksheet;

import tavindev.core.entities.User;
import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.UserRole;

public class SMBOWorksheetHandler extends BaseWorksheetHandler {
    @Override
    protected boolean canHandle(User currentUser, WorkSheet workSheet, WorksheetAction action) {
        return currentUser.getRole() == UserRole.SMBO;
    }

    @Override
    protected void doHandle(User currentUser, WorkSheet workSheet, WorksheetAction action) {
        // SMBO users can create worksheets through import
        // No additional validation needed beyond role check
    }
}