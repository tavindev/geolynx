package tavindev.infra.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
    @NotBlank String identificador,
    @NotBlank String password
) {} 