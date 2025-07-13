# WorkSheet Controller API Specification

## Overview
The WorkSheet Controller provides REST API endpoints for managing work sheets (folhas de obra) in the GeoLynx system. This controller handles CRUD operations for work sheets, including import, deletion, retrieval, and listing operations.

## Base Path
`/work-sheet`

## Authentication
All endpoints require authentication via session cookie:
- **Cookie Parameter**: `session` (String)
- **Authentication Type**: Session-based token authentication

## Endpoints

### 1. Import/Create/Update Work Sheet

**Endpoint**: `POST /work-sheet/import`

**Description**: Creates a new work sheet or updates an existing one by importing GeoJSON data.

**Request**:
- **Content-Type**: `application/json`
- **Body**: WorkSheet entity (GeoJSON format)

**Request Body Schema**:
```json
{
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": {
      "name": "EPSG:4326"
    }
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": 123,
        "rural_property_id": "PROP001",
        "polygon_id": 456,
        "UI_id": 789,
        "aigp": "AIGP001"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lon1, lat1], [lon2, lat2], ...]]
      }
    }
  ],
  "metadata": {
    "id": 1,
    "starting_date": "2024-01-01",
    "finishing_date": "2024-12-31",
    "issue_date": "2024-01-01",
    "service_provider_id": 100,
    "award_date": "2024-01-01",
    "issuing_user_id": 200,
    "aigp": ["AIGP001", "AIGP002"],
    "posa_code": "POSA001",
    "posa_description": "Description of POSA",
    "posp_code": "POSP001",
    "posp_description": "Description of POSP",
    "operations": [
      {
        "operation_code": "OP001",
        "operation_description": "Operation description",
        "area_ha": 10.5
      }
    ]
  }
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Folha de obra criada/modificada com sucesso."
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 2. Delete Work Sheet

**Endpoint**: `DELETE /work-sheet/{id}`

**Description**: Removes a work sheet by its ID.

**Path Parameters**:
- `id` (Long): The unique identifier of the work sheet to delete

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Folha de obra removida com sucesso."
}
```

**Error Responses**:
- `400 Bad Request`: Invalid work sheet ID
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Work sheet not found
- `500 Internal Server Error`: Server error

---

### 3. Get All Work Sheets

**Endpoint**: `GET /work-sheet/`

**Description**: Retrieves a list of all work sheets accessible to the authenticated user.

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
[
  {
    "id": 1,
    "aigp": ["AIGP001", "AIGP002"],
    "startingDate": "2024-01-01",
    "finishingDate": "2024-12-31",
    "issueDate": "2024-01-01",
    "awardDate": "2024-01-01",
    "serviceProviderId": 100,
    "operations": [
      {
        "operationCode": "OP001",
        "operationDescription": "Operation description",
        "areaHa": 10.5
      }
    ]
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 4. Get Work Sheet by ID

**Endpoint**: `GET /work-sheet/{id}`

**Description**: Retrieves a specific work sheet by its ID.

**Path Parameters**:
- `id` (Long): The unique identifier of the work sheet to retrieve

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**: Complete WorkSheet entity (GeoJSON format)
```json
{
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": {
      "name": "EPSG:4326"
    }
  },
  "features": [...],
  "metadata": {...}
}
```

**Error Responses**:
- `400 Bad Request`: Invalid work sheet ID
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Work sheet not found
- `500 Internal Server Error`: Server error

---

## Data Models

### WorkSheet Entity
The WorkSheet entity follows the GeoJSON FeatureCollection specification with additional metadata:

- **type**: Always "FeatureCollection"
- **crs**: Coordinate Reference System information
- **features**: Array of GeoJSON features representing work areas
- **metadata**: Additional work sheet information including operations and dates

### WorkSheetListResponseDTO
Simplified representation for listing work sheets:
- **id**: Work sheet identifier
- **aigp**: Array of AIGP codes
- **startingDate**: Work start date
- **finishingDate**: Work end date
- **issueDate**: Issue date
- **awardDate**: Award date
- **serviceProviderId**: Service provider identifier
- **operations**: Array of operations with codes, descriptions, and areas

### CreateOrUpdateWorkSheetResponseDTO
Simple response for create/update/delete operations:
- **message**: Success message in Portuguese

## Authorization
All endpoints require valid session authentication. The specific authorization requirements depend on the user's role and the operation being performed.

## Notes
- All dates are expected in ISO 8601 format (YYYY-MM-DD)
- Geographic coordinates should be in WGS84 (EPSG:4326)
- Area measurements are in hectares (ha)
- Error messages are returned in Portuguese
- The API follows RESTful conventions 