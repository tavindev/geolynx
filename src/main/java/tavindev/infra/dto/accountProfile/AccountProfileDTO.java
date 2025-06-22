package tavindev.infra.dto.accountProfile;

import jakarta.validation.constraints.NotBlank;

public record AccountProfileDTO(
        @NotBlank(message = "Identificador é obrigatório") String identificador) {
}
