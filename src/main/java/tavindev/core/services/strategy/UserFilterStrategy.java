package tavindev.core.services.strategy;

import tavindev.core.entities.User;

public interface UserFilterStrategy {
    boolean shouldInclude(User user);
} 