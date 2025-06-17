package tavindev.core.authorization;

import tavindev.core.entities.User;
import tavindev.core.entities.Permission;
import tavindev.core.exceptions.UnauthorizedException;
import java.util.Set;

/**
 * Handles permission-based authorization for users.
 */
public class PermissionAuthorizationHandler {
    /**
     * Checks if a user has a specific permission.
     *
     * @param user The user to check
     * @param permission The permission to check for
     * @throws UnauthorizedException if the user doesn't have the permission
     */
    public static void checkPermission(User user, Permission permission) {
        if (!RolePermissionManager.hasPermission(user.getRole(), permission)) {
            throw new UnauthorizedException(
                String.format("User %s does not have permission: %s", user.getUsername(), permission.name())
            );
        }
    }

    /**
     * Checks if a user has all the specified permissions.
     *
     * @param user The user to check
     * @param permissions The permissions to check for
     * @throws UnauthorizedException if the user doesn't have all permissions
     */
    public static void checkAllPermissions(User user, Set<Permission> permissions) {
        if (!RolePermissionManager.hasAllPermissions(user.getRole(), permissions)) {
            throw new UnauthorizedException(
                String.format("User %s does not have all required permissions: %s", 
                    user.getUsername(), 
                    permissions.stream().map(Permission::name).toList())
            );
        }
    }

    /**
     * Checks if a user has any of the specified permissions.
     *
     * @param user The user to check
     * @param permissions The permissions to check for
     * @throws UnauthorizedException if the user doesn't have any of the permissions
     */
    public static void checkAnyPermission(User user, Set<Permission> permissions) {
        if (!RolePermissionManager.hasAnyPermission(user.getRole(), permissions)) {
            throw new UnauthorizedException(
                String.format("User %s does not have any of the required permissions: %s", 
                    user.getUsername(), 
                    permissions.stream().map(Permission::name).toList())
            );
        }
    }
} 