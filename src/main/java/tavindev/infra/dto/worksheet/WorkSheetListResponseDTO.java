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
		String posaCode,
		String posaDescription,
		List<OperationDTO> operations,
		List<FeatureDTO> features) {
	public record OperationDTO(
			String operationCode,
			String operationDescription,
			double areaHa) {
	}

	public record FeatureDTO(
			String type,
			GeometryDTO geometry) {
	}

	public record GeometryDTO(
			String type,
			List<List<List<Double>>> coordinates) {
	}
}