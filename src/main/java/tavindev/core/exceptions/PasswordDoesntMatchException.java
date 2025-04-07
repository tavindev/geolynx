package tavindev.core.exceptions;

import tavindev.core.errors.Error;

/**
 * Exception thrown when the password and confirm_password fields don't match during user registration.
 */
public class PasswordDoesntMatchException extends DomainException {
    
    /**
     * Constructs a new PasswordDoesntMatchException with a default message.
     */
    public PasswordDoesntMatchException() {
        super(Error.BAD_REQUEST, "As passwords não coincidem.");
    }
} 