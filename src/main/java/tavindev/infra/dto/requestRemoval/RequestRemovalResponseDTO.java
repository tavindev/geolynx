package tavindev.infra.dto.requestRemoval;

public record RequestRemovalResponseDTO(
		String message,
		String identificador,
		String status) {
	public static RequestRemovalResponseDTO success(String identificador) {
		return new RequestRemovalResponseDTO(
				"Pedido de remoção de conta solicitado com sucesso",
				identificador,
				"A_REMOVER");
	}

	public static RequestRemovalResponseDTO error(String message) {
		return new RequestRemovalResponseDTO(message, null, null);
	}
}