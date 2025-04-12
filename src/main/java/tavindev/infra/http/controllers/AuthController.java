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
import tavindev.core.entities.AuthToken;
import tavindev.core.entities.User;
import tavindev.core.services.AuthService;
import tavindev.infra.dto.*;
import tavindev.infra.dto.login.LoginDTO;
import tavindev.infra.dto.login.LoginResponseDTO;
import tavindev.infra.dto.logout.LogoutRequestDTO;
import tavindev.infra.dto.logout.LogoutResponseDTO;

@Service
@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
public class AuthController {
    @Inject
    private AuthService authService;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public UserDTO registerUser(@Valid @NotNull RegisterUserDTO data) {
        User user = authService.registerUser(data);

        return UserMapper.toDTO(user);
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