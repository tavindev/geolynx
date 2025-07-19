package tavindev.infra.dto.changeRole;

public record ChangeRoleResponseDTO(
        String message,
        String username,
        String newRole) {
    public static ChangeRoleResponseDTO success(String identifier, String newRole) {
        return new ChangeRoleResponseDTO(
                "Role atualizada com sucesso.",
                identifier,
                newRole);
    }
}