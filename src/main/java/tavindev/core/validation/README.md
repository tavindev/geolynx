# User Validation System

This package implements a comprehensive validation system for user accounts based on role-specific requirements as defined in the ADC system specifications.

## Overview

The validation system uses the **Strategy Pattern** to implement different validation rules for different user roles. Each role has specific minimum requirements for account creation and activation.

## Architecture

### Core Components

1. **UserValidationStrategy** - Interface defining validation contract
2. **BaseUserValidationStrategy** - Abstract base class with common validation methods
3. **Role-specific Strategies** - Concrete implementations for each role type
4. **UserValidationFactory** - Factory to create appropriate strategy based on role
5. **ValidationException** - Custom exception for validation errors

### Validation Strategies

#### BasicUserValidationStrategy
- **Roles**: ADLU, RU, VU, SYSTEM, SYSADMIN
- **Minimum Requirements**: UserID, UNAME, EMAIL, PWD
- **Activation Requirements**: Same as minimum

#### PartnerOperatorValidationStrategy
- **Roles**: PO
- **Minimum Requirements**: UserID, UNAME, EMAIL, PWD, NOME, PARTNER, PHONE1
- **Activation Requirements**: Same as minimum

#### AdministrativeUserValidationStrategy
- **Roles**: SYSBO, SMBO, SGVBO, SDVBO, PRBO
- **Minimum Requirements**: UserID, UNAME, EMAIL, PWD, NOME, PHONE1
- **Activation Requirements**: Complete profile with all fields

## Usage

### Basic Validation

```java
User user = // ... create user
try {
    user.validateMinimumRequirements();
    System.out.println("User meets minimum requirements");
} catch (ValidationException e) {
    System.err.println("Validation failed: " + e.getMessage());
}
```

### Activation Validation

```java
User user = // ... create user
try {
    user.validateActivationRequirements();
    System.out.println("User can be activated");
} catch (ValidationException e) {
    System.err.println("Cannot activate user: " + e.getMessage());
}
```

### Convenience Methods

```java
User user = // ... create user

// Check if user meets minimum requirements
if (user.meetsMinimumRequirements()) {
    System.out.println("User can be created");
}

// Check if user can be activated
if (user.canBeActivated()) {
    System.out.println("User can be activated");
}
```

## Required Fields by Role

### Common Fields (All Roles)
- `UserID` (Integer) - Unique user identifier
- `UNAME` (String) - Username
- `EMAIL` (Email) - Valid email address
- `PWD` (String) - Password (hashed + base64)

### ADLU/RU/VU (Basic Users)
- Only common fields required

### PO (Partner Operator)
- Common fields
- `NOME` (String) - Full name
- `PARTNER` (String) - Organization/employer name
- `PHONE1` (String) - Primary phone number

### SYSBO/SMBO/SGVBO/SDVBO/PRBO (Administrative)
- Common fields
- `NOME` (String) - Full name
- `PN` (String) - Country of nationality
- `PR` (String) - Country of residence
- `END` (String) - Address
- `ENDCP` (String) - Postal code
- `PHONE1` (String) - Primary phone number
- `NIF` (String) - Tax ID
- `CC` (String) - Citizen card number
- `DNASC` (Date) - Birth date

## Entity Structure

The validation system works with the following entity structure:

### PersonalInfo
- `email`, `username`, `password` (common fields)
- `fullName`, `phone` (role-specific)
- `nationality`, `residence`, `address`, `postalCode`, `birthDate` (administrative)

### IdentificationInfo
- `citizenCard`, `taxId` (administrative)

### ProfessionalInfo
- `employer` (PO role)

## DTO Integration

The `RegisterUserDTO` has been updated to match the entity structure:

```java
public record RegisterUserDTO(
    // PersonalInfo fields
    String email, String username, String fullName, String phone,
    String password, String confirmPassword,
    String nationality, String residence, String address, 
    String postalCode, LocalDate birthDate,
    
    // IdentificationInfo fields
    String citizenCard, String taxId,
    
    // ProfessionalInfo fields
    String employer, String jobTitle, String employerTaxId,
    
    // User fields
    String role, String profile
) {
    // Convenience constructors for different registration scenarios
    public RegisterUserDTO(String email, String username, String fullName, 
                          String phone, String password, String confirmPassword, 
                          String role, String profile) { /* ... */ }
    
    public RegisterUserDTO(String email, String username, String fullName,
                          String phone, String password, String confirmPassword, 
                          String employer, String role, String profile) { /* ... */ }
}
```

## Error Handling

The system throws `ValidationException` with descriptive error messages when validation fails:

```java
try {
    user.validateMinimumRequirements();
} catch (ValidationException e) {
    // Handle validation error
    System.err.println("Validation failed: " + e.getMessage());
}
```

## Testing
    
Run the `UserValidationExample` class to see the validation system in action:

```bash
java tavindev.core.validation.UserValidationExample
```

This will demonstrate validation for different user roles and show both successful and failed validation scenarios.

## Extending the System

To add support for new roles:

1. Add the role to `UserRole` enum
2. Create a new validation strategy extending `BaseUserValidationStrategy`
3. Add the role to `UserValidationFactory.createStrategy()`
4. Update this documentation

## Notes

- All accounts are created initially in `DESATIVADA` (inactive) status
- Administrative roles require complete profile information for activation
- Basic roles can be activated with minimum requirements
- The system supports both creation-time and activation-time validation
- Validation annotations have been removed from DTOs in favor of the strategy-based validation system 