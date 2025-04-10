package tavindev.infra.dto.changeAttributes;

public record ChangeAttributesResponseDTO(
    String message,
    String identificador
) {
    public static ChangeAttributesResponseDTO success(String identificador) {
        return new ChangeAttributesResponseDTO(
            "Atributos da conta modificados com sucesso.",
            identificador
        );
    }
} 