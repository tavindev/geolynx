package tavindev.core.authorization;

import tavindev.core.entities.UserRole;
import tavindev.core.entities.Permission;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;
import java.util.HashMap;

/**
 * Manages role permissions and provides methods to check permissions.
 */
public class RolePermissionManager {
    private static final Map<UserRole, Set<Permission>> ROLE_PERMISSIONS = new HashMap<>();

    static {
        // Sheet Manager (SMBO) permissions
        ROLE_PERMISSIONS.put(UserRole.SMBO, EnumSet.of(
            Permission.IMP_FO,
            Permission.EDIT_FO,
            Permission.REM_FO,
            Permission.VIEW_GEN_FO,
            Permission.VIEW_DET_FO,
            Permission.SEARCH_GEN_FO,
            Permission.SEARCH_DET_FO
        ));

        // Sheet General Viewer (SGVBO) permissions
        ROLE_PERMISSIONS.put(UserRole.SGVBO, EnumSet.of(
            Permission.VIEW_GEN_FO,
            Permission.SEARCH_GEN_FO,
            Permission.GENERATE_MONTHLY_REPORT
        ));

        // Sheet Detailed Viewer (SDVBO) permissions
        ROLE_PERMISSIONS.put(UserRole.SDVBO, EnumSet.of(
            Permission.VIEW_DET_FO,
            Permission.SEARCH_DET_FO,
            Permission.VIEW_STATUS_OP_GLOBAL_FE,
            Permission.EXPORT_FE,
            Permission.EDIT_OP_FE,
            Permission.ACCESS_MONITORING_PANEL,
            Permission.ACCESS_EMERGENCY_CONTACTS
        ));

        // Representative (PRBO) permissions
        ROLE_PERMISSIONS.put(UserRole.PRBO, EnumSet.of(
            Permission.CREATE_FE,
            Permission.ASSIGN_OP_FE,
            Permission.VIEW_ACT_OP_FE,
            Permission.VIEW_STATUS_OP_GLOBAL_FE,
            Permission.EDIT_OP_FE,
            Permission.DEFINE_EXECUTION_PLAN,
            Permission.ADD_SPEED_TIME,
            Permission.GET_OPERATION_NOTIFICATIONS
        ));

        // Operator (PO) permissions
        ROLE_PERMISSIONS.put(UserRole.PO, EnumSet.of(
            Permission.START_ACT_OP_FE,
            Permission.STOP_ACT_OP_FE,
            Permission.VIEW_ACT_OP_FE,
            Permission.ADDINFO_ACT_OP_FE,
            Permission.GET_AREA_NOTIFICATIONS,
            Permission.EXECUTE_ACTIVITIES,
            Permission.BE_ASSIGNED
        ));

        // System permissions
        ROLE_PERMISSIONS.put(UserRole.SYSTEM, EnumSet.of(
            Permission.NOTIFY_OUT,
            Permission.NOTIFY_OPER_POLY_END,
            Permission.NOTIFY_OPER_END
        ));
    }

    /**
     * Checks if a role has a specific permission.
     *
     * @param role The role to check
     * @param permission The permission to check for
     * @return true if the role has the permission, false otherwise
     */
    public static boolean hasPermission(UserRole role, Permission permission) {
        Set<Permission> permissions = ROLE_PERMISSIONS.get(role);
        return permissions != null && permissions.contains(permission);
    }

    /**
     * Gets all permissions for a specific role.
     *
     * @param role The role to get permissions for
     * @return Set of permissions for the role
     */
    public static Set<Permission> getPermissions(UserRole role) {
        return ROLE_PERMISSIONS.getOrDefault(role, EnumSet.noneOf(Permission.class));
    }

    /**
     * Checks if a role has all the specified permissions.
     *
     * @param role The role to check
     * @param permissions The permissions to check for
     * @return true if the role has all permissions, false otherwise
     */
    public static boolean hasAllPermissions(UserRole role, Set<Permission> permissions) {
        Set<Permission> rolePermissions = ROLE_PERMISSIONS.get(role);
        return rolePermissions != null && rolePermissions.containsAll(permissions);
    }

    /**
     * Checks if a role has any of the specified permissions.
     *
     * @param role The role to check
     * @param permissions The permissions to check for
     * @return true if the role has any of the permissions, false otherwise
     */
    public static boolean hasAnyPermission(UserRole role, Set<Permission> permissions) {
        Set<Permission> rolePermissions = ROLE_PERMISSIONS.get(role);
        return rolePermissions != null && permissions.stream().anyMatch(rolePermissions::contains);
    }
} 