package tavindev.core.utils;

import jakarta.inject.Inject;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.AuthToken;
import tavindev.core.entities.User;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.repositories.UserRepository;
import tavindev.core.exceptions.AuthTokenNotFoundException;
import tavindev.core.exceptions.UserNotFoundException;

@Service
public class AuthUtils {
    @Inject
    private AuthTokenRepository authTokenRepository;

    @Inject
    private UserRepository userRepository;

    public User validateAndGetUser(String tokenId) {
        AuthToken authToken = authTokenRepository.findById(tokenId);

        if (authToken == null || authToken.isExpired()) {
            throw new AuthTokenNotFoundException();
        }

        User currentUser = userRepository.findById(authToken.getUserId());

        if (currentUser == null) {
            throw new UserNotFoundException(authToken.getUserId());
        }

        return currentUser;
    }
} 