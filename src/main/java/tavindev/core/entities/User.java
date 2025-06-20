package tavindev.core.entities;

import tavindev.core.utils.PasswordUtils;
import tavindev.core.validation.UserValidationFactory;
import tavindev.core.validation.UserValidationStrategy;
import tavindev.core.exceptions.ValidationException;
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