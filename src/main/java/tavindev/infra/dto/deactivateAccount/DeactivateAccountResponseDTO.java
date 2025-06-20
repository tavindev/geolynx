package tavindev.infra.dto.deactivateAccount;

public record DeactivateAccountResponseDTO(
		String message,
		String identificador,
		String status) {
	public static DeactivateAccountResponseDTO success(String identificador) {
		return new DeactivateAccountResponseDTO(
				"Conta desativada com sucesso",
				identificador,
				"DESATIVADA");
	}

	public static DeactivateAccountResponseDTO error(String message) {
		return new DeactivateAccountResponseDTO(message, null, null);
	}
}