package tavindev.infra.repositories;

import org.jvnet.hk2.annotations.Service;
import tavindev.core.AuthToken;
import tavindev.core.UserRepository;
import tavindev.core.entities.User;

@Service
public class FirebaseUserRepository implements UserRepository {
    @Override
    public void save(User user) {
    }

    @Override
    public User findByEmail(String email) {
        return null;
    }

    @Override
    public User findByIdentifier(String identifier) {
        return null;
    }

    @Override
    public AuthToken findAuthTokenByTokenId(String tokenId) {
        return null;
    }

    @Override
    public void logout(AuthToken authToken) {

    }
}
