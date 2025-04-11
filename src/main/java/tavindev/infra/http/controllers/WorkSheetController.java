package tavindev.infra.http.controllers;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.WorkSheet;
import tavindev.core.services.WorkSheetService;
import tavindev.infra.dto.CreateOrUpdateWorkSheetResponseDTO;

@Service
@Path("/work-sheet")
@Produces(MediaType.APPLICATION_JSON)
public class WorkSheetController {
    @Inject
    private WorkSheetService workSheetService;

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createOrUpdateWorkSheet(
            @HeaderParam("Authorization") String authHeader,
            @Valid WorkSheet workSheet) {
        String token = extractBearerToken(authHeader);
        WorkSheet savedWorkSheet = workSheetService.createOrUpdateWorkSheet(token, workSheet);

        return Response.ok()
                .entity(CreateOrUpdateWorkSheetResponseDTO.fromWorkSheet(savedWorkSheet.getId()))
                .build();
    }

    private String extractBearerToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring("Bearer ".length()).trim();
        }
        throw new WebApplicationException("Authorization header is missing or invalid", Response.Status.UNAUTHORIZED);
    }
} 