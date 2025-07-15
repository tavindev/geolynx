package tavindev.infra.http.controllers;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.AuthToken;
import tavindev.core.entities.User;
import tavindev.core.services.AuthService;
import tavindev.infra.JWTConfig;
import tavindev.infra.JWTToken;
import tavindev.infra.dto.*;
import tavindev.infra.dto.login.LoginDTO;
import tavindev.infra.dto.login.LoginResponseDTO;
import tavindev.infra.dto.logout.LogoutRequestDTO;
import tavindev.infra.dto.logout.LogoutResponseDTO;

import java.util.HashMap;
import java.util.Map;

@Service
@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
public class AuthController {
    @Inject
    private AuthService authService;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registerUser(User user) {
        authService.registerUser(user);

        return Response.ok().build();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response login(@Valid LoginDTO request) {
        AuthToken token = authService.login(request);

        Map<String, Object> fields = new HashMap<>();

        fields.put("id", token.getTokenId());
        fields.put("role", token.getUserRole());

        String jwt = JWTToken.createJWT(token.getUsername(), fields);

        // Create and return a secure HTTP-only cookie with the JWT token
        NewCookie cookie = new NewCookie.Builder("session")
                .value(jwt) // JWT token
                .path("/")
                .comment("JWT session token")
                .maxAge((int) (JWTConfig.EXPIRATION_TIME / 1000))
                .secure(false) // (set to false if not using HTTPS, but **not recommended** for production)
                .httpOnly(true)
                .build();

        return Response.noContent().cookie(cookie).build();
    }

    @POST
    @Path("/logout")
    @Consumes(MediaType.APPLICATION_JSON)
    public LogoutResponseDTO logout(@Valid LogoutRequestDTO request) {
        authService.logout(request);

        return new LogoutResponseDTO("Logout realizado com sucesso. A sessão foi encerrada.");
    }
}