package tavindev.core;

import tavindev.core.entities.User;

public interface UserRepository {
	void save(User user);
	User findByEmail(String email);
	User findByIdentifier(String identifier);
	AuthToken findAuthTokenByTokenId(String tokenId);
	void logout(AuthToken authToken);
}
