package tavindev.core.validation;

import tavindev.core.entities.User;
import tavindev.core.entities.PersonalInfo;
import tavindev.core.entities.IdentificationInfo;
import tavindev.core.entities.ProfessionalInfo;
import tavindev.core.exceptions.ValidationException;

/**
 * Base validation strategy with common validation methods.
 */
public abstract class BaseUserValidationStrategy implements UserValidationStrategy {

	protected void validateCommonFields(User user) throws ValidationException {
		if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
			throw new ValidationException("Personal information is required");
		}

		if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
			throw new ValidationException("Username is required");
		}

		if (!isValidEmail(user.getEmail())) {
			throw new ValidationException("Invalid email format");
		}

		if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
			throw new ValidationException("Password is required");
		}
	}

	protected void validateFullName(User user) throws ValidationException {
		if (user.getFullName() == null || user.getFullName().trim().isEmpty()) {
			throw new ValidationException("Full name is required");
		}
	}

	protected void validatePhone(User user) throws ValidationException {
		if (user.getPhonePrimary() == null || user.getPhonePrimary().trim().isEmpty()) {
			throw new ValidationException("Phone number is required");
		}
	}

	protected void validatePartner(User user) throws ValidationException {
		if (user.getEmployer() == null || user.getEmployer().trim().isEmpty()) {
			throw new ValidationException("Partner/employer information is required");
		}
	}

	protected void validateCompleteProfile(User user) throws ValidationException {
		// Validate personal info
		validateFullName(user);
		validatePhone(user);

		// Validate additional personal info fields
		if (user.getNationality() == null || user.getNationality().trim().isEmpty()) {
			throw new ValidationException("Nationality is required");
		}

		if (user.getResidence() == null || user.getResidence().trim().isEmpty()) {
			throw new ValidationException("Country of residence is required");
		}

		if (user.getAddress() == null || user.getAddress().trim().isEmpty()) {
			throw new ValidationException("Address is required");
		}

		if (user.getPostalCode() == null || user.getPostalCode().trim().isEmpty()) {
			throw new ValidationException("Postal code is required");
		}

		if (user.getDateOfBirth() == null) {
			throw new ValidationException("Birth date is required");
		}

		// Validate identification info
		if (user.getCitizenCard() == null || user.getCitizenCard().trim().isEmpty()) {
			throw new ValidationException("Identification information is required");
		}

		if (user.getTaxId() == null || user.getTaxId().trim().isEmpty()) {
			throw new ValidationException("Tax ID (NIF) is required");
		}

		if (user.getCitizenCard() == null || user.getCitizenCard().trim().isEmpty()) {
			throw new ValidationException("Citizen card number is required");
		}
	}

	private boolean isValidEmail(String email) {
		// Basic email validation - can be enhanced with more sophisticated regex
		return email != null && email.contains("@") && email.contains(".");
	}
}