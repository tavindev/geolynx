package tavindev.infra.http.controllers;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.services.AuthService;
import tavindev.core.services.UserService;
import tavindev.infra.dto.*;

@Service
@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
public class AuthController {
    @Inject
    private AuthService authService;

    @Inject
    private UserService userService;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registerUser(@Valid @NotNull RegisterUserDTO user) {
        userService.registerUser(user);

        return Response.status(Status.CREATED).build();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response login(@Valid LoginRequestDTO request) {
        try {
            LoginResponseDTO response = authService.login(request);
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Credenciais inválidas\"}")
                    .build();
        }
    }

    @POST
    @Path("/logout")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response logout(@Valid LogoutRequestDTO request) {
        try {
            LogoutResponseDTO response = authService.logout(request);
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Sessão inválida ou já encerrada.\"}")
                    .build();
        }
    }
} 