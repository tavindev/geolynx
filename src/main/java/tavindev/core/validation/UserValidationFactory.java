package tavindev.core.validation;

import tavindev.core.entities.UserRole;
import tavindev.core.exceptions.ValidationException;

/**
 * Factory class to create appropriate validation strategies based on user role.
 */
public class UserValidationFactory {

	/**
	 * Creates the appropriate validation strategy for the given user role.
	 * 
	 * @param role The user role
	 * @return The appropriate validation strategy
	 * @throws ValidationException if the role is not supported
	 */
	public static UserValidationStrategy createStrategy(UserRole role) throws ValidationException {
		return switch (role) {
			case ADLU, RU, VU -> new BasicUserValidationStrategy();
			case PO -> new PartnerOperatorValidationStrategy();
			case SYSBO, SMBO, SGVBO, SDVBO, PRBO -> new AdministrativeUserValidationStrategy();
			case SYSTEM, SYSADMIN -> new BasicUserValidationStrategy(); // System roles have minimal requirements
			default -> throw new ValidationException("Unsupported user role: " + role);
		};
	}
}