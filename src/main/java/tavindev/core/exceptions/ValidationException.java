package tavindev.core.exceptions;

import tavindev.core.errors.Error;

/**
 * Exception thrown when user validation fails during account creation or
 * updates.
 */
public class ValidationException extends DomainException {

	public ValidationException(String message) {
		super(Error.BAD_REQUEST, message);
	}

	public ValidationException(String message, Throwable cause) {
		super(Error.BAD_REQUEST, message);
		initCause(cause);
	}
}