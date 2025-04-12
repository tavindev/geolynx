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
    String fullName,

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+[0-9]{1,15}$", message = "Invalid phone number format")
    String phoneNumber,

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$", 
             message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    String password,

    @NotBlank(message = "Password confirmation is required")
    String confirmPassword,

    @NotBlank(message = "Profile type is required")
    @Pattern(regexp = "^(PUBLICO|PRIVADO)$", message = "Profile must be either 'public' or 'private'")
    String profile,

    String citizenCardNumber,
    String taxNumber,
    String employer,
    String jobTitle,
    String address,
    String employerTaxNumber,
    String photo
) {
    public RegisterUserDTO(String email, String username, String fullName, String phoneNumber, String password, String confirmPassword, String profile) {
        this(email, username, fullName, phoneNumber, password, confirmPassword, profile, null, null, null, null, null, null, null);
    }
        
    public boolean isPasswordNotMatch() {
        return !password.equals(confirmPassword);
    }
}