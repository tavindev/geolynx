package tavindev.core.services.authService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tavindev.core.entities.AuthToken;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.repositories.UserRepository;
import tavindev.core.entities.UserRole;
import tavindev.core.exceptions.AuthTokenNotFoundException;
import tavindev.core.services.AuthService;
import tavindev.infra.dto.logout.LogoutRequestDTO;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LogoutTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthTokenRepository authTokenRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    void whenTokenIsNotFound_ShouldThrowException() {
        when(authTokenRepository.findById(anyString())).thenReturn(null);

        assertThrows(AuthTokenNotFoundException.class, () -> {
            authService.logout(new LogoutRequestDTO("invalidToken"));
        });
    }

		@Test
		void whenTokenIsFound_ShouldLogout() {
            AuthToken token = new AuthToken("testUser", UserRole.ENDUSER);
            when(authTokenRepository.findById(anyString())).thenReturn(token);

			authService.logout(new LogoutRequestDTO(token.getTokenId()));

			verify(authTokenRepository).logout(token);
		}

		@Test
		void whenTokenIsExpired_ShouldThrowException() {
			AuthToken token = new AuthToken("testUser", UserRole.ENDUSER, new AuthToken.TokenData(
                    "id",
                    System.currentTimeMillis(),
                    System.currentTimeMillis() - 1000
            ));
			when(authTokenRepository.findById(anyString())).thenReturn(token);

			assertThrows(AuthTokenNotFoundException.class, () -> {
				authService.logout(new LogoutRequestDTO(token.getTokenId()));
			});
		}
   
}
