package tavindev.core.authorization.worksheet;

import jakarta.inject.Singleton;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.User;
import tavindev.core.entities.WorkSheet;

@Singleton
@Service
public class WorksheetAuthorizationChain {
    private final WorksheetAuthorizationHandler chain;

    public WorksheetAuthorizationChain() {
        WorksheetAuthorizationHandler partnerHandler = new PartnerWorksheetHandler();
        WorksheetAuthorizationHandler backOfficeHandler = new BackOfficeWorksheetHandler();
        WorksheetAuthorizationHandler adminHandler = new AdminWorksheetHandler();

        this.chain = partnerHandler
            .setNext(backOfficeHandler)
            .setNext(adminHandler);
    }

    public void handle(User currentUser, WorkSheet workSheet, WorksheetAction action) {
        chain.handle(currentUser, workSheet, action);
    }
} 