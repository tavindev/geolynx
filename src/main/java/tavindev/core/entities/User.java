package tavindev.core.entities;

import tavindev.core.utils.PasswordUtils;
import tavindev.core.validation.UserValidationFactory;
import tavindev.core.validation.UserValidationStrategy;
import tavindev.core.exceptions.ValidationException;
import tavindev.core.exceptions.InvalidCredentialsException;
import java.util.UUID;
import java.util.Map;

public class User {
    private final String id;
    private PersonalInfo personalInfo;
    private final IdentificationInfo identificationInfo;
    private ProfessionalInfo professionalInfo;
    private final UserProfile profile;
    private UserRole role;
    private AccountStatus accountStatus;

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
        this(UUID.randomUUID().toString(), personalInfo, identificationInfo, professionalInfo, profile, role,
                accountStatus);
    }

    public boolean isPasswordInvalid(String password) {
        return !PasswordUtils.verifyPassword(password, this.personalInfo.password());
    }

    /**
     * Validates if the user meets the minimum requirements for account creation.
     * 
     * @throws ValidationException if validation fails
     */
    public void validateMinimumRequirements() throws ValidationException {
        UserValidationStrategy strategy = UserValidationFactory.createStrategy(this.role);
        strategy.validateMinimumRequirements(this);
    }

    /**
     * Validates if the user meets all requirements for account activation.
     * 
     * @throws ValidationException if validation fails
     */
    public void validateActivationRequirements() throws ValidationException {
        UserValidationStrategy strategy = UserValidationFactory.createStrategy(this.role);
        strategy.validateActivationRequirements(this);
    }

    /**
     * Checks if the user can be activated based on their current attributes.
     * 
     * @return true if the user meets activation requirements, false otherwise
     */
    public boolean canBeActivated() {
        try {
            validateActivationRequirements();
            return true;
        } catch (ValidationException e) {
            return false;
        }
    }

    /**
     * Checks if the user meets minimum requirements for account creation.
     * 
     * @return true if the user meets minimum requirements, false otherwise
     */
    public boolean meetsMinimumRequirements() {
        try {
            validateMinimumRequirements();
            return true;
        } catch (ValidationException e) {
            return false;
        }
    }

    public void setPassword(String newPassword) {
        if (isPasswordInvalid(this.personalInfo.password())) {
            throw new InvalidCredentialsException();
        }

        this.personalInfo = this.personalInfo.updatePassword(newPassword);
    }

    public void setRole(UserRole newRole) {
        this.role = newRole;
    }

    public void setAccountStatus(AccountStatus newAccountStatus) {
        this.accountStatus = newAccountStatus;
    }

    public void setAttributes(Map<String, String> attributes) {
        if (attributes.containsKey("fullName")) {
            this.personalInfo = this.personalInfo.updateFullName(attributes.get("fullName"));
        }
        if (attributes.containsKey("phone")) {
            this.personalInfo = this.personalInfo.updatePhone(attributes.get("phone"));
        }
        if (attributes.containsKey("address")) {
            this.personalInfo = this.personalInfo.updateAddress(attributes.get("address"));
        }
        if (attributes.containsKey("employer")) {
            this.professionalInfo = this.professionalInfo.updateEmployer(attributes.get("employer"));
        }
        if (attributes.containsKey("jobTitle")) {
            this.professionalInfo = this.professionalInfo.updateJobTitle(attributes.get("jobTitle"));
        }
        if (attributes.containsKey("photo")) {
            this.professionalInfo = this.professionalInfo.updatePhoto(attributes.get("photo"));
        }

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