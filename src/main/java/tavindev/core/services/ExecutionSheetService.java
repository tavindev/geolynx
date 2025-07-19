package tavindev.core.services;

import java.lang.management.OperatingSystemMXBean;
import java.util.List;

import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import tavindev.core.entities.ExecutionSheet;
import tavindev.core.entities.User;
import tavindev.core.entities.Permission;
import tavindev.core.entities.UserRole;
import tavindev.core.authorization.PermissionAuthorizationHandler;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.repositories.ExecutionSheetRepository;
import tavindev.infra.repositories.WorkSheetRepository;
import tavindev.infra.repositories.DatastoreUserRepository;
import tavindev.core.exceptions.UnauthorizedException;
import tavindev.core.exceptions.BadRequestException;
import tavindev.core.exceptions.UserNotFoundException;
import tavindev.core.exceptions.ExecutionSheetNotFoundException;
import tavindev.core.entities.WorkSheet;

public class ExecutionSheetService {
    @Inject
    private ExecutionSheetRepository executionSheetRepository;

    @Inject
    private WorkSheetRepository workSheetRepository;

    @Inject
    private AuthUtils authUtils;

    @Inject
    private DatastoreUserRepository userRepository;

    @Inject
    private NotificationService notificationService;

    public void createExecutionSheet(String tokenId, ExecutionSheet executionSheet) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.CREATE_FE);

        // Check if the associated work sheet exists
        boolean workSheetExists = workSheetRepository.exists(executionSheet.getWorkSheetId());

        if (!workSheetExists)
            throw new BadRequestException("Folha de obra não encontrada");

        executionSheetRepository.save(executionSheet);
    }

    public ExecutionSheet getExecutionSheet(String tokenId, Long id) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_DET_FO);

        ExecutionSheet executionSheet = executionSheetRepository.get(id);

        if (executionSheet == null)
            throw new ExecutionSheetNotFoundException("Folha de execução não encontrada");

        return executionSheet;
    }

    /**
     * Assigns an operation in a polygon to an operator
     */
    public void assignOperation(String tokenId, Long executionSheetId, Long polygonId, Long operationId,
            String operatorId) {
        // Validate user permissions
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.ASSIGN_OP_FE);

        User operator = userRepository.findById(operatorId.toString());

        if (operator == null) {
            throw new BadRequestException("Operador não encontrado");
        }

        if (operator.getRole() != UserRole.PO) {
            throw new BadRequestException("Apenas operadores (PO) podem ser atribuídos a operações");
        }

        // Get execution sheet
        ExecutionSheet executionSheet = executionSheetRepository.get(executionSheetId);
        if (executionSheet == null) {
            throw new NotFoundException("Folha de execução não encontrada");
        }

        // Delegate to domain logic
        executionSheet.assignOperationToOperator(polygonId, operationId, operatorId);

        // Persist changes
        executionSheetRepository.save(executionSheet);
    }

    /**
     * Starts an activity for an operation in a polygon
     */
    public void startActivity(String tokenId, Long executionSheetId, Long polygonId, Long operationId) {
        // Validate user permissions
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.START_ACT_OP_FE);

        // Get execution sheet
        ExecutionSheet executionSheet = executionSheetRepository.get(executionSheetId);
        if (executionSheet == null) {
            throw new IllegalArgumentException("Folha de execução não encontrada");
        }

        // Delegate to domain logic
        executionSheet.startActivity(polygonId, operationId, currentUser.getId());

        // Persist changes
        executionSheetRepository.save(executionSheet);
    }

    /**
     * Stops an activity for an operation in a polygon
     */
    public void stopActivity(String tokenId, Long executionSheetId, Long polygonId, Long operationId) {
        // Validate user permissions
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.STOP_ACT_OP_FE);

        // Get execution sheet
        ExecutionSheet executionSheet = executionSheetRepository.get(executionSheetId);
        if (executionSheet == null) {
            throw new IllegalArgumentException("Folha de execução não encontrada");
        }

        // Delegate to domain logic
        executionSheet.stopActivity(polygonId, operationId, currentUser.getId());

        // Persist changes
        executionSheetRepository.save(executionSheet);
    }

    /**
     * Views the state of an operation in a given parcel
     */
    public ExecutionSheet.PolygonOperationDetail viewActivity(String tokenId, Long executionSheetId, Long polygonId,
            Long operationId) {
        // Validate user permissions
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_ACT_OP_FE);

        // Get execution sheet
        ExecutionSheet executionSheet = executionSheetRepository.get(executionSheetId);
        if (executionSheet == null) {
            throw new IllegalArgumentException("Folha de execução não encontrada");
        }

        // Find the operation detail
        ExecutionSheet.PolygonOperationDetail operationDetail = executionSheet.findOperationDetail(polygonId,
                operationId);
        if (operationDetail == null) {
            throw new IllegalArgumentException("Operação não encontrada na parcela especificada");
        }

        return operationDetail;
    }

    /**
     * Views the global status of an operation across all polygons
     */
    public ExecutionSheet.GlobalOperationStatus viewGlobalStatus(String tokenId, Long executionSheetId,
            Long operationId) {
        // Validate user permissions
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_STATUS_OP_GLOBAL_FE);

        // Get execution sheet
        ExecutionSheet executionSheet = executionSheetRepository.get(executionSheetId);

        if (executionSheet == null) {
            throw new IllegalArgumentException("Folha de execução não encontrada");
        }

        // Get global operation status
        return executionSheet.getGlobalOperationStatus(operationId);
    }

    /**
     * Edits operation data (planned completion date, estimated duration,
     * observations)
     */
    public void editOperation(String tokenId, Long executionSheetId, Long operationId, String plannedCompletionDate,
            Integer estimatedDurationHours, String observations) {
        // Validate user permissions
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.EDIT_OP_FE);

        // Get execution sheet
        ExecutionSheet executionSheet = executionSheetRepository.get(executionSheetId);
        if (executionSheet == null) {
            throw new IllegalArgumentException("Folha de execução não encontrada");
        }

        // Delegate to domain logic
        executionSheet.editOperation(operationId, plannedCompletionDate, estimatedDurationHours, observations);

        // Persist changes
        executionSheetRepository.save(executionSheet);
    }

    /**
     * Exports execution sheet data for integration with LAND IT
     */
    public ExecutionSheet exportExecutionSheet(String tokenId, Long executionSheetId) {
        // Validate user permissions
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.EXPORT_FE);

        // Get execution sheet
        ExecutionSheet executionSheet = executionSheetRepository.get(executionSheetId);
        if (executionSheet == null) {
            throw new IllegalArgumentException("Folha de execução não encontrada");
        }

        // Prepare the execution sheet for export in the format expected by LAND IT
        return executionSheet.prepareForExport();
    }

    /**
     * Gets all execution sheets where the current user (operator) is assigned
     */
    public List<ExecutionSheet> getExecutionSheetsForOperator(String tokenId) {
        // Validate user permissions
        User currentUser = authUtils.validateAndGetUser(tokenId);
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.BE_ASSIGNED);

        // Get execution sheets where this operator is assigned
        return executionSheetRepository.findByOperatorId(currentUser.getId());
    }
}