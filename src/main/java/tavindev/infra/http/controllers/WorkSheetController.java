package tavindev.infra.http.controllers;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.WorkSheet;
import tavindev.core.services.WorkSheetService;
import tavindev.infra.dto.worksheet.CreateOrUpdateWorkSheetDTO;
import tavindev.infra.dto.worksheet.CreateOrUpdateWorkSheetResponseDTO;

@Service
@Path("/work-sheet")
@Produces(MediaType.APPLICATION_JSON)
public class WorkSheetController {
    @Inject
    private WorkSheetService workSheetService;

    @POST
    @Path("/import")
    @Consumes(MediaType.APPLICATION_JSON)
    public CreateOrUpdateWorkSheetResponseDTO createOrUpdateWorkSheet(
            @CookieParam("session") String token,
            @Valid CreateOrUpdateWorkSheetDTO dto) {
        workSheetService.createOrUpdateWorkSheet(token, dto);

        return new CreateOrUpdateWorkSheetResponseDTO("Folha de obra criada/modificada com sucesso.");
    }
}