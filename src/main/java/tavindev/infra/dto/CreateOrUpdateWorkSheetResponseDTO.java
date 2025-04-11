package tavindev.infra.dto;

public record CreateOrUpdateWorkSheetResponseDTO(
        String message,
        String id
) {
    public static CreateOrUpdateWorkSheetResponseDTO fromWorkSheet(String id) {
        return new CreateOrUpdateWorkSheetResponseDTO(
                "Folha de obra criada/modificada com sucesso.",
                id
        );
    }
}