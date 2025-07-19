package tavindev.infra.dto.changeAccountState;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangeAccountStateDTO(
                @NotBlank(message = "Username is required") String identifier,

                @NotBlank(message = "New state is required") @Pattern(regexp = "^(ATIVADA|DESATIVADA|SUSPENSA)$", message = "New state must be either 'ATIVADA', 'DESATIVADA' or 'SUSPENSA'") String newState) {
}