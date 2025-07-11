package tavindev.core.services;

import java.lang.management.OperatingSystemMXBean;

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

	/**
	 * Assigns an operation in a polygon to an operator
	 */
	public void assignOperation(String tokenId, Long executionSheetId, Long polygonId, Long operationId,
			Long operatorId) {
		// Validate user permissions
		User currentUser = authUtils.validateAndGetUser(tokenId);
		PermissionAuthorizationHandler.checkPermission(currentUser, Permission.ASSIGN_OP_FE);

		User operator = userRepository.findById(operatorId.toString());

		if (operator == null) {
			throw new IllegalArgumentException("Operador não encontrado");
		}

		if (operator.getRole() != UserRole.PO) {
			throw new IllegalArgumentException("Apenas operadores (PO) podem ser atribuídos a operações");
		}

		// Get execution sheet
		ExecutionSheet executionSheet = executionSheetRepository.get(executionSheetId);
		if (executionSheet == null) {
			throw new IllegalArgumentException("Folha de execução não encontrada");
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
		ExecutionSheet.PolygonOperationDetail operationDetail = executionSheet.findOperationDetail(polygonId, operationId);
		if (operationDetail == null) {
			throw new IllegalArgumentException("Operação não encontrada na parcela especificada");
		}

		return operationDetail;
	}
}