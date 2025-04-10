package tavindev.infra.dto.login;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
    @NotBlank String identificador,
    @NotBlank String password
) {} 