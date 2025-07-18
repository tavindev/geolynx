package tavindev.core.services;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.AuthToken;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.entities.*;
import tavindev.core.exceptions.*;
import tavindev.infra.dto.login.LoginDTO;
import tavindev.infra.repositories.DatastoreUserRepository;

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

        AuthToken authToken = new AuthToken(user.getId(), user.getUsername(), user.getRole());

        authTokenRepository.save(authToken);

        return authToken;
    }

    public void logout(String token) {
        AuthToken authToken = authTokenRepository.findById(token);

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