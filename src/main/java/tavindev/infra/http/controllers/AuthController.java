package tavindev.infra.http.controllers;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.AuthToken;
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
    public RegisterUserDTO registerUser(@Valid @NotNull RegisterUserDTO user) {
        userService.registerUser(user);

        return user;
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    public LoginResponseDTO login(@Valid LoginDTO request) {
        AuthToken token = authService.login(request);

        return LoginResponseDTO.fromAuthToken(token);
    }

    @POST
    @Path("/logout")
    @Consumes(MediaType.APPLICATION_JSON)
    public LogoutResponseDTO logout(@Valid LogoutRequestDTO request) {
        authService.logout(request);

        return new LogoutResponseDTO("Logout realizado com sucesso. A sessão foi encerrada.");
    }
}