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
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    public CreateOrUpdateWorkSheetResponseDTO createOrUpdateWorkSheet(
            @HeaderParam("Authorization") String authHeader,
            @Valid CreateOrUpdateWorkSheetDTO dto) {
        String token = extractBearerToken(authHeader);

        workSheetService.createOrUpdateWorkSheet(token, dto);

        return new CreateOrUpdateWorkSheetResponseDTO("Folha de obra criada/modificada com sucesso.");
    }

    private String extractBearerToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring("Bearer ".length()).trim();
        }
        throw new WebApplicationException("Authorization header is missing or invalid", Response.Status.UNAUTHORIZED);
    }
} 