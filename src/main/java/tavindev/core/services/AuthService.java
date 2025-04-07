package tavindev.core.services;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.AuthToken;
import tavindev.core.UserRepository;
import tavindev.core.entities.User;
import tavindev.core.exceptions.AuthTokenNotFoundException;
import tavindev.core.exceptions.InvalidCredentialsException;
import tavindev.core.exceptions.UserAlreadyExistsException;
import tavindev.core.exceptions.UserNotFoundException;
import tavindev.infra.dto.LoginDTO;
import tavindev.infra.dto.LogoutRequestDTO;

@Service
public class AuthService {
    @Inject
    private UserRepository userRepository;

    public AuthToken login(@Valid LoginDTO request) {
        // Try to find user by email or username
        User user = userRepository.findByIdentifier(request.identificador());

        if (user == null) {
            throw new UserNotFoundException(request.identificador());
        }

        if (user.isPasswordInvalid(request.password())) {
            throw new InvalidCredentialsException();
        }

        return new AuthToken(user.getUsername(), user.getRole());
    }

    public void logout(@Valid LogoutRequestDTO request) {
        AuthToken authToken = userRepository.findAuthTokenByTokenId(request.token());

        if (authToken == null || authToken.isExpired()) {
            throw new AuthTokenNotFoundException();
        }

        userRepository.logout(authToken);
    }
} 