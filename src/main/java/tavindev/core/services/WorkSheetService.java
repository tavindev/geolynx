package tavindev.core.services;

import jakarta.inject.Inject;
import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.entities.WorkSheet;
import tavindev.core.repositories.WorkSheetRepository;
import tavindev.core.authorization.worksheet.WorksheetAuthorizationChain;
import tavindev.core.authorization.worksheet.WorksheetAction;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.dto.worksheet.CreateOrUpdateWorkSheetDTO;
import tavindev.infra.dto.worksheet.GeoJsonImportDTO;
import tavindev.api.mappers.WorkSheetMapper;
import tavindev.core.exceptions.BadRequestException;

public class WorkSheetService {
    @Inject
    private WorkSheetRepository workSheetRepository;

    @Inject
    private WorksheetAuthorizationChain worksheetAuthorizationChain;

    @Inject
    private AuthUtils authUtils;

    @Inject
    private AuthService authService;

    @Inject
    private UserService userService;

    public WorkSheet createOrUpdateWorkSheet(String tokenId, CreateOrUpdateWorkSheetDTO dto) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        WorkSheet workSheet = WorkSheetMapper.toEntity(dto);

        if (workSheetRepository.exists(dto.referencia_obra())) {
            worksheetAuthorizationChain.handle(currentUser, workSheet, WorksheetAction.CREATE);
        } else {
            worksheetAuthorizationChain.handle(currentUser, workSheet, WorksheetAction.UPDATE);
        }

        workSheetRepository.save(workSheet);

        return workSheet;
    }

    public WorkSheet importGeoJsonWorkSheet(String tokenId, GeoJsonImportDTO dto) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        
        // Validate that user has SMBO role
        if (currentUser.getRole() != UserRole.SMBO) {
            throw new BadRequestException("Apenas usuários com role SMBO podem importar folhas de obra");
        }

        // Validate GeoJSON structure
        if (dto.type() == null || !"FeatureCollection".equals(dto.type())) {
            throw new BadRequestException("Tipo do GeoJSON deve ser FeatureCollection");
        }

        if (dto.metadata() == null || dto.metadata().id() == null) {
            throw new BadRequestException("Metadata com ID é obrigatório");
        }

        // Check if worksheet with same ID already exists
        String workSheetId = "FOLHA_" + dto.metadata().id();
        if (workSheetRepository.exists(workSheetId)) {
            throw new BadRequestException("Folha com mesmo ID já existente");
        }

        WorkSheet workSheet = WorkSheetMapper.toEntity(dto);
        
        // For import operation, we use CREATE action
        worksheetAuthorizationChain.handle(currentUser, workSheet, WorksheetAction.CREATE);

        workSheetRepository.save(workSheet);

        return workSheet;
    }
} 