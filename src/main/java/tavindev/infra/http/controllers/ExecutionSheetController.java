package tavindev.infra.http.controllers;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.ExecutionSheet;
import tavindev.core.services.ExecutionSheetService;
import tavindev.infra.dto.executionsheet.CreateExecutionSheetResponseDTO;

@Service
@Path("/execution-sheet")
@Produces(MediaType.APPLICATION_JSON)
public class ExecutionSheetController {
	@Inject
	private ExecutionSheetService executionSheetService;

	@POST
	@Path("/import")
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