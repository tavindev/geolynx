package tavindev.infra.dto.removeUser;

public record RemoveUserAccountResponseDTO(
    String message,
    String identificador
) {
    public static RemoveUserAccountResponseDTO success(String identifier) {
        return new RemoveUserAccountResponseDTO(
            "Conta removida com sucesso.",
            identifier
        );
    }
} 