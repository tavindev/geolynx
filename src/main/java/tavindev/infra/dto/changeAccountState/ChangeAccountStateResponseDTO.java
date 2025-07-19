package tavindev.infra.dto.changeAccountState;

public record ChangeAccountStateResponseDTO(
        String message,
        String username,
        String novo_estado) {
    public static ChangeAccountStateResponseDTO success(String identifier, String newState) {
        return new ChangeAccountStateResponseDTO(
                "Estado da conta atualizado com sucesso.",
                identifier,
                newState);
    }
}