package tavindev.infra.dto.suspendAccount;

public record SuspendAccountResponseDTO(
		String message,
		String identificador,
		String status) {
	public static SuspendAccountResponseDTO success(String identificador) {
		return new SuspendAccountResponseDTO(
				"Conta suspensa com sucesso",
				identificador,
				"SUSPENSA");
	}

	public static SuspendAccountResponseDTO error(String message) {
		return new SuspendAccountResponseDTO(message, null, null);
	}
}