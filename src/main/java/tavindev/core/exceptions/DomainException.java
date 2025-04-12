package tavindev.core.exceptions;

import tavindev.core.errors.Error;

public abstract class DomainException extends RuntimeException {
    private final Error error;
    private final String message;

    public DomainException(Error error, String message) {
        super(message);
        this.error = error;
        this.message = message;
    }

    public Error getErrorCode() {
        return error;
    }

    @Override
    public String getMessage() {
        return message;
    }
} 