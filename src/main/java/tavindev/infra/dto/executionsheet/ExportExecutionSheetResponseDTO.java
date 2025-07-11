package tavindev.infra.dto.executionsheet;

import tavindev.core.entities.ExecutionSheet;

public record ExportExecutionSheetResponseDTO(
		String message,
		ExecutionSheet executionSheet) {
}