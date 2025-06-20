package tavindev.infra.dto.accountStatus;

import jakarta.validation.constraints.NotBlank;

public record AccountStatusDTO(
		@NotBlank(message = "Identificador é obrigatório") String identificador) {
}