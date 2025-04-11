package tavindev.core.services.strategy;

import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.entities.UserProfile;
import tavindev.core.entities.AccountStatus;

public class EndUserFilterStrategy implements UserFilterStrategy {
    @Override
    public boolean shouldInclude(User user) {
        return user.getRole() == UserRole.ENDUSER && 
               user.getProfile() == UserProfile.PUBLICO &&
               user.getAccountStatus() == AccountStatus.ATIVADA;
    }
} 