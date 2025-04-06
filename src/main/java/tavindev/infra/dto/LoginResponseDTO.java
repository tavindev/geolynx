package tavindev.infra.dto;

import java.time.Instant;

public record LoginResponseDTO(
    TokenDTO token
) {
    public record TokenDTO(
        String user,
        String role,
        ValidityDTO validity
    ) {}

    public record ValidityDTO(
        Instant valid_from,
        Instant valid_to,
        String verificador
    ) {}
} 