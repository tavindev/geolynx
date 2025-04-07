package tavindev.core.entities;

public record User(
    PersonalInfo personalInfo,
    IdentificationInfo identificationInfo,
    ProfessionalInfo professionalInfo,
    UserProfile profile,
    UserRole role,
    AccountStatus accountStatus
) {
    public static User empty() {
        return new User(
            PersonalInfo.empty(),
            IdentificationInfo.empty(),
            ProfessionalInfo.empty(),
            UserProfile.PRIVADO,
            UserRole.ENDUSER,
            AccountStatus.DESATIVADA
        );
    }

    public boolean isPasswordInvalid(String password) {
        return !this.personalInfo.password().equals(password);
    }

    public String getUsername() {
        return this.personalInfo().username();
    }

    public String getEmail() {
        return this.personalInfo().email();
    }

    public UserRole getRole() {
        return this.role;
    }
}