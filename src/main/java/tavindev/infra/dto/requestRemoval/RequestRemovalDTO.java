package tavindev.infra.dto.requestRemoval;

import jakarta.validation.constraints.NotBlank;

public record RequestRemovalDTO(
		@NotBlank(message = "Identificador é obrigatório") String identificador) {
}