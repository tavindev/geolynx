package tavindev.core.exceptions;

import tavindev.core.errors.Error;

public class UserNotFoundException extends DomainException {
    public UserNotFoundException(String identifier) {
        super(Error.NOT_FOUND, "User with identifier " + identifier + " not found");
    }
} 