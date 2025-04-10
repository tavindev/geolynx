package tavindev.core.repositories;

import tavindev.core.entities.AuthToken;

public interface AuthTokenRepository {
    AuthToken findById(String tokenId);
    void logout(AuthToken authToken);
    void save(AuthToken authToken);
} 