package tavindev.infra.http.controllers;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.WorkSheet;
import tavindev.core.services.WorkSheetService;
import tavindev.infra.dto.worksheet.CreateOrUpdateWorkSheetResponseDTO;
import tavindev.infra.dto.worksheet.WorkSheetListResponseDTO;
import java.util.List;

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
            WorkSheet dto) {
        workSheetService.createOrUpdateWorkSheet(token, dto);

        return new CreateOrUpdateWorkSheetResponseDTO("Folha de obra criada/modificada com sucesso.");
    }

    @DELETE
    @Path("/{id}")
    public Response deleteWorkSheet(
            @CookieParam("session") String token,
            @PathParam("id") Long id) {
        workSheetService.removeWorkSheet(token, id);

        return Response.ok()
                .entity(new CreateOrUpdateWorkSheetResponseDTO("Folha de obra removida com sucesso."))
                .build();
    }

    @GET
    @Path("/")
    public List<WorkSheetListResponseDTO> getAllWorkSheets(
            @CookieParam("session") String token) {
        return workSheetService.getAllWorkSheets(token);
    }

    @GET
    @Path("/{id}")
    public WorkSheet getWorkSheet(
            @CookieParam("session") String token,
            @PathParam("id") Long id) {
        return workSheetService.getWorkSheet(token, id);
    }
}