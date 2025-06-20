package tavindev.core.validation;

import tavindev.core.entities.User;
import tavindev.core.exceptions.ValidationException;

/**
 * Validation strategy for Partner Operator (PO) role.
 * Requires: UserID, UNAME, EMAIL, PWD, NOME, PARTNER, PHONE1
 */
public class PartnerOperatorValidationStrategy extends BaseUserValidationStrategy {

	@Override
	public void validateMinimumRequirements(User user) throws ValidationException {
		validateCommonFields(user);
		validateFullName(user);
		validatePartner(user);
		validatePhone(user);
	}

	@Override
	public void validateActivationRequirements(User user) throws ValidationException {
		// For PO role, minimum requirements are the same as activation requirements
		validateMinimumRequirements(user);
	}
}