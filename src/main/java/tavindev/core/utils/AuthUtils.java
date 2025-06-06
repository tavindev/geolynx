package tavindev.core.utils;

import jakarta.inject.Inject;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.AuthToken;
import tavindev.core.entities.User;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.repositories.UserRepository;
import tavindev.core.exceptions.AuthTokenNotFoundException;
import tavindev.core.exceptions.UserNotFoundException;
import tavindev.infra.JWTToken;
import com.auth0.jwt.interfaces.DecodedJWT;

@Service
public class AuthUtils {
    @Inject
    private AuthTokenRepository authTokenRepository;

    @Inject
    private UserRepository userRepository;

    public User validateAndGetUser(String jwtToken) {
        // First validate the JWT token
        if (!JWTToken.validateJWT(jwtToken)) {
            throw new AuthTokenNotFoundException();
        }

        // Extract the AuthToken ID from the JWT claims
        DecodedJWT decodedJWT = JWTToken.extractJWT(jwtToken);
        if (decodedJWT == null) {
            throw new AuthTokenNotFoundException();
        }

        String tokenId = decodedJWT.getClaim("id").asString();
        if (tokenId == null) {
            throw new AuthTokenNotFoundException();
        }

        // Now find the AuthToken in the database
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