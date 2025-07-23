package tavindev.core.entities;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import tavindev.core.exceptions.PasswordDoesntMatchException;
import tavindev.core.exceptions.ValidationException;
import tavindev.core.utils.PasswordUtils;
import tavindev.core.validation.UserValidationFactory;
import tavindev.core.validation.UserValidationStrategy;

public class User {
    private String id;
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String nationality;
    private String residence;
    private String address;
    private String postalCode;
    private String phonePrimary;
    private String phoneSecondary;
    private String taxId;
    private String citizenCard;
    private LocalDate citizenCardIssueDate;
    private String citizenCardIssuePlace;
    private LocalDate citizenCardValidity;
    private LocalDate dateOfBirth;
    private UserProfile profile;
    private String employer;
    private String jobTitle;
    private String employerTaxId;
    private UserRole role;
    private AccountStatus accountStatus;
    private String corporationId;

    public User(
            String email,
            String username,
            String fullName,
            String password,
            UserRole role,
            AccountStatus accountStatus) {
        this.id = UUID.randomUUID().toString();
        this.email = email;
        this.username = username;
        this.fullName = fullName;
        this.password = password;
        this.role = role;
        this.accountStatus = accountStatus;
        this.profile = UserProfile.PRIVADO;
    }

    public User(
            String id,
            String email,
            String username,
            String fullName,
            String password,
            String profile,
            String citizenCard,
            LocalDate citizenCardIssueDate,
            String citizenCardIssuePlace,
            LocalDate citizenCardValidity,
            LocalDate dateOfBirth,
            String nationality,
            String residence,
            String address,
            String taxId,
            String employer,
            String jobTitle,
            String employerTaxId,
            String postalCode,
            String phonePrimary,
            String phoneSecondary,
            String status,
            UserRole role,
            AccountStatus accountStatus,
            String corporationId) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.fullName = fullName;
        this.password = password;
        this.profile = profile != null ? UserProfile.valueOf(profile.toUpperCase()) : UserProfile.PRIVADO;
        this.citizenCard = citizenCard;
        this.taxId = taxId;
        this.employer = employer;
        this.jobTitle = jobTitle;
        this.address = address;
        this.employerTaxId = employerTaxId;
        this.nationality = nationality;
        this.residence = residence;
        this.postalCode = postalCode;
        this.phonePrimary = phonePrimary;
        this.phoneSecondary = phoneSecondary;
        this.citizenCardIssueDate = citizenCardIssueDate;
        this.citizenCardIssuePlace = citizenCardIssuePlace;
        this.citizenCardValidity = citizenCardValidity;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
        this.accountStatus = accountStatus;
        this.corporationId = corporationId;
    }

    @JsonCreator
    public User(
            @JsonProperty("email") String email,
            @JsonProperty("username") String username,
            @JsonProperty("fullName") String fullName,
            @JsonProperty("password") String password,
            @JsonProperty("confirmPassword") String confirmPassword,
            @JsonProperty("profile") String profile,
            @JsonProperty("citizenCard") String citizenCard,
            @JsonProperty("citizenCardIssueDate") LocalDate citizenCardIssueDate,
            @JsonProperty("citizenCardIssuePlace") String citizenCardIssuePlace,
            @JsonProperty("citizenCardValidity") LocalDate citizenCardValidity,
            @JsonProperty("dateOfBirth") LocalDate dateOfBirth,
            @JsonProperty("nationality") String nationality,
            @JsonProperty("residence") String residence,
            @JsonProperty("address") String address,
            @JsonProperty("taxId") String taxId,
            @JsonProperty("employer") String employer,
            @JsonProperty("jobTitle") String jobTitle,
            @JsonProperty("employerTaxId") String employerTaxId,
            @JsonProperty("postalCode") String postalCode,
            @JsonProperty("phonePrimary") String phonePrimary,
            @JsonProperty("phoneSecondary") String phoneSecondary,
            @JsonProperty("corporationId") String corporationId) {
        if (!password.equals(confirmPassword)) {
            throw new PasswordDoesntMatchException();
        }

        this.id = UUID.randomUUID().toString();
        this.email = email;
        this.username = username;
        this.fullName = fullName;
        this.password = PasswordUtils.hashPassword(password);
        this.profile = profile != null ? UserProfile.valueOf(profile.toUpperCase()) : UserProfile.PRIVADO;
        this.citizenCard = citizenCard;
        this.taxId = taxId;
        this.employer = employer;
        this.jobTitle = jobTitle;
        this.address = address;
        this.employerTaxId = employerTaxId;
        this.nationality = nationality;
        this.residence = residence;
        this.postalCode = postalCode;
        this.phonePrimary = phonePrimary;
        this.phoneSecondary = phoneSecondary;
        this.citizenCardIssueDate = citizenCardIssueDate;
        this.citizenCardIssuePlace = citizenCardIssuePlace;
        this.citizenCardValidity = citizenCardValidity;
        this.dateOfBirth = dateOfBirth;
        this.role = UserRole.RU;
        this.accountStatus = AccountStatus.DESATIVADA;
        this.corporationId = corporationId;

        UserValidationStrategy strategy = UserValidationFactory.createStrategy(this.role);
        strategy.validateMinimumRequirements(this);
    }

    public boolean canBeActivated() {
        try {
            UserValidationStrategy strategy = UserValidationFactory.createStrategy(this.role);
            strategy.validateActivationRequirements(this);

            return true;
        } catch (ValidationException e) {
            return false;
        }
    }

    public UserRole getRole() {
        return role;
    }

    public String getEmail() {
        return email;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    public String getFullName() {
        return fullName;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getNationality() {
        return nationality;
    }

    public String getResidence() {
        return residence;
    }

    public String getAddress() {
        return address;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getPhonePrimary() {
        return phonePrimary;
    }

    public String getPhoneSecondary() {
        return phoneSecondary;
    }

    public String getTaxId() {
        return taxId;
    }

    public String getCitizenCard() {
        return citizenCard;
    }

    public LocalDate getCitizenCardIssueDate() {
        return citizenCardIssueDate;
    }

    public String getCitizenCardIssuePlace() {
        return citizenCardIssuePlace;
    }

    public LocalDate getCitizenCardValidity() {
        return citizenCardValidity;
    }

    public String getDateOfBirth() {
        return dateOfBirth != null ? dateOfBirth.toString() : null;
    }

    public UserProfile getProfile() {
        return profile;
    }

    public String getEmployer() {
        return employer;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getEmployerTaxId() {
        return employerTaxId;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public String getCorporationId() { return corporationId; }

    public boolean isPasswordInvalid(String password) {
        return !PasswordUtils.verifyPassword(password, this.password);
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }

    public void setProfile(UserProfile profile) {
        this.profile = profile;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setCorporationId(String corporationId) {this.corporationId = corporationId;}

    public void setAttributes(Map<String, String> attributes) {
        if (attributes == null) {
            return;
        }

        if (attributes.containsKey("email")) {
            this.email = attributes.get("email");
        }

        if (attributes.containsKey("password")) {
            this.password = PasswordUtils.hashPassword(attributes.get("password"));
        }

        if (attributes.containsKey("username")) {
            this.username = attributes.get("username");
        }

        if (attributes.containsKey("fullName")) {
            this.fullName = attributes.get("fullName");
        }

        if (attributes.containsKey("nationality")) {
            this.nationality = attributes.get("nationality");
        }

        if (attributes.containsKey("residence")) {
            this.residence = attributes.get("residence");
        }

        if (attributes.containsKey("address")) {
            this.address = attributes.get("address");
        }

        if (attributes.containsKey("postalCode")) {
            this.postalCode = attributes.get("postalCode");
        }

        if (attributes.containsKey("phonePrimary")) {
            this.phonePrimary = attributes.get("phonePrimary");
        }

        if (attributes.containsKey("phoneSecondary")) {
            this.phoneSecondary = attributes.get("phoneSecondary");
        }

        if (attributes.containsKey("taxId")) {
            this.taxId = attributes.get("taxId");
        }

        if (attributes.containsKey("citizenCard")) {
            this.citizenCard = attributes.get("citizenCard");
        }

        if (attributes.containsKey("citizenCardIssuePlace")) {
            this.citizenCardIssuePlace = attributes.get("citizenCardIssuePlace");
        }

        if (attributes.containsKey("dateOfBirth")) {
            this.dateOfBirth = LocalDate.parse(attributes.get("dateOfBirth"));
        }

        if (attributes.containsKey("employer")) {
            this.employer = attributes.get("employer");
        }

        if (attributes.containsKey("jobTitle")) {
            this.jobTitle = attributes.get("jobTitle");
        }

        if (attributes.containsKey("employerTaxId")) {
            this.employerTaxId = attributes.get("employerTaxId");
        }
        if(attributes.containsKey("corporationId")) {
            this.corporationId = attributes.get("corporationId");
        }
    }
}
