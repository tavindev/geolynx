package tavindev.infra.dto.removeUser;

import jakarta.validation.constraints.NotBlank;

public record RemoveUserAccountDTO(
    @NotBlank(message = "Identificador é obrigatório")
    String identifier
) {} 