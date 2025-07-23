package tavindev.core.entities;

/**
 * Represents all possible permissions in the system.
 */
public enum Permission {
    // Sheet Manager (SMBO) permissions
    IMP_FO("Upsert work sheets"),
    REM_FO("Remove work sheets and associated executions"),
    VIEW_GEN_FO("View work sheet (generic)"),
    VIEW_DET_FO("View work sheet (detailed)"),
    SEARCH_GEN_FO("Search work sheet (generic)"),
    SEARCH_DET_FO("Search work sheet (detailed)"),
    VIEW_CORPORATION("View corporation"),
    LIST_ALL_CORPORATIONS("List all corporations"),
    ASSIGN_CORPORATION("Assign corporation"),

    // Sheet General Viewer (SGVBO) permissions
    GENERATE_MONTHLY_REPORT("Generate monthly reports (PDF)"),

    // Sheet Detailed Viewer (SDVBO) permissions
    VIEW_STATUS_OP_GLOBAL_FE("View operation status"),
    EXPORT_FE("Export execution sheet"),
    EDIT_OP_FE("Edit operation data (time, duration)"),
    ACCESS_MONITORING_PANEL("Access monitoring panel"),
    ACCESS_EMERGENCY_CONTACTS("Access emergency contacts panel"),

    // Representative (PRBO) permissions
    CREATE_FE("Create execution sheet"),
    ASSIGN_OP_FE("Assign operation/parcel to operators"),
    VIEW_ACT_OP_FE("View operation status in parcel"),
    DEFINE_EXECUTION_PLAN("Define execution plan by areas, machines or operations"),
    ADD_SPEED_TIME("Add speed and estimated execution time"),
    GET_OPERATION_NOTIFICATIONS("Get notified when operations are completed"),

    // Operator (PO) permissions
    START_ACT_OP_FE("Start activity"),
    STOP_ACT_OP_FE("End activity"),
    ADDINFO_ACT_OP_FE("Add photos, GPS, notes to activity"),
    GET_AREA_NOTIFICATIONS("Get notified when leaving area"),
    EXECUTE_ACTIVITIES("Execute and register activities on tablet"),
    BE_ASSIGNED("Be assigned to multiple pairs (operation, parcel)"),

    // System permissions
    NOTIFY_OUT("Notify operator outside area"),
    NOTIFY_OPER_POLY_END("Notify PRBO of operation completion in parcel"),
    NOTIFY_OPER_END("Notify PRBO of total operation completion"),

    // Account Management permissions
    ACTIVATE_ACCOUNT("Activate user accounts"),
    DEACTIVATE_ACCOUNT("Deactivate user accounts"),
    SUSPEND_ACCOUNT("Suspend user accounts"),
    REMOVE_ACCOUNT("Remove user accounts"),
    VIEW_ACCOUNT_STATUS("View account status"),
    VIEW_ACCOUNT_PROFILE("View account profile"),
    CHANGE_OWN_ATTRIBUTES("Change own account attributes"),
    REQUEST_OWN_REMOVAL("Request own account removal"),
    CHANGE_OWN_PROFILE("Change own account profile"),

    LIST_ALL_USERS("List all users"),
    LIST_REGISTERED_USERS("List registered accounts"),
    LIST_ACTIVE_USERS("List active accounts"),
    LIST_DEACTIVATED_USERS("List deactivated accounts"),
    LIST_SUSPENDED_USERS("List suspended accounts"),
    LIST_ACCOUNTS_FOR_REMOVAL("List accounts marked for removal"),
    LIST_PUBLIC_USERS("List public accounts"),
    LIST_PRIVATE_USERS("List private accounts"),
    LIST_USERS_BY_ROLE("List users by role");

    private final String description;

    Permission(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}