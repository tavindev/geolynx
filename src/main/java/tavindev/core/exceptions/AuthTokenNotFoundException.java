package tavindev.core.exceptions;

import tavindev.core.errors.Error;

public class AuthTokenNotFoundException extends DomainException {
  public AuthTokenNotFoundException() {
    super(Error.BAD_REQUEST, "Sessão inválida ou já encerrada.");
  }
} 