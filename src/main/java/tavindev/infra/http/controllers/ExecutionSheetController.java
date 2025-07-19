package tavindev.infra.http.controllers;

import java.util.List;
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
import tavindev.infra.dto.executionsheet.ViewStatusGlobalDTO;
import tavindev.infra.dto.executionsheet.ViewStatusGlobalResponseDTO;
import tavindev.infra.dto.executionsheet.EditOperationDTO;
import tavindev.infra.dto.executionsheet.EditOperationResponseDTO;
import tavindev.infra.dto.executionsheet.ExportExecutionSheetDTO;
import tavindev.infra.dto.executionsheet.ExportExecutionSheetResponseDTO;
import tavindev.infra.dto.executionsheet.GetExecutionSheetsForOperatorResponseDTO;

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

	@POST
	@Path("/view-status-global")
	@Consumes(MediaType.APPLICATION_JSON)
	public ViewStatusGlobalResponseDTO viewStatusGlobal(
			@CookieParam("session") String token,
			ViewStatusGlobalDTO dto) {
		ExecutionSheet.GlobalOperationStatus globalStatus = executionSheetService.viewGlobalStatus(
				token, dto.executionSheetId(), dto.operationId());

		// Convert to response DTO
		List<ViewStatusGlobalResponseDTO.PolygonStatus> polygonStatuses = globalStatus.getOperationInfos().stream()
				.map(info -> new ViewStatusGlobalResponseDTO.PolygonStatus(
						info.getPolygonId(),
						info.getOperationDetail().getStatus(),
						info.getOperationDetail().getStartingDate(),
						info.getOperationDetail().getFinishingDate(),
						info.getOperationDetail().getLastActivityDate(),
						info.getOperationDetail().getObservations(),
						info.getOperationDetail().getOperatorId()))
				.toList();

		return new ViewStatusGlobalResponseDTO(
				"Estado global da operação obtido com sucesso.",
				globalStatus.getOperationCode(),
				globalStatus.getGlobalStatus(),
				polygonStatuses);
	}

	@POST
	@Path("/edit-operation")
	@Consumes(MediaType.APPLICATION_JSON)
	public EditOperationResponseDTO editOperation(
			@CookieParam("session") String token,
			EditOperationDTO dto) {
		executionSheetService.editOperation(token, dto.executionSheetId(), dto.operationId(),
				dto.plannedCompletionDate(), dto.estimatedDurationHours(), dto.observations());

		return new EditOperationResponseDTO("Dados da operação editados com sucesso.");
	}

	@POST
	@Path("/export")
	@Consumes(MediaType.APPLICATION_JSON)
	public ExportExecutionSheetResponseDTO exportExecutionSheet(
			@CookieParam("session") String token,
			ExportExecutionSheetDTO dto) {
		ExecutionSheet executionSheet = executionSheetService.exportExecutionSheet(token, dto.executionSheetId());

		return new ExportExecutionSheetResponseDTO("Folha de execução exportada com sucesso.", executionSheet);
	}

	@GET
	@Path("/{id}")
	public ExecutionSheet getExecutionSheet(
			@CookieParam("session") String token,
			@PathParam("id") Long id) {
		return executionSheetService.getExecutionSheet(token, id);
	}

	@GET
	@Path("/my-assignments")
	public GetExecutionSheetsForOperatorResponseDTO getExecutionSheetsForOperator(
			@CookieParam("session") String token) {
		List<ExecutionSheet> executionSheets = executionSheetService.getExecutionSheetsForOperator(token);

		return new GetExecutionSheetsForOperatorResponseDTO(
				"Folhas de execução obtidas com sucesso.",
				executionSheets);
	}
}