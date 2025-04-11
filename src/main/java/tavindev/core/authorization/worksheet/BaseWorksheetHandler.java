package tavindev.core.authorization.worksheet;

import tavindev.core.entities.User;
import tavindev.core.entities.WorkSheet;
import tavindev.core.exceptions.UnauthorizedException;

public abstract class BaseWorksheetHandler implements WorksheetAuthorizationHandler {
    private WorksheetAuthorizationHandler next;

    @Override
    public WorksheetAuthorizationHandler setNext(WorksheetAuthorizationHandler next) {
        this.next = next;
        return next;
    }

    @Override
    public void handle(User currentUser, WorkSheet workSheet, WorksheetAction action) {
        if (canHandle(currentUser, workSheet, action)) {
            doHandle(currentUser, workSheet, action);
        } else if (next != null) {
            next.handle(currentUser, workSheet, action);
        } else {
            throw new UnauthorizedException("Permissões insuficientes para realizar esta ação na folha de obra.");
        }
    }

    protected abstract boolean canHandle(User currentUser, WorkSheet workSheet, WorksheetAction action);
    protected abstract void doHandle(User currentUser, WorkSheet workSheet, WorksheetAction action);
} 