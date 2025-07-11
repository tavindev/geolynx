package tavindev.infra.dto.executionsheet;

public record EditOperationDTO(
		Long executionSheetId,
		Long operationId,
		String plannedCompletionDate,
		Integer estimatedDurationHours,
		String observations) {
}