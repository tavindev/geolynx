package tavindev.infra.dto.changeProfile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ChangeProfileDTO(
		@NotBlank(message = "Identificador é obrigatório") String identificador,
		@NotNull(message = "Novo perfil é obrigatório") String novo_perfil) {
}