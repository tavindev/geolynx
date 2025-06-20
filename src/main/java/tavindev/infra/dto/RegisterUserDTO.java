package tavindev.infra.dto;

import java.time.LocalDate;

/**
 * DTO for user registration that matches the User entity structure.
 * Validation is handled by the UserValidationStrategy system.
 */
public record RegisterUserDTO(
        // PersonalInfo fields
        String email,
        String username,
        String fullName,
        String phone,
        String password,
        String confirmPassword,
        String nationality,
        String residence,
        String address,
        String postalCode,
        LocalDate birthDate,

        // IdentificationInfo fields
        String citizenCard,
        String taxId,

        // ProfessionalInfo fields
        String employer,
        String jobTitle,
        String employerTaxId,

        // User fields
        String role,
        String profile) {

    /**
     * Constructor for basic user registration with minimal fields
     */
    public RegisterUserDTO(String email, String username, String fullName, String phone,
            String password, String confirmPassword, String role, String profile) {
        this(email, username, fullName, phone, password, confirmPassword,
                null, null, null, null, null, null, null, null, null, null, role, profile);
    }

    /**
     * Constructor for partner operator registration
     */
    public RegisterUserDTO(String email, String username, String fullName, String phone,
            String password, String confirmPassword, String employer,
            String role, String profile) {
        this(email, username, fullName, phone, password, confirmPassword,
                null, null, null, null, null, null, null, employer, null, null, role, profile);
    }

    /**
     * Checks if password and confirmation password match
     */
    public boolean isPasswordNotMatch() {
        return !password.equals(confirmPassword);
    }

    /**
     * Checks if all required fields for complete profile are present
     */
    public boolean hasCompleteProfile() {
        return email != null && username != null && fullName != null && phone != null &&
                nationality != null && residence != null && address != null &&
                postalCode != null && birthDate != null && citizenCard != null &&
                taxId != null;
    }
}