package tavindev.infra.http.controllers;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.ExecutionSheet;
import tavindev.core.services.ExecutionSheetService;
import tavindev.infra.dto.executionsheet.CreateExecutionSheetResponseDTO;
import tavindev.infra.dto.executionsheet.AssignOperationDTO;
import tavindev.infra.dto.executionsheet.AssignOperationResponseDTO;

@Service
@Path("/execution-sheet")
@Produces(MediaType.APPLICATION_JSON)
public class ExecutionSheetController {
	@Inject
	private ExecutionSheetService executionSheetService;


	@POST
	@Path("/assign")
	@Consumes(MediaType.APPLICATION_JSON)
	public AssignOperationResponseDTO assignOperation(
			@CookieParam("session") String token,
			AssignOperationDTO dto) {
		executionSheetService.assignOperation(token, dto.executionSheetId(), dto.polygonId(), dto.operationId(),
				dto.operatorId());

		return new AssignOperationResponseDTO("Operação atribuída com sucesso ao operador.");
	}

	@POST
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	public CreateExecutionSheetResponseDTO createExecutionSheet(
			@CookieParam("session") String token,
			ExecutionSheet dto) {
		executionSheetService.createExecutionSheet(token, dto);

		return new CreateExecutionSheetResponseDTO("Folha de execução criada com sucesso.");
	}

	@GET
	@Path("/{id}")
	public ExecutionSheet getExecutionSheet(
			@CookieParam("session") String token,
			@PathParam("id") Long id) {
		return executionSheetService.getExecutionSheet(token, id);
	}



}