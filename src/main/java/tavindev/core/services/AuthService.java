package tavindev.core.services;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.UserRepository;
import tavindev.core.entities.User;
import tavindev.infra.dto.LoginRequestDTO;
import tavindev.infra.dto.LoginResponseDTO;
import tavindev.infra.dto.LogoutRequestDTO;
import tavindev.infra.dto.LogoutResponseDTO;

import java.time.Instant;
import java.util.UUID;

public class AuthService {
    private static final int SESSION_DURATION_HOURS = 2;

    @Inject
    private UserRepository userRepository;

    public LoginResponseDTO login(@Valid LoginRequestDTO request) {
        // Try to find user by email or username
        User user = userRepository.findByIdentifier(request.identificador());

        if (user == null || !user.personalInfo().password().equals(request.password())) {
            // TODO: Domain Error
            throw new RuntimeException("Invalid credentials");
        }

        Instant now = Instant.now();
        Instant validTo = now.plusSeconds(SESSION_DURATION_HOURS * 3600);

        return new LoginResponseDTO(
            new LoginResponseDTO.TokenDTO(
                user.personalInfo().email(),
                user.role().name(),
                new LoginResponseDTO.ValidityDTO(
                    now,
                    validTo,
                    UUID.randomUUID().toString()
                )
            )
        );
    }

    public LogoutResponseDTO logout(@Valid LogoutRequestDTO request) {
        // TODO: Implement token invalidation logic
        // For now, we'll just return a success message
        return new LogoutResponseDTO("Logout realizado com sucesso. A sessão foi encerrada.");
    }
} 