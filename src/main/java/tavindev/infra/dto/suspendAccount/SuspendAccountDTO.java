package tavindev.infra.dto.suspendAccount;

import jakarta.validation.constraints.NotBlank;

public record SuspendAccountDTO(
		@NotBlank(message = "Identificador é obrigatório") String identificador) {
}