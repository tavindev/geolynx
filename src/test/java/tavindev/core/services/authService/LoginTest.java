package tavindev.core.services.authService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tavindev.core.entities.AuthToken;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.repositories.UserRepository;
import tavindev.core.entities.User;
import tavindev.core.exceptions.InvalidCredentialsException;
import tavindev.core.exceptions.UserNotFoundException;
import tavindev.core.services.AuthService;
import tavindev.infra.dto.login.LoginDTO;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class LoginTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthTokenRepository authTokenRepository;

    @InjectMocks
    private AuthService authService;

    private LoginDTO createTestLoginDTO() {
        return new LoginDTO(
            "test@example.com",
            "password123"
        );
    }

    private User createTestUser() {
        return User.empty();
    }

    @Test
    void whenValidCredentials_ReturnsToken() {
        User testUser = createTestUser();
        LoginDTO loginDTO = new LoginDTO(
            testUser.personalInfo().email(),
            testUser.personalInfo().password()
        );
        when(userRepository.findByIdentifier(loginDTO.identificador())).thenReturn(testUser);

        AuthToken result = authService.login(loginDTO);

        assertInstanceOf(AuthToken.class, result);
    }

    @Test
    void whenInvalidEmail_ThrowsUserNotFoundException() {
        LoginDTO loginDTO = createTestLoginDTO();
        when(userRepository.findByIdentifier(loginDTO.identificador())).thenReturn(null);

        assertThrows(UserNotFoundException.class, () -> {
            authService.login(loginDTO);
        });
    }

    @Test
    void whenInvalidPassword_ThrowsInvalidCredentialsException() {
        LoginDTO loginDTO = new LoginDTO("test@example.com", "wrongpassword");
        User testUser = createTestUser();
        when(userRepository.findByIdentifier(loginDTO.identificador())).thenReturn(testUser);

        assertThrows(InvalidCredentialsException.class, () -> {
            authService.login(loginDTO);
        });
    }
}
