package pt.fct.adc.exceptions;

/**
 * Exception thrown when the password and confirm_password fields don't match during user registration.
 */
public class PasswordDoesntMatchException extends RuntimeException {
    
    /**
     * Constructs a new PasswordDoesntMatchException with a default message.
     */
    public PasswordDoesntMatchException() {
        super("As passwords não coincidem.");
    }

    /**
     * Constructs a new PasswordDoesntMatchException with the specified detail message.
     *
     * @param message the detail message
     */
    public PasswordDoesntMatchException(String message) {
        super(message);
    }
} 