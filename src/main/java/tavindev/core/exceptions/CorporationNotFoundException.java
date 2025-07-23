package tavindev.core.exceptions;

import tavindev.core.errors.Error;

public class CorporationNotFoundException extends DomainException {
    public CorporationNotFoundException(String identifier) {
      super(Error.NOT_FOUND, "Corporation with identifier " + identifier + " not found");
    }
}
