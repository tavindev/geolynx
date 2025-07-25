package tavindev.infra.http.controllers;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.Corporation;
import tavindev.core.entities.User;
import tavindev.core.services.AuthService;
import tavindev.core.services.CorporationService;

import java.util.List;

@Service
@Path("/corporation")
@Produces(MediaType.APPLICATION_JSON)
public class CorporationController {
    @Inject
    private CorporationService corporationService;

    @GET
    @Path("/{corporationId}")
    public Response getCorporationById(
            @CookieParam("session") String sessionToken,
            @PathParam("corporationId") String userId) {
        Corporation corporation = corporationService.getCorporationById(sessionToken, userId);

        return Response.ok(corporation).build();
    }

    @GET
    @Path("/all")
    public Response listCorporations(@CookieParam("session") String sessionToken) {
        List<Corporation> corporations = corporationService.listCorporations(sessionToken);

        return Response.ok(corporations).build();
    }

}
