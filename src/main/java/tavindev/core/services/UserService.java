package tavindev.core.services;

import jakarta.inject.Inject;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.infra.repositories.DatastoreUserRepository;
import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.entities.AccountStatus;
import tavindev.core.exceptions.UserNotFoundException;
import tavindev.core.exceptions.InvalidCredentialsException;
import tavindev.core.utils.AuthUtils;

import java.util.List;
import java.util.Map;

@Service
public class UserService {
    @Inject
    private DatastoreUserRepository userRepository;

    @Inject
    private AuthTokenRepository authTokenRepository;

    @Inject
    private AuthUtils authUtils;

    public List<User> listUsers(String tokenId) {
        List<User> allUsers = userRepository.findAllUsers();

        return allUsers;
    }

    public void changeRole(String tokenId, String username, UserRole newRole) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        User targetUser = userRepository.findByUsername(username);

        if (targetUser == null) {
            throw new UserNotFoundException(username);
        }

        targetUser.setRole(newRole);

        userRepository.save(targetUser);
    }

    public void changeAccountState(String tokenId, String username, AccountStatus newState) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        User targetUser = userRepository.findByUsername(username);
        if (targetUser == null) {
            throw new UserNotFoundException(username);
        }

        targetUser.setAccountStatus(newState);

        userRepository.save(targetUser);
    }

    public void removeAccount(String tokenId, String identifier) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        User targetUser = userRepository.findByIdentifier(identifier);

        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        userRepository.delete(targetUser);
    }

    public void changeAttributes(String tokenId, String identifier, Map<String, String> attributes) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        User targetUser = userRepository.findByIdentifier(identifier);
        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        targetUser.setAttributes(attributes);

        userRepository.save(targetUser);
    }

    public void changePassword(String tokenId, String currentPassword, String newPassword) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        currentUser.setPassword(newPassword);
        userRepository.save(currentUser);
    }
}
