package tavindev.core.authorization.attributeChange.handler;

import tavindev.core.entities.User;
import tavindev.core.exceptions.UnauthorizedException;

public abstract class BaseAttributeChangeHandler implements AttributeChangeAuthorizationHandler {
    private AttributeChangeAuthorizationHandler next;

    @Override
    public AttributeChangeAuthorizationHandler setNext(AttributeChangeAuthorizationHandler next) {
        this.next = next;
        return next;
    }

    @Override
    public void handle(User currentUser, User targetUser, String attributeName) {
        if (canHandle(currentUser, targetUser, attributeName)) {
            doHandle(currentUser, targetUser, attributeName);
        } else if (next != null) {
            next.handle(currentUser, targetUser, attributeName);
        } else {
            throw new UnauthorizedException("Não tem permissão para modificar este atributo.");
        }
    }

    protected abstract boolean canHandle(User currentUser, User targetUser, String attributeName);
    protected abstract void doHandle(User currentUser, User targetUser, String attributeName);
} 