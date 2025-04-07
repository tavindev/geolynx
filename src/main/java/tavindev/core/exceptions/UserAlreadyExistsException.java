package tavindev.core.exceptions;

import tavindev.core.errors.Error;

public class UserAlreadyExistsException extends DomainException {
    public UserAlreadyExistsException() {
        super(Error.CONFLICT, "User already exists");
    }
}
