package tavindev.core.exceptions;

import tavindev.core.errors.Error;

public class InvalidCredentialsException extends DomainException {
    public InvalidCredentialsException() {
        super(Error.UNAUTHORIZED, "Invalid credentials");
    }
} 