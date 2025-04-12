package tavindev.core.exceptions;

import tavindev.core.errors.Error;

public class BadRequestException extends DomainException {
    public BadRequestException(String message) {
        super(Error.BAD_REQUEST, message);
    }
} 