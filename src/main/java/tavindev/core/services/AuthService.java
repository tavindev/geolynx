package tavindev.core.services;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.AuthToken;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.entities.*;
import tavindev.core.exceptions.*;
import tavindev.core.exceptions.AccountSuspendedException;
import tavindev.infra.JWTToken;
import tavindev.infra.dto.login.LoginDTO;
import tavindev.infra.repositories.DatastoreUserRepository;
import com.auth0.jwt.interfaces.DecodedJWT;

@Service
public class AuthService {
    @Inject
    private DatastoreUserRepository userRepository;

    @Inject
    private AuthTokenRepository authTokenRepository;

    public AuthToken login(@Valid LoginDTO request) {
        User user = userRepository.findByIdentifier(request.email());

        if (user == null) {
            throw new UserNotFoundException(request.email());
        }

        if (user.isPasswordInvalid(request.password())) {
            throw new InvalidCredentialsException();
        }

        // Check if account is suspended
        if (user.getAccountStatus() == AccountStatus.SUSPENSA) {
            throw new AccountSuspendedException();
        }

        // Check if account is deactivated
        if (user.getAccountStatus() == AccountStatus.DESATIVADA) {
            throw new AccountSuspendedException();
        }

        // Check if account is marked for removal
        if (user.getAccountStatus() == AccountStatus.A_REMOVER) {
            throw new AccountSuspendedException();
        }

        AuthToken authToken = new AuthToken(user.getId(), user.getUsername(), user.getRole());

        authTokenRepository.save(authToken);

        return authToken;
    }

    public void logout(String token) {
        // Decode the token to get the tokenId
        DecodedJWT decodedJWT = JWTToken.extractJWT(token);
        if (decodedJWT == null) {
            throw new AuthTokenNotFoundException();
        }

        String tokenId = decodedJWT.getClaim("id").asString();
        AuthToken authToken = authTokenRepository.findById(tokenId);

        if (authToken == null || authToken.isExpired()) {
            throw new AuthTokenNotFoundException();
        }

        authTokenRepository.logout(authToken);
    }

    private User findUserByIdentifiers(String email, String username) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return userRepository.findByUsername(username);
        }

        return user;
    }

    public User registerUser(User user) {
        User existingUser = findUserByIdentifiers(user.getEmail(), user.getUsername());

        if (existingUser != null)
            throw new UserAlreadyExistsException();

        this.userRepository.save(user);

        return user;
    }

}