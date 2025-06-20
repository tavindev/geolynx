package tavindev.infra.dto.accountStatus;

public record AccountStatusResponseDTO(
		String message,
		String identificador,
		String status) {
	public static AccountStatusResponseDTO success(String identificador, String status) {
		return new AccountStatusResponseDTO(
				"Estado da conta consultado com sucesso",
				identificador,
				status);
	}

	public static AccountStatusResponseDTO error(String message) {
		return new AccountStatusResponseDTO(message, null, null);
	}
}