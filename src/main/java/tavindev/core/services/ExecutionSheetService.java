package tavindev.core.services;

import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import tavindev.core.entities.ExecutionSheet;
import tavindev.core.entities.User;
import tavindev.core.entities.Permission;
import tavindev.core.authorization.PermissionAuthorizationHandler;
import tavindev.core.utils.AuthUtils;
import tavindev.infra.repositories.ExecutionSheetRepository;

public class ExecutionSheetService {
	@Inject
	private ExecutionSheetRepository executionSheetRepository;

	@Inject
	private AuthUtils authUtils;

	public void createExecutionSheet(String tokenId, ExecutionSheet executionSheet) {
		User currentUser = authUtils.validateAndGetUser(tokenId);
		PermissionAuthorizationHandler.checkPermission(currentUser, Permission.IMP_FO);

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
}