package tavindev.infra.dto.activateAccount;

public record ActivateAccountResponseDTO(
		String message,
		String identificador,
		String status) {
	public static ActivateAccountResponseDTO success(String identificador) {
		return new ActivateAccountResponseDTO(
				"Conta ativada com sucesso",
				identificador,
				"ATIVADA");
	}

	public static ActivateAccountResponseDTO error(String message) {
		return new ActivateAccountResponseDTO(message, null, null);
	}
}