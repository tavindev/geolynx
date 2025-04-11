package tavindev.core.authorization.worksheet;

import tavindev.core.entities.User;
import tavindev.core.entities.WorkSheet;

public interface WorksheetAuthorizationHandler {
    void handle(User currentUser, WorkSheet workSheet, WorksheetAction action);
    WorksheetAuthorizationHandler setNext(WorksheetAuthorizationHandler next);
} 