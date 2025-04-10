package tavindev.core.services.strategy;

import tavindev.core.entities.UserRole;

public class UserFilterStrategyFactory {
    public static UserFilterStrategy getStrategy(UserRole role) {
        return switch (role) {
            case ADMIN -> new AdminUserFilterStrategy();
            case BACKOFFICE -> new BackofficeUserFilterStrategy();
            case ENDUSER -> new EndUserFilterStrategy();
            default -> user -> false;
        };
    }
} 