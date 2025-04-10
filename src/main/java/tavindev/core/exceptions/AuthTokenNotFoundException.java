package tavindev.core.exceptions;

import tavindev.core.errors.Error;

public class AuthTokenNotFoundException extends DomainException {
  public AuthTokenNotFoundException() {
    super(Error.FORBIDDEN, "Sessão inválida ou já encerrada.");
  }
} 