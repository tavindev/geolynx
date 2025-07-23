package tavindev.infra.dto.corporation;

import jakarta.validation.constraints.NotBlank;

public record AssignAccountDTO (
    @NotBlank(message = "Identificador é obrigatório") String identificador,
    @NotBlank(message = "Identificador é obrigatório") String corporationId){
}
