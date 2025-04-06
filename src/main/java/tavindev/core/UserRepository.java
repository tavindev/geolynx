package tavindev.core;

import tavindev.core.entities.User;

public interface UserRepository {
	User save(User user);
	User findByEmail(String email);
	User findByUsername(String username);
	User findById(String id);
	User findByIdentifier(String identifier);
}
