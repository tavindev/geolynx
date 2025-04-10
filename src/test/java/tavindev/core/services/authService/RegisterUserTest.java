package tavindev.core.services.authService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tavindev.core.repositories.UserRepository;
import tavindev.core.entities.*;
import tavindev.core.exceptions.PasswordDoesntMatchException;
import tavindev.core.exceptions.UserAlreadyExistsException;
import tavindev.core.services.AuthService;
import tavindev.infra.dto.RegisterUserDTO;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class RegisterUserTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService userService;

    private RegisterUserDTO createTestRegisterUserDTO() {
        return new RegisterUserDTO(
            "test@example.com",
            "testuser",
            "Test User",
            "123456789",
            "password123",
            "password123",
            "PUBLICO",
            "123456789",
            "987654321",
            "Test Address",
            "Test Employer",
            "Test Job",
            "123456789",
            "ADMIN"
        );
    }

    @Test
    void whenUserExists_ThrowsUserAlreadyExistsException() {
        RegisterUserDTO registerUserDTO = createTestRegisterUserDTO();
        when(userRepository.findByEmail(registerUserDTO.email())).thenReturn(User.empty());

        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.registerUser(registerUserDTO);
        });
    }

    @Test
    void whenUserExists_DoesNotSaveUser() {
        RegisterUserDTO registerUserDTO = createTestRegisterUserDTO();
        when(userRepository.findByEmail(registerUserDTO.email())).thenReturn(User.empty());

        try {
            userService.registerUser(registerUserDTO);
        } catch (UserAlreadyExistsException ignored) {}

        verify(userRepository, never()).save(any());
    }

    @Test
    void whenPasswordsDontMatch_ThrowsPasswordDoesntMatchException() {
        RegisterUserDTO registerUserDTO = new RegisterUserDTO(
                "test@example.com",
                "testuser",
                "Test User",
                "123456789",
                "password123",
                "differentPassword", // Different password
                "photo.jpg",
                "123456789",
                "987654321",
                "Test Address",
                "Test Employer",
                "Test Job",
                "123456789",
                "ADMIN"
        );

        when(userRepository.findByEmail(registerUserDTO.email())).thenReturn(null);

        assertThrows(PasswordDoesntMatchException.class, () -> {
            userService.registerUser(registerUserDTO);
        });
    }

    @Test
    void whenValidData_SavesUserCorrectly() {
        RegisterUserDTO registerUserDTO = createTestRegisterUserDTO();
        when(userRepository.findByEmail(registerUserDTO.email())).thenReturn(null);

        userService.registerUser(registerUserDTO);

        verify(userRepository).save(any());
    }
} 