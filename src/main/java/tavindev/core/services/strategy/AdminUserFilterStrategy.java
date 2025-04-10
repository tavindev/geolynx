package tavindev.core.services.strategy;

import tavindev.core.entities.User;

public class AdminUserFilterStrategy implements UserFilterStrategy {
    @Override
    public boolean shouldInclude(User user) {
        return true; // Admins can see all users
    }
} 