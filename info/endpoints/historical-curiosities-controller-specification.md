# HistoricalCuriosities Controller API Specification

## Overview
The HistoricalCuriosities Controller provides REST API endpoints for managing historical curiosities in the GeoLynx system. This controller handles the creation and retrieval of historical curiosities based on geographic location, allowing users to discover interesting historical facts about specific areas.

## Base Path
`/historical-curiosities`

## Authentication
All endpoints require authentication via session cookie:
- **Cookie Parameter**: `session` (String)
- **Authentication Type**: Session-based token authentication

## Endpoints

### 1. Create Historical Curiosity

**Endpoint**: `POST /historical-curiosities/`

**Description**: Creates a new historical curiosity with geographic coordinates and description.

**Request**:
- **Content-Type**: `application/json`
- **Body**: HistoricalCuriosity entity

**Request Body Schema**:
```json
{
  "curiosityDescription": "This is where the ancient Roman aqueduct once stood, providing water to the entire city during the 2nd century AD.",
  "lat": 387654321,
  "long": -912345678
}
```

**Request Body Fields**:
- **curiosityDescription** (String, required): A detailed description of the historical curiosity or interesting fact about the location
- **lat** (Long, required): Latitude coordinate in microdegrees (multiply decimal degrees by 1,000,000)
- **long** (Long, required): Longitude coordinate in microdegrees (multiply decimal degrees by 1,000,000)

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "curiosityDescription": "This is where the ancient Roman aqueduct once stood, providing water to the entire city during the 2nd century AD.",
  "latitude": 387654321,
  "longitude": -912345678,
  "createdAt": "2024-01-15T10:30:00",
  "geohash": "ezs42e44yx96"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data or missing required fields
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 2. Get Historical Curiosities by Geohash

**Endpoint**: `GET /historical-curiosities/nearby`

**Description**: Retrieves historical curiosities within a specific geographic area using geohash.

**Request**:
- **Method**: GET
- **Query Parameters**:
  - **geohash** (String, required): Geohash string representing the geographic area

**Example Request**:
```
GET /historical-curiosities/nearby?geohash=ezs42e44yx96
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "curiosityDescription": "This is where the ancient Roman aqueduct once stood, providing water to the entire city during the 2nd century AD.",
    "latitude": 387654321,
    "longitude": -912345678,
    "createdAt": "2024-01-15T10:30:00",
    "geohash": "ezs42e44yx96"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "curiosityDescription": "Site of the medieval castle that protected the city from Moorish invasions in the 12th century.",
    "latitude": 387654322,
    "longitude": -912345679,
    "createdAt": "2024-01-15T11:45:00",
    "geohash": "ezs42e44yx96"
  }
]
```

**Error Responses**:
- `400 Bad Request`: Invalid geohash parameter
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

## Data Models

### HistoricalCuriosity Entity
The main entity representing a historical curiosity:

- **id** (String): Unique identifier (UUID, auto-generated)
- **curiosityDescription** (String): Detailed description of the historical curiosity
- **latitude** (Long): Latitude coordinate in microdegrees
- **longitude** (Long): Longitude coordinate in microdegrees
- **createdAt** (LocalDateTime): Timestamp when the curiosity was created (auto-generated)
- **geohash** (String): Geohash string for geographic indexing (auto-generated)

### Coordinate System
- **Format**: Microdegrees (multiply decimal degrees by 1,000,000)
- **Example**: 38.7654321° latitude becomes `387654321`
- **Reference System**: WGS84 (EPSG:4326)

### Geohash System
- **Purpose**: Geographic indexing for efficient location-based queries
- **Format**: Base32 encoded string
- **Precision**: Configurable based on geohash length
- **Example**: `ezs42e44yx96` represents a specific geographic area

## Authorization
All endpoints require valid session authentication. Specific authorization requirements depend on the user's role:
- **PRBO**: Can create and view historical curiosities
- **PO**: Can view historical curiosities
- **SDVBO**: Can create and view historical curiosities

## Usage Examples

### Creating a Historical Curiosity
```bash
curl -X POST http://localhost:8080/historical-curiosities/ \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your-session-token" \
  -d '{
    "curiosityDescription": "Ancient Roman temple ruins discovered in 1985 during road construction.",
    "lat": 387654321,
    "long": -912345678
  }'
```

### Retrieving Nearby Curiosities
```bash
curl -X GET "http://localhost:8080/historical-curiosities/nearby?geohash=ezs42e44yx96" \
  -H "Cookie: session=your-session-token"
```

## Notes
- All timestamps are in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)
- Geographic coordinates use microdegrees for precision
- Geohash is automatically generated based on coordinates
- The API follows RESTful conventions
- Error messages are returned in Portuguese
- Historical curiosities are immutable once created
- Geohash-based queries provide efficient geographic filtering 