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

import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

@Service
public class AuthService {
    @Inject
    private UserRepository userRepository;

    @Inject
    private AuthTokenRepository authTokenRepository;

    private String orNotDefined(String field) {
        return field != null ? field : "NOT DEFINED";
    }

    public AuthToken login(@Valid LoginDTO request) {
        User user = userRepository.findByIdentifier(request.identificador());

        if (user == null) {
            throw new UserNotFoundException(request.identificador());
        }

        if (user.isPasswordInvalid(request.password())) {
            throw new InvalidCredentialsException();
        }
        
        AuthToken authToken = new AuthToken(user.getId(), user.getUsername(), user.getRole());

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

    private User findUserByIdentifiers(String email, String username) {
       User user = userRepository.findByEmail(email);

       if (user == null) {
           return userRepository.findByUsername(username);
       }

       return user;
    }

    public User registerUser(@NotNull @Valid RegisterUserDTO registerUserDTO) {
        User existingUser = findUserByIdentifiers(registerUserDTO.email(), registerUserDTO.username());

        if (existingUser != null)
            throw new UserAlreadyExistsException();

        if (registerUserDTO.isPasswordNotMatch()) {
            throw new PasswordDoesntMatchException();
        }

        PersonalInfo personalInfo = new PersonalInfo(
                registerUserDTO.email(),
                registerUserDTO.username(),
                registerUserDTO.nome_completo(),
                registerUserDTO.telefone(),
                registerUserDTO.password()
        );

        IdentificationInfo identificationInfo = new IdentificationInfo(
                orNotDefined(registerUserDTO.cartao_cidadao()),
                orNotDefined(registerUserDTO.nif()),
                orNotDefined(registerUserDTO.morada())
        );

        ProfessionalInfo professionalInfo = new ProfessionalInfo(
                orNotDefined(registerUserDTO.entidade_empregadora()),
                orNotDefined(registerUserDTO.funcao()),
                orNotDefined(registerUserDTO.nif_entidade_empregadora())
        );

        User user = new User(
                personalInfo,
                identificationInfo,
                professionalInfo,
                UserProfile.valueOf(registerUserDTO.perfil()),
                UserRole.ENDUSER,
                AccountStatus.DESATIVADA
        );

        this.userRepository.save(user);

        return user;
    }

} 