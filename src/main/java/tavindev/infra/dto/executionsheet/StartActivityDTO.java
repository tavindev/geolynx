package tavindev.infra.dto.executionsheet;

import jakarta.validation.constraints.NotNull;

public record StartActivityDTO(
		@NotNull(message = "O ID da folha de execução não pode ser nulo") Long executionSheetId,

		@NotNull(message = "O ID da parcela não pode ser nulo") Long polygonId,

		@NotNull(message = "O ID da operação não pode ser nulo") Long operationId) {
}