package tavindev.core.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tavindev.core.entities.AuthToken;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.repositories.UserRepository;
import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.exceptions.AuthTokenNotFoundException;
import tavindev.core.exceptions.UserNotFoundException;
import tavindev.core.authorization.UserFactory;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ChangeRoleTest {

    @Mock
    private AuthTokenRepository authRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;


    @Test
    void whenTokenNotFound_ShouldThrowAuthTokenNotFoundException() {
        when(authRepository.findById(anyString())).thenReturn(null);

        assertThrows(AuthTokenNotFoundException.class, () -> {
            userService.changeRole("invalidToken", "targetUser", UserRole.ADMIN);
        });
    }

    @Test
    void whenTokenExpired_ShouldThrowAuthTokenNotFoundException() {
        AuthToken expiredToken = new AuthToken("testUser", UserRole.ADMIN, new AuthToken.TokenData(
                "id",
                System.currentTimeMillis(),
                System.currentTimeMillis() - 1000
        ));
        when(authRepository.findById(anyString())).thenReturn(expiredToken);

        assertThrows(AuthTokenNotFoundException.class, () -> {
            userService.changeRole("expiredToken", "targetUser", UserRole.ADMIN);
        });
    }

    @Test
    void whenCurrentUserNotFound_ShouldThrowUserNotFoundException() {
        AuthToken validToken = new AuthToken("currentUser", UserRole.ADMIN);
        when(authRepository.findById(anyString())).thenReturn(validToken);
        when(userRepository.findByUsername("currentUser")).thenReturn(null);

        assertThrows(UserNotFoundException.class, () -> {
            userService.changeRole("validToken", "targetUser", UserRole.ADMIN);
        });
    }

    @Test
    void whenTargetUserNotFound_ShouldThrowUserNotFoundException() {
        AuthToken validToken = new AuthToken("currentUser", UserRole.ADMIN);
        User currentUser = UserFactory.createAdminUser("currentUser");

        when(authRepository.findById(anyString())).thenReturn(validToken);
        when(userRepository.findByUsername("currentUser")).thenReturn(currentUser);
        when(userRepository.findByUsername("targetUser")).thenReturn(null);

        assertThrows(UserNotFoundException.class, () -> {
            userService.changeRole("validToken", "targetUser", UserRole.ADMIN);
        });
    }
} 