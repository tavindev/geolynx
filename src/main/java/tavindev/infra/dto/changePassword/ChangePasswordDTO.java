package tavindev.infra.dto.changePassword;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordDTO(
    @NotBlank(message = "A senha atual é obrigatória")
    String senha_atual,
    
    @NotBlank(message = "A nova senha é obrigatória")
    String nova_senha,
    
    @NotBlank(message = "A confirmação da senha é obrigatória")
    String confirmacao_senha
) {
    public boolean isPasswordNotMatch() {
        return !nova_senha.equals(confirmacao_senha);
    }
} 