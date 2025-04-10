package tavindev.core.services;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.AuthToken;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.repositories.UserRepository;
import tavindev.core.entities.*;
import tavindev.core.exceptions.*;
import tavindev.infra.dto.login.LoginDTO;
import tavindev.infra.dto.logout.LogoutRequestDTO;
import tavindev.infra.dto.RegisterUserDTO;

import java.util.Optional;

@Service
public class AuthService {
    @Inject
    private UserRepository userRepository;

    @Inject
    private AuthTokenRepository authTokenRepository;

    public AuthToken login(@Valid LoginDTO request) {
        User user = userRepository.findByIdentifier(request.identificador());

        if (user == null) {
            throw new UserNotFoundException(request.identificador());
        }

        if (user.isPasswordInvalid(request.password())) {
            throw new InvalidCredentialsException();
        }
        
        AuthToken authToken = new AuthToken(user.getUsername(), user.getRole());

        authTokenRepository.save(authToken);

        return authToken;
    }

    public void logout(@Valid LogoutRequestDTO request) {
        AuthToken authToken = authTokenRepository.findById(request.token());

        if (authToken == null || authToken.isExpired()) {
            throw new AuthTokenNotFoundException();
        }

        authTokenRepository.logout(authToken);
    }


    public void registerUser(@NotNull @Valid RegisterUserDTO registerUserDTO) {
        User existing = this.userRepository.findByEmail(registerUserDTO.email());

        if (existing != null)
            throw new UserAlreadyExistsException();

        if (registerUserDTO.isPasswordNotMatch()) {
            throw new PasswordDoesntMatchException();
        }

        PersonalInfo personalInfo = new PersonalInfo(
                registerUserDTO.email(),
                registerUserDTO.username(),
                registerUserDTO.fullName(),
                registerUserDTO.phoneNumber(),
                registerUserDTO.password(),
                Optional.of(registerUserDTO.photo())
        );

        IdentificationInfo identificationInfo = new IdentificationInfo(
                Optional.of(registerUserDTO.citizenCardNumber()),
                Optional.of(registerUserDTO.taxNumber()),
                Optional.of(registerUserDTO.address())
        );

        ProfessionalInfo professionalInfo = new ProfessionalInfo(
                Optional.of(registerUserDTO.employer()),
                Optional.of(registerUserDTO.jobTitle()),
                Optional.of(registerUserDTO.employerTaxNumber())
        );

        User user = new User(
                personalInfo,
                identificationInfo,
                professionalInfo,
                UserProfile.valueOf(registerUserDTO.profile()),
                UserRole.ENDUSER,
                AccountStatus.DESATIVADA
        );

        this.userRepository.save(user);
    }

} 