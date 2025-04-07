package tavindev.infra.http.controllers;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.services.UserService;
import tavindev.infra.dto.*;

@Service
@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
public class UserController {
    @Inject
    private UserService userService;

    @GET
    public HelloResponseDTO hello() {
        return new HelloResponseDTO("hello");
    }
}
