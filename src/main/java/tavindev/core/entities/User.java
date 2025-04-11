package tavindev.core.entities;

import tavindev.core.utils.PasswordUtils;
import java.util.UUID;

public class User {
    private final String id;
    private final PersonalInfo personalInfo;
    private final IdentificationInfo identificationInfo;
    private final ProfessionalInfo professionalInfo;
    private final UserProfile profile;
    private final UserRole role;
    private final AccountStatus accountStatus;

    public User(String id, PersonalInfo personalInfo, IdentificationInfo identificationInfo,
               ProfessionalInfo professionalInfo, UserProfile profile, UserRole role,
               AccountStatus accountStatus) {
        this.id = id;
        this.personalInfo = personalInfo;
        this.identificationInfo = identificationInfo;
        this.professionalInfo = professionalInfo;
        this.profile = profile;
        this.role = role;
        this.accountStatus = accountStatus;
    }

    public User(PersonalInfo personalInfo, IdentificationInfo identificationInfo,
               ProfessionalInfo professionalInfo, UserProfile profile, UserRole role,
               AccountStatus accountStatus) {
        this(UUID.randomUUID().toString(), personalInfo, identificationInfo, professionalInfo, profile, role, accountStatus);
    }

    public boolean isPasswordInvalid(String password) {
        return !PasswordUtils.verifyPassword(password, this.personalInfo.password());
    }

    public String getUsername() {
        return this.personalInfo.username();
    }

    public String getEmail() {
        return this.personalInfo.email();
    }

    public UserRole getRole() {
        return this.role;
    }

    public String getId() {
        return id;
    }

    public PersonalInfo getPersonalInfo() {
        return personalInfo;
    }

    public IdentificationInfo getIdentificationInfo() {
        return identificationInfo;
    }

    public ProfessionalInfo getProfessionalInfo() {
        return professionalInfo;
    }

    public UserProfile getProfile() {
        return profile;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }
}