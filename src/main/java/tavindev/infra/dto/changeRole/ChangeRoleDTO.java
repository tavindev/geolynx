package tavindev.infra.dto.changeRole;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangeRoleDTO(
        @NotBlank(message = "Username is required") String identifier,

        @NotBlank(message = "New role is required") String newRole) {
}