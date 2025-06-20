package tavindev.core.validation;

import tavindev.core.entities.*;
import tavindev.core.exceptions.ValidationException;
import java.time.LocalDate;

/**
 * Example class demonstrating the user validation system.
 * This shows how different roles have different validation requirements.
 */
public class UserValidationExample {

	public static void main(String[] args) {
		UserValidationExample example = new UserValidationExample();

		try {
			// Example 1: Basic user (ADLU/RU) - minimum requirements only
			example.testBasicUserValidation();

			// Example 2: Partner Operator - additional requirements
			example.testPartnerOperatorValidation();

			// Example 3: Administrative user - complete profile required
			example.testAdministrativeUserValidation();

		} catch (ValidationException e) {
			System.err.println("Validation failed: " + e.getMessage());
		}
	}

	public void testBasicUserValidation() throws ValidationException {
		System.out.println("=== Testing Basic User (ADLU/RU) Validation ===");

		// Create a basic user with minimum requirements
		PersonalInfo personalInfo = new PersonalInfo(
				"user@example.com",
				"testuser",
				null, // fullName not required for basic users
				null, // phone not required for basic users
				"hashedPassword123",
				null, null, null, null, null // additional fields not required
		);

		User user = new User(
				personalInfo,
				null, // identificationInfo not required
				null, // professionalInfo not required
				null, // profile not required
				UserRole.ADLU,
				AccountStatus.DESATIVADA);

		// This should pass - basic users only need common fields
		user.validateMinimumRequirements();
		System.out.println("✓ Basic user minimum requirements validation passed");

		// This should also pass - for basic users, minimum = activation
		user.validateActivationRequirements();
		System.out.println("✓ Basic user activation requirements validation passed");
	}

	public void testPartnerOperatorValidation() throws ValidationException {
		System.out.println("\n=== Testing Partner Operator (PO) Validation ===");

		// Create a partner operator with required fields
		PersonalInfo personalInfo = new PersonalInfo(
				"operator@company.com",
				"operator123",
				"João Silva", // fullName required for PO
				"+351 123456789", // phone required for PO
				"hashedPassword123",
				null, null, null, null, null // additional fields not required for PO
		);

		ProfessionalInfo professionalInfo = new ProfessionalInfo(
				"Company XYZ", // employer required for PO
				"Field Operator",
				"123456789");

		User user = new User(
				personalInfo,
				null, // identificationInfo not required for PO
				professionalInfo,
				null, // profile not required
				UserRole.PO,
				AccountStatus.DESATIVADA);

		// This should pass - PO requires common fields + name + partner + phone
		user.validateMinimumRequirements();
		System.out.println("✓ Partner operator minimum requirements validation passed");

		// This should also pass - for PO, minimum = activation
		user.validateActivationRequirements();
		System.out.println("✓ Partner operator activation requirements validation passed");
	}

	public void testAdministrativeUserValidation() throws ValidationException {
		System.out.println("\n=== Testing Administrative User (SYSBO) Validation ===");

		// Create an administrative user with minimum requirements
		PersonalInfo personalInfo = new PersonalInfo(
				"admin@system.com",
				"admin123",
				"Administrator User", // fullName required
				"+351 987654321", // phone required
				"hashedPassword123",
				null, null, null, null, null // additional fields required for activation
		);

		User user = new User(
				personalInfo,
				null, // identificationInfo required for activation
				null, // professionalInfo not required
				UserProfile.PRIVADO, // profile required for admin roles
				UserRole.SYSBO,
				AccountStatus.DESATIVADA);

		// This should pass - admin users need common fields + name + phone for minimum
		user.validateMinimumRequirements();
		System.out.println("✓ Administrative user minimum requirements validation passed");

		// This should fail - admin users need complete profile for activation
		try {
			user.validateActivationRequirements();
			System.out.println("✗ Administrative user activation validation should have failed");
		} catch (ValidationException e) {
			System.out.println("✓ Administrative user activation validation correctly failed: " + e.getMessage());
		}

		// Now create a complete administrative user
		PersonalInfo completePersonalInfo = new PersonalInfo(
				"admin@system.com",
				"admin123",
				"Administrator User",
				"+351 987654321",
				"hashedPassword123",
				"Portugal", // nationality
				"Portugal", // residence
				"Rua das Flores, 123", // address
				"12345-678", // postal code
				LocalDate.of(1980, 1, 1) // birth date
		);

		IdentificationInfo identificationInfo = new IdentificationInfo(
				"12345678", // citizen card
				"123456789", // tax ID
				"Rua das Flores, 123" // address
		);

		User completeUser = new User(
				completePersonalInfo,
				identificationInfo,
				null,
				UserProfile.PRIVADO,
				UserRole.SYSBO,
				AccountStatus.DESATIVADA);

		// This should pass - complete profile for activation
		completeUser.validateActivationRequirements();
		System.out.println("✓ Complete administrative user activation requirements validation passed");
	}
}