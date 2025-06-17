package tavindev.core.services;

import jakarta.inject.Inject;
import tavindev.core.entities.User;
import tavindev.core.entities.WorkSheet;
import tavindev.core.repositories.WorkSheetRepository;
import tavindev.core.authorization.worksheet.WorksheetAuthorizationChain;
import tavindev.core.authorization.worksheet.WorksheetAction;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.dto.worksheet.CreateOrUpdateWorkSheetDTO;
import tavindev.api.mappers.WorkSheetMapper;

public class WorkSheetService {
    @Inject
    private WorkSheetRepository workSheetRepository;

    @Inject
    private WorksheetAuthorizationChain worksheetAuthorizationChain;

    @Inject
    private AuthUtils authUtils;

    public WorkSheet createOrUpdateWorkSheet(String tokenId, CreateOrUpdateWorkSheetDTO dto) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        WorkSheet workSheet = WorkSheetMapper.toEntity(dto);

        if (!workSheetRepository.exists(dto.getMetadata().getId()))
            worksheetAuthorizationChain.handle(currentUser, workSheet, WorksheetAction.CREATE);
        else
            worksheetAuthorizationChain.handle(currentUser, workSheet, WorksheetAction.UPDATE);

        workSheetRepository.save(workSheet);

        return workSheet;
    }
}