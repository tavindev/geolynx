package tavindev.infra.dto.activateAccount;

import jakarta.validation.constraints.NotBlank;

public record ActivateAccountDTO(
		@NotBlank(message = "Identificador é obrigatório") String identificador) {
}