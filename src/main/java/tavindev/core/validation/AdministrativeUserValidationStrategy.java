package tavindev.core.validation;

import tavindev.core.entities.User;
import tavindev.core.exceptions.ValidationException;

/**
 * Validation strategy for administrative roles (SYSBO, SMBO, SGVBO, SDVBO,
 * PRBO).
 * These roles require complete profile information for activation.
 */
public class AdministrativeUserValidationStrategy extends BaseUserValidationStrategy {

	@Override
	public void validateMinimumRequirements(User user) throws ValidationException {
		validateCommonFields(user);
		validateFullName(user);
		validatePhone(user);
	}

	@Override
	public void validateActivationRequirements(User user) throws ValidationException {
		// Administrative roles require complete profile for activation
		validateCommonFields(user);
		validateCompleteProfile(user);

		// Additional validations for administrative roles
		validateAdministrativeRequirements(user);
	}

	private void validateAdministrativeRequirements(User user) throws ValidationException {
		// Additional validations specific to administrative roles
		// This could include validation of specific permissions, organizational
		// requirements, etc.

		if (user.getProfile() == null) {
			throw new ValidationException("User profile is required for administrative roles");
		}

		// Add more specific validations as needed for administrative roles
	}
}