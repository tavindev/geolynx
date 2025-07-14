# ExecutionSheet Controller API Specification

## Overview
The ExecutionSheet Controller provides REST API endpoints for managing execution sheets (folhas de execução) in the GeoLynx system. This controller handles the complete lifecycle of execution sheets, including creation, operation assignment, activity management, status monitoring, and export functionality.

## Base Path
`/execution-sheet`

## Authentication
All endpoints require authentication via session cookie:
- **Cookie Parameter**: `session` (String)
- **Authentication Type**: Session-based token authentication

## Endpoints

### 1. Create Execution Sheet

**Endpoint**: `POST /execution-sheet/`

**Description**: Creates a new execution sheet associated with a work sheet.

**Request**:
- **Content-Type**: `application/json`
- **Body**: ExecutionSheet entity

**Request Body Schema**:
```json
{
  "id": 1,
  "workSheetId": 100,
  "startingDate": "2024-01-01",
  "finishingDate": "2024-12-31",
  "lastActivityDate": "2024-01-01",
  "observations": "Observações sobre a folha de execução",
  "operations": [
    {
      "operationCode": "OP001",
      "areaHaExecuted": 5.5,
      "areaPerc": 55.0,
      "startingDate": "2024-01-01",
      "finishingDate": "2024-01-15",
      "observations": "Observações da operação",
      "plannedCompletionDate": "2024-01-15",
      "estimatedDurationHours": 40
    }
  ],
  "polygonsOperations": [
    {
      "polygonId": 1,
      "operations": [
        {
          "operationId": 1,
          "status": "pending",
          "startingDate": null,
          "finishingDate": null,
          "lastActivityDate": null,
          "observations": "",
          "tracks": [],
          "operatorId": null
        }
      ]
    }
  ]
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Folha de execução criada com sucesso."
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data or missing work sheet association
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 2. Assign Operation to Operator

**Endpoint**: `POST /execution-sheet/assign-operation`

**Description**: Assigns a specific operation in a polygon to an operator.

**Request**:
- **Content-Type**: `application/json`
- **Body**: AssignOperationDTO

**Request Body Schema**:
```json
{
  "executionSheetId": 1,
  "polygonId": 1,
  "operationId": 1,
  "operatorId": 100
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Operação atribuída com sucesso ao operador."
}
```

**Error Responses**:
- `400 Bad Request`: Invalid parameters or operation not found
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 3. Start Activity

**Endpoint**: `POST /execution-sheet/start-activity`

**Description**: Starts an activity for a specific operation in a polygon.

**Request**:
- **Content-Type**: `application/json`
- **Body**: StartActivityDTO

**Request Body Schema**:
```json
{
  "executionSheetId": 1,
  "polygonId": 1,
  "operationId": 1
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Atividade iniciada com sucesso."
}
```

**Error Responses**:
- `400 Bad Request`: Invalid parameters, operation not found, or invalid status
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions or operator mismatch
- `500 Internal Server Error`: Server error

---

### 4. Stop Activity

**Endpoint**: `POST /execution-sheet/stop-activity`

**Description**: Stops/completes an activity for a specific operation in a polygon.

**Request**:
- **Content-Type**: `application/json`
- **Body**: StopActivityDTO

**Request Body Schema**:
```json
{
  "executionSheetId": 1,
  "polygonId": 1,
  "operationId": 1
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Atividade terminada com sucesso."
}
```

**Error Responses**:
- `400 Bad Request`: Invalid parameters, operation not found, or invalid status
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions or operator mismatch
- `500 Internal Server Error`: Server error

---

### 5. View Activity Status

**Endpoint**: `POST /execution-sheet/view-activity`

**Description**: Retrieves the current status and details of a specific operation in a polygon.

**Request**:
- **Content-Type**: `application/json`
- **Body**: ViewActivityDTO

**Request Body Schema**:
```json
{
  "executionSheetId": 1,
  "polygonId": 1,
  "operationId": 1
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Estado da operação obtido com sucesso.",
  "operationDetail": {
    "operationId": 1,
    "status": "ongoing",
    "startingDate": "2024-01-01",
    "finishingDate": null,
    "lastActivityDate": "2024-01-01",
    "observations": "Observações da atividade",
    "tracks": [
      {
        "type": "LineString",
        "coordinates": [[lon1, lat1], [lon2, lat2]]
      }
    ],
    "operatorId": 100
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid parameters or operation not found
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 6. View Global Status

**Endpoint**: `POST /execution-sheet/view-status-global`

**Description**: Retrieves the global status of an operation across all polygons in an execution sheet.

**Request**:
- **Content-Type**: `application/json`
- **Body**: ViewStatusGlobalDTO

**Request Body Schema**:
```json
{
  "executionSheetId": 1,
  "operationId": 1
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Estado global da operação obtido com sucesso.",
  "operationCode": "OP001",
  "globalStatus": "ongoing",
  "polygonStatuses": [
    {
      "polygonId": 1,
      "status": "ongoing",
      "startingDate": "2024-01-01",
      "finishingDate": null,
      "lastActivityDate": "2024-01-01",
      "observations": "Observações",
      "operatorId": 100
    },
    {
      "polygonId": 2,
      "status": "completed",
      "startingDate": "2024-01-01",
      "finishingDate": "2024-01-15",
      "lastActivityDate": "2024-01-15",
      "observations": "Concluído",
      "operatorId": 101
    }
  ]
}
```

**Error Responses**:
- `400 Bad Request`: Invalid parameters or operation not found
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 7. Edit Operation

**Endpoint**: `POST /execution-sheet/edit-operation`

**Description**: Edits operation details such as planned completion date, estimated duration, and observations.

**Request**:
- **Content-Type**: `application/json`
- **Body**: EditOperationDTO

**Request Body Schema**:
```json
{
  "executionSheetId": 1,
  "operationId": 1,
  "plannedCompletionDate": "2024-01-15",
  "estimatedDurationHours": 40,
  "observations": "Observações atualizadas da operação"
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Dados da operação editados com sucesso."
}
```

**Error Responses**:
- `400 Bad Request`: Invalid parameters or operation not found
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 8. Export Execution Sheet

**Endpoint**: `POST /execution-sheet/export`

**Description**: Exports a complete execution sheet with all its data for external systems.

**Request**:
- **Content-Type**: `application/json`
- **Body**: ExportExecutionSheetDTO

**Request Body Schema**:
```json
{
  "executionSheetId": 1
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Folha de execução exportada com sucesso.",
  "executionSheet": {
    "id": 1,
    "workSheetId": 100,
    "startingDate": "2024-01-01",
    "finishingDate": "2024-12-31",
    "lastActivityDate": "2024-01-01",
    "observations": "Observações",
    "operations": [...],
    "polygonsOperations": [...]
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid execution sheet ID
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Execution sheet not found
- `500 Internal Server Error`: Server error

---

### 9. Get Execution Sheet by ID

**Endpoint**: `GET /execution-sheet/{id}`

**Description**: Retrieves a specific execution sheet by its ID.

**Path Parameters**:
- `id` (Long): The unique identifier of the execution sheet to retrieve

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**: Complete ExecutionSheet entity
```json
{
  "id": 1,
  "workSheetId": 100,
  "startingDate": "2024-01-01",
  "finishingDate": "2024-12-31",
  "lastActivityDate": "2024-01-01",
  "observations": "Observações",
  "operations": [...],
  "polygonsOperations": [...]
}
```

**Error Responses**:
- `400 Bad Request`: Invalid execution sheet ID
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Execution sheet not found
- `500 Internal Server Error`: Server error

---

## Data Models

### ExecutionSheet Entity
The main entity representing an execution sheet:

- **id**: Unique identifier
- **workSheetId**: Associated work sheet ID (required)
- **startingDate**: Execution start date
- **finishingDate**: Execution end date
- **lastActivityDate**: Last activity timestamp
- **observations**: General observations
- **operations**: List of operations with execution details
- **polygonsOperations**: List of polygon-specific operations

### Operation Status Values
- **pending**: Operation is waiting to be assigned
- **assigned**: Operation is assigned to an operator
- **ongoing**: Operation is currently being executed
- **completed**: Operation has been completed

### Global Status Values
- **pending**: All operations are pending
- **ongoing**: At least one operation is ongoing
- **completed**: All operations are completed
- **mixed**: Operations have different statuses

### Track Entity
GPS tracking data for operations:
- **type**: Geometry type (usually "LineString")
- **coordinates**: Array of [longitude, latitude] pairs

## Authorization
All endpoints require valid session authentication. Specific authorization requirements depend on the user's role:
- **PRBO**: Can create, assign operations, and view global status
- **PO**: Can start/stop activities and view assigned operations
- **SDVBO**: Can edit operations and export execution sheets

## Notes
- All dates are expected in ISO 8601 format (YYYY-MM-DD)
- Geographic coordinates should be in WGS84 (EPSG:4326)
- Area measurements are in hectares (ha)
- Error messages are returned in Portuguese
- The API follows RESTful conventions
- Operation status transitions: pending → assigned → ongoing → completed 