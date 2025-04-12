package tavindev.core.repositories;

import tavindev.core.entities.AccountStatus;
import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import java.util.List;
import java.util.Map;

public interface UserRepository {
	void save(User user);
	void delete(User user);
	User findById(String id);
	User findByEmail(String email);
	User findByUsername(String username);
	User findByIdentifier(String identifier);
	void updateRole(User user, UserRole newRole);
	void updateAccountState(User user, AccountStatus accountStatus);
	void updateAttributes(User user, Map<String, String> attributes);
	void updatePassword(User user, String newPassword);
	List<User> findAllUsers();
}
