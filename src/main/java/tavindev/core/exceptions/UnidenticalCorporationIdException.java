package tavindev.core.exceptions;

import tavindev.core.errors.Error;

public class UnidenticalCorporationIdException extends DomainException {
    public UnidenticalCorporationIdException() {
        super(Error.BAD_REQUEST, "Empresas diferentes");
    }
}
