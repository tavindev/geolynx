package tavindev.infra.repositories;

import com.google.cloud.datastore.*;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.AuthToken;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.entities.UserRole;

@Service
public class DatastoreAuthTokenRepository implements AuthTokenRepository {
    private static final String AUTH_TOKEN_KIND = "AuthToken";
    private final Datastore datastore = DatastoreManager.getInstance();

    @Override
    public AuthToken findById(String tokenId) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(AUTH_TOKEN_KIND);
        Key tokenKey = keyFactory.newKey(tokenId);
        Entity tokenEntity = datastore.get(tokenKey);
        
        if (tokenEntity != null) {
            String username = tokenEntity.getString("username");
            UserRole role = UserRole.valueOf(tokenEntity.getString("role"));
            long createdAt = tokenEntity.getLong("createdAt");
            long expiresAt = tokenEntity.getLong("expiresAt");
            
            return new AuthToken(username, role, new AuthToken.TokenData(tokenId, createdAt, expiresAt));
        }

        return null;
    }

    @Override
    public void logout(AuthToken authToken) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(AUTH_TOKEN_KIND);
        Key tokenKey = keyFactory.newKey(authToken.getTokenId());
        datastore.delete(tokenKey);
    }

    @Override
    public void save(AuthToken authToken) {
        KeyFactory keyFactory = datastore.newKeyFactory().setKind(AUTH_TOKEN_KIND);
        Key tokenKey = keyFactory.newKey(authToken.getTokenId());

        Entity tokenEntity = Entity.newBuilder(tokenKey)
            .set("username", authToken.getUsername())
            .set("role", authToken.getUserRole().toString())
            .set("createdAt", authToken.getCreationData())
            .set("expiresAt", authToken.getExpirationData())
            .build();

        datastore.put(tokenEntity);
    }
} 