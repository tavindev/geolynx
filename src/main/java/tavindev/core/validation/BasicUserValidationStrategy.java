package tavindev.core.validation;

import tavindev.core.entities.User;
import tavindev.core.exceptions.ValidationException;

/**
 * Validation strategy for basic user roles (ADLU, RU) that only require common
 * fields.
 */
public class BasicUserValidationStrategy extends BaseUserValidationStrategy {

	@Override
	public void validateMinimumRequirements(User user) throws ValidationException {
		validateCommonFields(user);
	}

	@Override
	public void validateActivationRequirements(User user) throws ValidationException {
		// For basic roles, minimum requirements are the same as activation requirements
		validateMinimumRequirements(user);
	}
}