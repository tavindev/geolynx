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
		PersonalInfo personalInfo = user.getPersonalInfo();

		if (personalInfo == null) {
			throw new ValidationException("Personal information is required");
		}

		if (personalInfo.username() == null || personalInfo.username().trim().isEmpty()) {
			throw new ValidationException("Username is required");
		}

		if (personalInfo.email() == null || personalInfo.email().trim().isEmpty()) {
			throw new ValidationException("Email is required");
		}

		if (!isValidEmail(personalInfo.email())) {
			throw new ValidationException("Invalid email format");
		}

		if (personalInfo.password() == null || personalInfo.password().trim().isEmpty()) {
			throw new ValidationException("Password is required");
		}
	}

	protected void validateFullName(User user) throws ValidationException {
		PersonalInfo personalInfo = user.getPersonalInfo();
		if (personalInfo.fullName() == null || personalInfo.fullName().trim().isEmpty()) {
			throw new ValidationException("Full name is required");
		}
	}

	protected void validatePhone(User user) throws ValidationException {
		PersonalInfo personalInfo = user.getPersonalInfo();
		if (personalInfo.phone() == null || personalInfo.phone().trim().isEmpty()) {
			throw new ValidationException("Phone number is required");
		}
	}

	protected void validatePartner(User user) throws ValidationException {
		ProfessionalInfo professionalInfo = user.getProfessionalInfo();
		if (professionalInfo == null || professionalInfo.employer() == null
				|| professionalInfo.employer().trim().isEmpty()) {
			throw new ValidationException("Partner/employer information is required");
		}
	}

	protected void validateCompleteProfile(User user) throws ValidationException {
		PersonalInfo personalInfo = user.getPersonalInfo();
		IdentificationInfo identificationInfo = user.getIdentificationInfo();

		// Validate personal info
		validateFullName(user);
		validatePhone(user);

		// Validate additional personal info fields
		if (personalInfo.nationality() == null || personalInfo.nationality().trim().isEmpty()) {
			throw new ValidationException("Nationality is required");
		}

		if (personalInfo.residence() == null || personalInfo.residence().trim().isEmpty()) {
			throw new ValidationException("Country of residence is required");
		}

		if (personalInfo.address() == null || personalInfo.address().trim().isEmpty()) {
			throw new ValidationException("Address is required");
		}

		if (personalInfo.postalCode() == null || personalInfo.postalCode().trim().isEmpty()) {
			throw new ValidationException("Postal code is required");
		}

		if (personalInfo.birthDate() == null) {
			throw new ValidationException("Birth date is required");
		}

		// Validate identification info
		if (identificationInfo == null) {
			throw new ValidationException("Identification information is required");
		}

		if (identificationInfo.taxId() == null || identificationInfo.taxId().trim().isEmpty()) {
			throw new ValidationException("Tax ID (NIF) is required");
		}

		if (identificationInfo.citizenCard() == null || identificationInfo.citizenCard().trim().isEmpty()) {
			throw new ValidationException("Citizen card number is required");
		}
	}

	private boolean isValidEmail(String email) {
		// Basic email validation - can be enhanced with more sophisticated regex
		return email != null && email.contains("@") && email.contains(".");
	}
}