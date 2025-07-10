package tavindev.infra.dto.executionsheet;

public class CreateExecutionSheetResponseDTO {
	private final String message;

	public CreateExecutionSheetResponseDTO(String message) {
		this.message = message;
	}

	public String getMessage() {
		return message;
	}
}