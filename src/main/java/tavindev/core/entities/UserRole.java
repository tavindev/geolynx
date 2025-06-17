package tavindev.core.entities;

/**
 * Represents the different roles in the system and their associated permissions.
 */
public enum UserRole {
    /**
     * Sheet Manager - Responsible for managing work sheets
     * Permissions:
     * - IMP-FO: Import work sheets
     * - EDIT-FO: Edit work sheets
     * - REM-FO: Remove work sheets and associated executions
     * - VIEW-GEN-FO: View work sheet (generic)
     * - VIEW-DET-FO: View work sheet (detailed)
     * - SEARCH-GEN-FO: Search work sheet (generic)
     * - SEARCH-DET-FO: Search work sheet (detailed)
     */
    SMBO,

    /**
     * Sheet General Viewer - General progress viewer
     * Permissions:
     * - VIEW-GEN-FO: View work sheet (generic)
     * - SEARCH-GEN-FO: Search work sheet (generic)
     * - Generate monthly reports (PDF)
     */
    SGVBO,

    /**
     * Sheet Detailed Viewer - Detailed execution viewer
     * Permissions:
     * - VIEW-DET-FO: View work sheet (detailed)
     * - SEARCH-DET-FO: Search work sheet (detailed)
     * - VIEW-STATUS-OP-GLOBAL-FE: View operation status
     * - EXPORT-FE: Export execution sheet
     * - EDIT-OP-FE: Edit operation data (time, duration)
     * - Access monitoring panel
     * - Access emergency contacts panel
     */
    SDVBO,

    /**
     * Representative - Service provider representative
     * Permissions:
     * - CREATE-FE: Create execution sheet
     * - ASSIGN-OP-FE: Assign operation/parcel to operators
     * - VIEW-ACT-OP-FE: View operation status in parcel
     * - VIEW-STATUS-OP-GLOBAL-FE: View global operation status
     * - EDIT-OP-FE: Edit operation data (duration, forecast)
     * - Define execution plan by areas, machines or operations
     * - Add speed and estimated execution time
     * - Get notified when operations are completed
     */
    PRBO,

    /**
     * Operator - Field operator who executes operations
     * Permissions:
     * - START-ACT-OP-FE: Start activity
     * - STOP-ACT-OP-FE: End activity
     * - VIEW-ACT-OP-FE: View operation status in parcel
     * - ADDINFO-ACT-OP-FE: Add photos, GPS, notes to activity
     * - Get notified when leaving area (NOTIFY-OUT)
     * - Execute and register activities on tablet
     * - Be assigned to multiple pairs (operation, parcel)
     */
    PO,

    /**
     * System - For automatic operations not linked to a specific role
     * Permissions:
     * - NOTIFY-OUT: Notify operator outside area
     * - NOTIFY-OPER-POLY-END: Notify PRBO of operation completion in parcel
     * - NOTIFY-OPER-END: Notify PRBO of total operation completion
     */
    SYSTEM,

    ENDUSER,
    BACKOFFICE,
    ADMIN,
    PARTNER
} 