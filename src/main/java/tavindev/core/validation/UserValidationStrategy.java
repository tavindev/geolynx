package tavindev.core.validation;

import tavindev.core.entities.User;
import tavindev.core.exceptions.ValidationException;

/**
 * Strategy interface for validating user accounts based on role requirements.
 */
public interface UserValidationStrategy {

	/**
	 * Validates if a user has the minimum required attributes for account creation.
	 * 
	 * @param user The user to validate
	 * @throws ValidationException if validation fails
	 */
	void validateMinimumRequirements(User user) throws ValidationException;

	/**
	 * Validates if a user has all required attributes for account activation.
	 * 
	 * @param user The user to validate
	 * @throws ValidationException if validation fails
	 */
	void validateActivationRequirements(User user) throws ValidationException;
}