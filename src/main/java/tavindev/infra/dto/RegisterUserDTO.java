package tavindev.infra.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.DefaultValue;

public record RegisterUserDTO(
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,

    @NotBlank(message = "Username is required")
    @Size(min = 3, message = "Username must be at least 3 characters long")
    String username,

    @NotBlank(message = "Full name is required")
    String nome_completo,

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+[0-9]{1,15}$", message = "Invalid phone number format")
    String telefone,

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$", 
             message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    String password,

    @NotBlank(message = "Password confirmation is required")
    String confirmar_password,

    @NotBlank(message = "Profile type is required")
    @Pattern(regexp = "^(PUBLICO|PRIVADO)$", message = "Profile must be either 'public' or 'private'")
    String perfil,

    String cartao_cidadao,
    String nif,
    String entidade_empregadora,
    String funcao,
    String morada,
    String nif_entidade_empregadora
) {
    public RegisterUserDTO(String email, String username, String nome_completo, String telefone, String password, String confirmar_password, String perfil) {
        this(email, username, nome_completo, telefone, password, confirmar_password, perfil, null, null, null, null, null, null);
    }
        
    public boolean isPasswordNotMatch() {
        return !password.equals(confirmar_password);
    }
}