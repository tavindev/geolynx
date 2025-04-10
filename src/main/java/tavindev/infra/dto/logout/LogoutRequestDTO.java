package tavindev.infra.dto.logout;

import jakarta.validation.constraints.NotBlank;

public record LogoutRequestDTO(
    @NotBlank String token
) {} 