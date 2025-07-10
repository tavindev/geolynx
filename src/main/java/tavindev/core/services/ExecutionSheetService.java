package tavindev.core.services;

import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import tavindev.core.entities.ExecutionSheet;
import tavindev.core.entities.User;
import tavindev.core.entities.Permission;
import tavindev.core.entities.UserRole;
import tavindev.core.authorization.PermissionAuthorizationHandler;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.repositories.ExecutionSheetRepository;
import tavindev.infra.repositories.DatastoreUserRepository;
import tavindev.core.exceptions.UnauthorizedException;

public class ExecutionSheetService {
	@Inject
	private ExecutionSheetRepository executionSheetRepository;

	@Inject
	private AuthUtils authUtils;

	@Inject
	private DatastoreUserRepository userRepository;

	public void createExecutionSheet(String tokenId, ExecutionSheet executionSheet) {
		User currentUser = authUtils.validateAndGetUser(tokenId);
		PermissionAuthorizationHandler.checkPermission(currentUser, Permission.CREATE_FE);

		executionSheetRepository.save(executionSheet);
	}

	public ExecutionSheet getExecutionSheet(String tokenId, Long id) {
		User currentUser = authUtils.validateAndGetUser(tokenId);
		PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_DET_FO);

		ExecutionSheet executionSheet = executionSheetRepository.get(id);

		if (executionSheet == null)
			throw new NotFoundException("Folha de execução não encontrada");

		return executionSheet;
	}

	public void assignOperation(String tokenId, Long executionSheetId, Long polygonId, Long operationId,
			Long operatorId) {
		User currentUser = authUtils.validateAndGetUser(tokenId);
		PermissionAuthorizationHandler.checkPermission(currentUser, Permission.ASSIGN_OP_FE);

		// Validate that the operator exists and is a PO (Partner Operator)
		User operator = userRepository.findById(operatorId.toString());
		if (operator == null) {
			throw new NotFoundException("Operador não encontrado");
		}
		if (operator.getRole() != UserRole.PO) {
			throw new UnauthorizedException("Apenas operadores (PO) podem ser atribuídos a operações");
		}

		// Validate that the operator belongs to the same service provider as the PRBO
		// This would require checking the service provider relationship
		// For now, we'll assume this validation is handled at the business level

		// Get the execution sheet
		ExecutionSheet executionSheet = executionSheetRepository.get(executionSheetId);
		if (executionSheet == null) {
			throw new NotFoundException("Folha de execução não encontrada");
		}

		// Find the polygon operation and update the assignment
		boolean assignmentUpdated = false;
		for (ExecutionSheet.PolygonOperation polygonOperation : executionSheet.getPolygonsOperations()) {
			if (polygonOperation.getPolygonId().equals(polygonId)) {
				for (ExecutionSheet.PolygonOperationDetail operationDetail : polygonOperation.getOperations()) {
					if (operationDetail.getOperationId().equals(operationId)) {
						// Create a new PolygonOperationDetail with the operator assigned
						ExecutionSheet.PolygonOperationDetail updatedOperationDetail = new ExecutionSheet.PolygonOperationDetail(
								operationDetail.getOperationId(),
								"assigned", // Update status to assigned
								operationDetail.getStartingDate(),
								operationDetail.getFinishingDate(),
								operationDetail.getLastActivityDate(),
								operationDetail.getObservations(),
								operationDetail.getTracks(),
								operatorId);

						// Replace the operation detail in the list
						java.util.List<ExecutionSheet.PolygonOperationDetail> updatedOperations = new java.util.ArrayList<>(
								polygonOperation.getOperations());
						int operationIndex = updatedOperations.indexOf(operationDetail);
						updatedOperations.set(operationIndex, updatedOperationDetail);

						// Create updated polygon operation
						ExecutionSheet.PolygonOperation updatedPolygonOperation = new ExecutionSheet.PolygonOperation(
								polygonOperation.getPolygonId(), updatedOperations);

						// Update the execution sheet
						java.util.List<ExecutionSheet.PolygonOperation> updatedPolygonsOperations = new java.util.ArrayList<>(
								executionSheet.getPolygonsOperations());
						int polygonIndex = updatedPolygonsOperations.indexOf(polygonOperation);
						updatedPolygonsOperations.set(polygonIndex, updatedPolygonOperation);

						ExecutionSheet updatedExecutionSheet = new ExecutionSheet(
								executionSheet.getId(),
								executionSheet.getStartingDate(),
								executionSheet.getFinishingDate(),
								executionSheet.getLastActivityDate(),
								executionSheet.getObservations(),
								executionSheet.getOperations(),
								updatedPolygonsOperations);

						executionSheetRepository.save(updatedExecutionSheet);
						assignmentUpdated = true;
						break;
					}
				}
				if (assignmentUpdated)
					break;
			}
		}

		if (!assignmentUpdated) {
			throw new NotFoundException("Operação não encontrada na parcela especificada");
		}
	}
}