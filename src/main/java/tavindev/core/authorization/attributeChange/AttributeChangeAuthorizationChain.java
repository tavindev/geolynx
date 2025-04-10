package tavindev.core.authorization.attributeChange;

import jakarta.inject.Singleton;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.authorization.attributeChange.handler.AdminAttributeChangeHandler;
import tavindev.core.authorization.attributeChange.handler.AttributeChangeAuthorizationHandler;
import tavindev.core.authorization.attributeChange.handler.BackOfficeAttributeChangeHandler;
import tavindev.core.authorization.attributeChange.handler.EndUserAttributeChangeHandler;
import tavindev.core.entities.User;

@Singleton
@Service
public class AttributeChangeAuthorizationChain {
    private final AttributeChangeAuthorizationHandler chain;
    
    public AttributeChangeAuthorizationChain() {
        AttributeChangeAuthorizationHandler endUserHandler = new EndUserAttributeChangeHandler();
        AttributeChangeAuthorizationHandler backOfficeHandler = new BackOfficeAttributeChangeHandler();
        AttributeChangeAuthorizationHandler adminHandler = new AdminAttributeChangeHandler();

        this.chain = endUserHandler.setNext(backOfficeHandler).setNext(adminHandler);
    }

    public void handle(User currentUser, User targetUser, String attributeName) {
        chain.handle(currentUser, targetUser, attributeName);
    }
} 