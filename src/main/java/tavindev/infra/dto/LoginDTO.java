package tavindev.infra.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
    @NotBlank String identificador,
    @NotBlank String password
) {} 