package tavindev.infra.dto.changeAccountState;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangeAccountStateDTO(
    @NotBlank(message = "Username is required")
    String username,
    
    @NotBlank(message = "New state is required")
    @Pattern(regexp = "^(ATIVADA|DESATIVADA)$", message = "New state must be either 'ATIVADA' or 'DESATIVADA'")
    String novo_estado
) {} 