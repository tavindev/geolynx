package tavindev.core.services;

import jakarta.inject.Inject;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.core.repositories.UserRepository;
import tavindev.core.authorization.roleChange.RoleChangeAuthorizationChain;
import tavindev.core.authorization.accountState.AccountStateChangeAuthorizationChain;
import tavindev.core.authorization.accountRemoval.AccountRemovalAuthorizationChain;
import tavindev.core.authorization.attributeChange.AttributeChangeAuthorizationChain;
import tavindev.core.entities.User;
import tavindev.core.entities.UserRole;
import tavindev.core.entities.AccountStatus;
import tavindev.core.exceptions.UserNotFoundException;
import tavindev.core.exceptions.InvalidCredentialsException;
import tavindev.core.services.strategy.UserFilterStrategy;
import tavindev.core.services.strategy.UserFilterStrategyFactory;
import tavindev.core.utils.AuthUtils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Inject
    private UserRepository userRepository;

    @Inject
    private AuthTokenRepository authTokenRepository;

    @Inject
    private RoleChangeAuthorizationChain roleChangeAuthorizationChain;

    @Inject
    private AccountStateChangeAuthorizationChain accountStateChangeAuthorizationChain;

    @Inject
    private AccountRemovalAuthorizationChain accountRemovalAuthorizationChain;

    @Inject
    private AttributeChangeAuthorizationChain attributeChangeAuthorizationChain;

    @Inject
    private AuthUtils authUtils;

    public List<User> listUsers(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        List<User> allUsers = userRepository.findAllUsers();
        UserFilterStrategy filterStrategy = UserFilterStrategyFactory.getStrategy(currentUser.getRole());

        return allUsers.stream()
            .filter(filterStrategy::shouldInclude)
            .collect(Collectors.toList());
    }

    public void changeRole(String tokenId, String username, UserRole newRole) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        User targetUser = userRepository.findByUsername(username);
        if (targetUser == null) {
            throw new UserNotFoundException(username);
        }

        this.roleChangeAuthorizationChain.handle(currentUser, targetUser, newRole);

        userRepository.updateRole(targetUser, newRole);
    }

    public void changeAccountState(String tokenId, String username, AccountStatus newState) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        User targetUser = userRepository.findByUsername(username);
        if (targetUser == null) {
            throw new UserNotFoundException(username);
        }

        this.accountStateChangeAuthorizationChain.handle(currentUser, targetUser, newState);
        
        userRepository.updateAccountState(targetUser, newState);
    }

    public void removeAccount(String tokenId, String identifier) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        User targetUser = userRepository.findByIdentifier(identifier);

        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        this.accountRemovalAuthorizationChain.handle(currentUser, targetUser);
        
        userRepository.delete(targetUser);
    }

    public void changeAttributes(String tokenId, String identifier, Map<String, String> attributes) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        User targetUser = userRepository.findByIdentifier(identifier);
        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        // Check authorization for each attribute
        for (String attributeName : attributes.keySet()) {
            attributeChangeAuthorizationChain.handle(currentUser, targetUser, attributeName);
        }

        userRepository.updateAttributes(targetUser, attributes);
    }

    public void changePassword(String tokenId, String currentPassword, String newPassword) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        if (currentUser.isPasswordInvalid(currentPassword)) {
            throw new InvalidCredentialsException();
        }

        userRepository.updatePassword(currentUser, newPassword);
    }
}
