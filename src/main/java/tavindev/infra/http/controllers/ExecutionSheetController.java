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
import tavindev.infra.dto.executionsheet.StartActivityDTO;
import tavindev.infra.dto.executionsheet.StartActivityResponseDTO;
import tavindev.infra.dto.executionsheet.StopActivityDTO;
import tavindev.infra.dto.executionsheet.StopActivityResponseDTO;
import tavindev.infra.dto.executionsheet.ViewActivityDTO;
import tavindev.infra.dto.executionsheet.ViewActivityResponseDTO;

@Service
@Path("/execution-sheet")
@Produces(MediaType.APPLICATION_JSON)
public class ExecutionSheetController {
	@Inject
	private ExecutionSheetService executionSheetService;

	@POST
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	public CreateExecutionSheetResponseDTO createExecutionSheet(
			@CookieParam("session") String token,
			ExecutionSheet dto) {
		executionSheetService.createExecutionSheet(token, dto);

		return new CreateExecutionSheetResponseDTO("Folha de execução criada com sucesso.");
	}

	@POST
	@Path("/assign-operation")
	@Consumes(MediaType.APPLICATION_JSON)
	public AssignOperationResponseDTO assignOperation(
			@CookieParam("session") String token,
			AssignOperationDTO dto) {
		executionSheetService.assignOperation(token, dto.executionSheetId(), dto.polygonId(), dto.operationId(),
				dto.operatorId());

		return new AssignOperationResponseDTO("Operação atribuída com sucesso ao operador.");
	}

	@POST
	@Path("/start-activity")
	@Consumes(MediaType.APPLICATION_JSON)
	public StartActivityResponseDTO startActivity(
			@CookieParam("session") String token,
			StartActivityDTO dto) {
		executionSheetService.startActivity(token, dto.executionSheetId(), dto.polygonId(), dto.operationId());

		return new StartActivityResponseDTO("Atividade iniciada com sucesso.");
	}

	@POST
	@Path("/stop-activity")
	@Consumes(MediaType.APPLICATION_JSON)
	public StopActivityResponseDTO stopActivity(
			@CookieParam("session") String token,
			StopActivityDTO dto) {
		executionSheetService.stopActivity(token, dto.executionSheetId(), dto.polygonId(), dto.operationId());

		return new StopActivityResponseDTO("Atividade terminada com sucesso.");
	}

	@POST
	@Path("/view-activity")
	@Consumes(MediaType.APPLICATION_JSON)
	public ViewActivityResponseDTO viewActivity(
			@CookieParam("session") String token,
			ViewActivityDTO dto) {
		ExecutionSheet.PolygonOperationDetail operationDetail = executionSheetService.viewActivity(
				token, dto.executionSheetId(), dto.polygonId(), dto.operationId());

		return new ViewActivityResponseDTO("Estado da operação obtido com sucesso.", operationDetail);
	}

	@GET
	@Path("/{id}")
	public ExecutionSheet getExecutionSheet(
			@CookieParam("session") String token,
			@PathParam("id") Long id) {
		return executionSheetService.getExecutionSheet(token, id);
	}

}