package tavindev.core.exceptions;

import tavindev.core.errors.Error;

public class UnauthorizedException extends DomainException {
    public UnauthorizedException(String message) {
        super(Error.FORBIDDEN, message);
    }
} 