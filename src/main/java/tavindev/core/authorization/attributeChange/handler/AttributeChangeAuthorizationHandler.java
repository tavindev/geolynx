package tavindev.core.authorization.attributeChange.handler;

import tavindev.core.entities.User;

public interface AttributeChangeAuthorizationHandler {
    void handle(User currentUser, User targetUser, String attributeName);
    AttributeChangeAuthorizationHandler setNext(AttributeChangeAuthorizationHandler next);
} 