package tavindev.infra.dto;

import jakarta.validation.constraints.NotBlank;

public record LogoutRequestDTO(
    @NotBlank String token
) {} 