package tavindev.infra.dto.worksheet;

import java.util.List;

public record WorkSheetListResponseDTO(
		Long id,
		List<String> aigp,
		String startingDate,
		String finishingDate,
		String issueDate,
		String awardDate,
		Long serviceProviderId,
		List<OperationDTO> operations) {
	public record OperationDTO(
			String operationCode,
			String operationDescription,
			double areaHa) {
	}
}