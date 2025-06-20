package tavindev.infra.dto.deactivateAccount;

import jakarta.validation.constraints.NotBlank;

public record DeactivateAccountDTO(
		@NotBlank(message = "Identificador é obrigatório") String identificador) {
}