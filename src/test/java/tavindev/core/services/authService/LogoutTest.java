package tavindev.core.services.authService;

import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tavindev.core.AuthToken;
import tavindev.core.UserRepository;
import tavindev.core.entities.UserRole;
import tavindev.core.exceptions.AuthTokenNotFoundException;
import tavindev.core.services.AuthService;
import tavindev.infra.dto.LogoutRequestDTO;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LogoutTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    void whenTokenIsNotFound_ShouldThrowException() {
        when(userRepository.findAuthTokenByTokenId(anyString())).thenReturn(null);

        assertThrows(AuthTokenNotFoundException.class, () -> {
            authService.logout(new LogoutRequestDTO("invalidToken"));
        });
    }

		@Test
		void whenTokenIsFound_ShouldLogout() {
            AuthToken token = new AuthToken("testUser", UserRole.ENDUSER);
            when(userRepository.findAuthTokenByTokenId(anyString())).thenReturn(token);

			authService.logout(new LogoutRequestDTO(token.getTokenId()));

			verify(userRepository).logout(token);
		}

		@Test
		void whenTokenIsExpired_ShouldThrowException() {
			AuthToken token = new AuthToken("testUser", UserRole.ENDUSER, new AuthToken.TokenData(
                    "id",
                    System.currentTimeMillis(),
                    System.currentTimeMillis() - 1000
            ));
			when(userRepository.findAuthTokenByTokenId(anyString())).thenReturn(token);

			assertThrows(AuthTokenNotFoundException.class, () -> {
				authService.logout(new LogoutRequestDTO(token.getTokenId()));
			});
		}
   
}
