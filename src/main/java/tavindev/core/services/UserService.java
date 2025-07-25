package tavindev.core.services;

import jakarta.inject.Inject;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.*;
import tavindev.core.repositories.AuthTokenRepository;
import tavindev.infra.repositories.DatastoreUserRepository;
import tavindev.core.exceptions.UserNotFoundException;
import tavindev.core.exceptions.UnauthorizedException;
import tavindev.core.utils.AuthUtils;
import tavindev.core.authorization.PermissionAuthorizationHandler;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class UserService {
    @Inject
    private DatastoreUserRepository userRepository;

    @Inject
    private AuthTokenRepository authTokenRepository;

    @Inject
    private AuthUtils authUtils;

    public User getUserInfo(String tokenId) {
        return authUtils.validateAndGetUser(tokenId);
    }

    public List<User> listUsers(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        // Check if user has permission to view user details
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.LIST_ALL_USERS);
        List<User> allUsers = userRepository.findAllUsers();

        return allUsers;
    }

    public List<User> listUsersOfCorporations(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        // Check if user has permission to view user details
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.LIST_ALL_CORPORATION_USERS);
        List<User> allUsers = userRepository.findUsersByCorporationId(currentUser.getCorporationId());

        return allUsers;
    }

    public User getUserById(String tokenId, String userId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to view user details
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_ACCOUNT_PROFILE);

        User targetUser = userRepository.findById(userId);
        if (targetUser == null) {
            throw new UserNotFoundException(userId);
        }

        return targetUser;
    }

    public void changeRole(String tokenId, String identifier, UserRole newRole) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to change roles (SYSADMIN and SYSBO only)
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.REMOVE_ACCOUNT);

        User targetUser = userRepository.findByIdentifier(identifier);

        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        targetUser.setRole(newRole);

        userRepository.save(targetUser);
    }

    public void changeAccountState(String tokenId, String identifier, AccountStatus newState) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to change account states (SYSADMIN and SYSBO
        // only)
        Set<Permission> requiredPermissions = Set.of(
                Permission.ACTIVATE_ACCOUNT,
                Permission.DEACTIVATE_ACCOUNT,
                Permission.SUSPEND_ACCOUNT);
        PermissionAuthorizationHandler.checkAnyPermission(currentUser, requiredPermissions);

        User targetUser = userRepository.findByIdentifier(identifier);
        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        targetUser.setAccountStatus(newState);

        userRepository.save(targetUser);
    }

    public void removeAccount(String tokenId, String identifier) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        User targetUser;

        if (!currentUser.getEmail().equals(identifier) && !currentUser.getUsername().equals(identifier)) {
            // Check if user has permission to remove accounts (SYSADMIN and SYSBO only)
            PermissionAuthorizationHandler.checkPermission(currentUser, Permission.REMOVE_ACCOUNT);
            targetUser = userRepository.findByIdentifier(identifier);

            if (targetUser == null) {
                throw new UserNotFoundException(identifier);
            }
        } else {
            targetUser = currentUser;
        }

        userRepository.delete(targetUser);
    }

    public void changeAttributes(String tokenId, String identifier, Map<String, String> attributes) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to change attributes
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.CHANGE_OWN_ATTRIBUTES);

        User targetUser = userRepository.findByIdentifier(identifier);
        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        // Users can only change their own attributes unless they have admin permissions
        if (!currentUser.getId().equals(targetUser.getId()) &&
                currentUser.getRole() != UserRole.SYSADMIN &&
                currentUser.getRole() != UserRole.SYSBO) {
            throw new UnauthorizedException("Users can only change their own attributes");
        }

        targetUser.setAttributes(attributes);

        userRepository.save(targetUser);
    }

    public void assignCorporation(String tokenId, String identifier, String corporationId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to change attributes
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.ASSIGN_CORPORATION);

        User targetUser = userRepository.findByIdentifier(identifier);
        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        // Only PRBO can be assigned a corporation
        if (targetUser.getRole() != UserRole.PRBO && targetUser.getRole() != UserRole.PO) {
            throw new UnauthorizedException("Only PRBO or PO can be assigned a corporation");
        }

        targetUser.setCorporationId(corporationId);

        userRepository.save(targetUser);
    }

    public void changePassword(String tokenId, String currentPassword, String newPassword) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        if (currentUser.getRole() == UserRole.SYSADMIN || currentUser.getRole() == UserRole.SYSADMIN)
            return;

        // Check if user has permission to change attributes (password is an attribute)
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.CHANGE_OWN_ATTRIBUTES);

        currentUser.setPassword(newPassword);
        userRepository.save(currentUser);
    }

    public void activateAccount(String tokenId, String identifier) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to activate accounts (SYSADMIN and SYSBO only)
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.ACTIVATE_ACCOUNT);

        User targetUser = userRepository.findByIdentifier(identifier);
        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        targetUser.setAccountStatus(AccountStatus.ATIVADA);
        userRepository.save(targetUser);
    }

    public void deactivateAccount(String tokenId, String identifier) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to deactivate accounts (SYSADMIN and SYSBO only)
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.DEACTIVATE_ACCOUNT);

        User targetUser = userRepository.findByIdentifier(identifier);
        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        targetUser.setAccountStatus(AccountStatus.DESATIVADA);
        userRepository.save(targetUser);
    }

    public void suspendAccount(String tokenId, String identifier) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to suspend accounts (SYSADMIN and SYSBO only)
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.SUSPEND_ACCOUNT);

        User targetUser = userRepository.findByIdentifier(identifier);
        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        targetUser.setAccountStatus(AccountStatus.SUSPENSA);
        userRepository.save(targetUser);
    }

    public void requestAccountRemoval(String tokenId, String identifier) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to request account removal
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.REQUEST_OWN_REMOVAL);

        User targetUser = userRepository.findByIdentifier(identifier);
        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        // Users can only request removal of their own account unless they have admin
        // permissions
        if (!currentUser.getId().equals(targetUser.getId()) &&
                currentUser.getRole() != UserRole.SYSADMIN &&
                currentUser.getRole() != UserRole.SYSBO) {
            throw new UnauthorizedException("Users can only request removal of their own account");
        }

        targetUser.setAccountStatus(AccountStatus.A_REMOVER);
        userRepository.save(targetUser);
    }

    public List<User> getAccountsForRemoval(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to list accounts for removal (SYSADMIN and SYSBO
        // only)
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.LIST_ACCOUNTS_FOR_REMOVAL);

        return userRepository.findByAccountStatus(AccountStatus.A_REMOVER);
    }

    public AccountStatus getAccountStatus(String tokenId, String identifier) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to view account status
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_ACCOUNT_STATUS);

        User targetUser = userRepository.findByIdentifier(identifier);
        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        // Users can only see their accountStatus of other accounts with same role
        // unless they have admin permissions
        if (!currentUser.getRole().equals(targetUser.getRole()) &&
                currentUser.getRole() != UserRole.SYSADMIN &&
                currentUser.getRole() != UserRole.SYSBO) {
            throw new UnauthorizedException("Users can only see their own status or equivalent role users");
        }

        return targetUser.getAccountStatus();
    }

    public UserProfile getAccountProfile(String tokenId, String identifier) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to view account profile
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.VIEW_ACCOUNT_PROFILE);

        User targetUser = userRepository.findByIdentifier(identifier);
        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }
        // Users can only see their own profile unless they have admin permissions
        if (!currentUser.getId().equals(targetUser.getId()) &&
                currentUser.getRole() != UserRole.SYSADMIN &&
                currentUser.getRole() != UserRole.SYSBO) {
            throw new UnauthorizedException("Users can only see their own profile");
        }

        return targetUser.getProfile();
    }

    public void changeProfile(String tokenId, String identifier, UserProfile newProfile) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to change profile
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.CHANGE_OWN_PROFILE);

        User targetUser = userRepository.findByIdentifier(identifier);
        if (targetUser == null) {
            throw new UserNotFoundException(identifier);
        }

        // Only RU role can change profile, and only their own profile
        if (targetUser.getRole() != UserRole.RU) {
            throw new UnauthorizedException("Only RU role can change profile");
        }

        // Users can only change their own profile unless they have admin permissions
        if (!currentUser.getId().equals(targetUser.getId()) &&
                currentUser.getRole() != UserRole.SYSADMIN &&
                currentUser.getRole() != UserRole.SYSBO) {
            throw new UnauthorizedException("Users can only change their own profile");
        }

        targetUser.setProfile(newProfile);
        userRepository.save(targetUser);
    }

    public List<User> listRegisteredUsers(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);

        // Check if user has permission to change profile
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.LIST_REGISTERED_USERS);

        UserRole role = currentUser.getRole();

        if (role == UserRole.SYSADMIN || role == UserRole.SYSBO)
            return userRepository.findAllUsers();

        if (role == UserRole.RU)
            return userRepository.findRegisteredUsers();

        return userRepository.findAllRoleUsers(role);

    }

    public List<User> listActiveUsers(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        // Check if user has permission to list active users
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.LIST_ACTIVE_USERS);

        return userRepository.findUsersWithStatus(AccountStatus.ATIVADA);
    }

    public List<User> listDeactivatedUsers(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        // Check if user has permission to list deactivated users
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.LIST_DEACTIVATED_USERS);

        return userRepository.findUsersWithStatus(AccountStatus.DESATIVADA);
    }

    public List<User> listSuspendedUsers(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        // Check if user has permission to list suspended users
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.LIST_SUSPENDED_USERS);

        return userRepository.findUsersWithStatus(AccountStatus.SUSPENSA);
    }

    public List<User> listToRemoveUsers(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        // Check if user has permission to list removable users
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.LIST_ACCOUNTS_FOR_REMOVAL);

        return userRepository.findUsersWithStatus(AccountStatus.A_REMOVER);
    }

    public List<User> listPublicUsers(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        // Check if user has permission to list public users
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.LIST_PUBLIC_USERS);

        return userRepository.findUsersByProfile(UserProfile.PUBLICO);
    }

    public List<User> listPrivateUsers(String tokenId) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        // Check if user has permission to list private users
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.LIST_PRIVATE_USERS);

        return userRepository.findUsersByProfile(UserProfile.PRIVADO);
    }

    public List<User> listUsersByRole(String tokenId, UserRole targetRole) {
        User currentUser = authUtils.validateAndGetUser(tokenId);
        // Check if user has permission to list users by role
        PermissionAuthorizationHandler.checkPermission(currentUser, Permission.LIST_USERS_BY_ROLE);

        return userRepository.findAllRoleUsers(targetRole);
    }

}
