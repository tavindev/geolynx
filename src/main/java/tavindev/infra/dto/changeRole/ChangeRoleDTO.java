package tavindev.infra.dto.changeRole;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangeRoleDTO(
    @NotBlank(message = "Username is required")
    String username,
    
    @NotBlank(message = "New role is required")
    String novo_role
) {} 