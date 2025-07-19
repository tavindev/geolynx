package tavindev.core.exceptions;

import tavindev.core.errors.Error;

public class AccountSuspendedException extends DomainException {
  public AccountSuspendedException() {
    super(Error.FORBIDDEN, "Conta suspensa. Não é possível fazer login.");
  }
}