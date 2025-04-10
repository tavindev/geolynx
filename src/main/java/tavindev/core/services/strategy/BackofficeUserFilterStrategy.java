package tavindev.core.services.strategy;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;

public class BackofficeUserFilterStrategy implements UserFilterStrategy {
    @Override
    public boolean shouldInclude(User user) {
        return user.getRole() == UserRole.ENDUSER; // Backoffice can only see ENDUSERs
    }
} 