package tavindev.infra.dto.changePassword;

public record ChangePasswordResponseDTO(String message) {
    public static ChangePasswordResponseDTO success() {
        return new ChangePasswordResponseDTO("Password alterada com sucesso.");
    }
} 