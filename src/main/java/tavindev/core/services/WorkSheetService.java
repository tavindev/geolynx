package tavindev.core.services;

import java.util.List;

import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import tavindev.core.entities.User;
import tavindev.core.entities.WorkSheet;
import tavindev.core.entities.Permission;
import tavindev.core.authorization.PermissionAuthorizationHandler;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.dto.worksheet.WorkSheetListResponseDTO;
import tavindev.infra.dto.worksheet.WorksheetQueryFilters;
import tavindev.infra.repositories.WorkSheetRepository;

public class WorkSheetService {
    @Inject
    private WorkSheetRepository workSheetRepository;

    @Inject
    private AuthUtils authUtils;

    @Inject
    private GeoHashService geoHashService;

    public WorkSheet createOrUpdateWorkSheet(String tokenId, WorkSheet workSheet) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.IMP_FO);

        double[] firstPoint = workSheet.getFirstPoint();
        workSheet.setGeohash(geoHashService.calculateGeohash(firstPoint[0], firstPoint[1]));
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
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_DET_FO);

        return workSheetRepository.get(id);
    }

    public List<WorkSheetListResponseDTO> getAllWorkSheets(String tokenId, WorksheetQueryFilters filter) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_GEN_FO);

        return workSheetRepository.getAll(filter);
    }
}