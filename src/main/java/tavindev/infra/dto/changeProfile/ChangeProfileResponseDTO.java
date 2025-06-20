package tavindev.infra.dto.changeProfile;

public record ChangeProfileResponseDTO(
		String message,
		String identificador,
		String novo_perfil) {
	public static ChangeProfileResponseDTO success(String identificador, String novoPerfil) {
		return new ChangeProfileResponseDTO(
				"Perfil alterado com sucesso",
				identificador,
				novoPerfil);
	}

	public static ChangeProfileResponseDTO error(String message) {
		return new ChangeProfileResponseDTO(message, null, null);
	}
}