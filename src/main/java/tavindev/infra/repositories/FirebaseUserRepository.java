package tavindev.infra.repositories;

import org.jvnet.hk2.annotations.Service;
import tavindev.core.UserRepository;
import tavindev.core.entities.User;

@Service
public class FirebaseUserRepository implements UserRepository {
    @Override
    public User save(User user) {
        return null;
    }

    @Override
    public User findByEmail(String email) {
        return null;
    }

    @Override
    public User findByUsername(String username) {
        return null;
    }

    @Override
    public User findById(String id) {
        return null;
    }

    @Override
    public User findByIdentifier(String identifier) {
        return null;
    }
}
