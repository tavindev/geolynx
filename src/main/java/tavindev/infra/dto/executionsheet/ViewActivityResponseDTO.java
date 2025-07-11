package tavindev.infra.dto.executionsheet;

import tavindev.core.entities.ExecutionSheet;

public record ViewActivityResponseDTO(
		String message,
		ExecutionSheet.PolygonOperationDetail operationDetail) {
}