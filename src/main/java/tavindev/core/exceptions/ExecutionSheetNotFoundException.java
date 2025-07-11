package tavindev.core.exceptions;

import tavindev.core.errors.Error;

public class ExecutionSheetNotFoundException extends DomainException {
	public ExecutionSheetNotFoundException(String message) {
		super(Error.NOT_FOUND, message);
	}
}