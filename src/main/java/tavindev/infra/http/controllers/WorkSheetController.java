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
import tavindev.infra.dto.worksheet.GeoJsonImportDTO;
import tavindev.infra.dto.worksheet.GeoJsonImportResponseDTO;

@Service
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class WorkSheetController {
    @Inject
    private WorkSheetService workSheetService;

    @POST
    @Path("/work-sheet/create")
    @Consumes(MediaType.APPLICATION_JSON)
    public CreateOrUpdateWorkSheetResponseDTO createOrUpdateWorkSheet(
            @HeaderParam("Authorization") String authHeader,
            @Valid CreateOrUpdateWorkSheetDTO dto) {
        String token = extractBearerToken(authHeader);

        workSheetService.createOrUpdateWorkSheet(token, dto);

        return new CreateOrUpdateWorkSheetResponseDTO("Folha de obra criada/modificada com sucesso.");
    }

    @POST
    @Path("/folhas-obra/importar")
    @Consumes(MediaType.APPLICATION_JSON)
    public GeoJsonImportResponseDTO importGeoJsonWorkSheet(
            @HeaderParam("Authorization") String authHeader,
            @Valid GeoJsonImportDTO dto) {
        String token = extractBearerToken(authHeader);

        WorkSheet workSheet = workSheetService.importGeoJsonWorkSheet(token, dto);

        return new GeoJsonImportResponseDTO(
            "Folha de obra importada com sucesso", 
            workSheet.getId()
        );
    }

    private String extractBearerToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring("Bearer ".length()).trim();
        }
        throw new WebApplicationException("Authorization header is missing or invalid", Response.Status.UNAUTHORIZED);
    }
} 