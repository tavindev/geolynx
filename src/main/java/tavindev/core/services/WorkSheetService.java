package tavindev.core.services;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import tavindev.core.entities.User;
import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.Permission;
import tavindev.core.authorization.PermissionAuthorizationHandler;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.dto.worksheet.CreateOrUpdateWorkSheetDTO;
import tavindev.infra.dto.worksheet.WorkSheetListResponseDTO;
import tavindev.api.mappers.WorkSheetMapper;
import tavindev.infra.repositories.WorkSheetRepository;

public class WorkSheetService {
    @Inject
    private WorkSheetRepository workSheetRepository;

    @Inject
    private AuthUtils authUtils;

    public WorkSheet createOrUpdateWorkSheet(String tokenId, CreateOrUpdateWorkSheetDTO dto) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.IMP_FO);

        WorkSheet workSheet = WorkSheetMapper.toEntity(dto);

        workSheetRepository.save(workSheet);

        return workSheet;
    }

    public void removeWorkSheet(String tokenId, Long id) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.REM_FO);

        WorkSheet workSheet = workSheetRepository.get(id);

        if (workSheet == null)
            throw new NotFoundException("Folha de obra não encontrada");

        workSheetRepository.remove(workSheet);
    }

    public WorkSheet getWorkSheet(String tokenId, Long id) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_GEN_FO);

        return workSheetRepository.get(id);
    }

    public List<WorkSheetListResponseDTO> getAllWorkSheets(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_GEN_FO);

        return workSheetRepository.getAll();
    }
}