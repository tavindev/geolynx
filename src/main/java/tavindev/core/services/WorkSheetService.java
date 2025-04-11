package tavindev.core.services;

import jakarta.inject.Inject;
import tavindev.core.entities.User;
import tavindev.core.entities.WorkSheet;
import tavindev.core.repositories.WorkSheetRepository;
import tavindev.core.authorization.worksheet.WorksheetAuthorizationChain;
import tavindev.core.authorization.worksheet.WorksheetAction;
import tavindev.core.utils.AuthUtils;

public class WorkSheetService {
    @Inject
    private WorkSheetRepository datastoreWorkSheetRepository;

    @Inject
    private WorksheetAuthorizationChain worksheetAuthorizationChain;

    @Inject
    private AuthUtils authUtils;

    @Inject
    private AuthService authService;

    @Inject
    private UserService userService;

    public WorkSheet createOrUpdateWorkSheet(String tokenId, WorkSheet workSheet) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        
        if (workSheet.getId() == null) {
            worksheetAuthorizationChain.handle(currentUser, workSheet, WorksheetAction.CREATE);
        } else {
            worksheetAuthorizationChain.handle(currentUser, workSheet, WorksheetAction.UPDATE);
        }

        datastoreWorkSheetRepository.save(workSheet);

        return workSheet;
    }

} 