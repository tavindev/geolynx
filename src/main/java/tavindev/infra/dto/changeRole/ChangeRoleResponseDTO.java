package tavindev.infra.dto.changeRole;

public record ChangeRoleResponseDTO(
    String message,
    String username,
    String novo_role
) {
    public static ChangeRoleResponseDTO success(String username, String novo_role) {
        return new ChangeRoleResponseDTO(
            "Role atualizada com sucesso.",
            username,
            novo_role
        );
    }
} 