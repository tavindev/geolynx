# User Controller API Specification

## Overview
The User Controller provides REST API endpoints for managing user accounts and profiles in the GeoLynx system. This controller handles comprehensive user management operations including account creation, role management, status changes, profile updates, and user listing with various filtering options.

## Base Path
`/user`

## Authentication
All endpoints require authentication via session cookie:
- **Cookie Parameter**: `session` (String)
- **Authentication Type**: Session-based token authentication

## Endpoints

### 1. Get User Information

**Endpoint**: `GET /user`

**Description**: Retrieves basic information about the currently authenticated user.

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "id": 123,
  "role": "ADMIN",
  "fullName": "João Silva"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing session token
- `500 Internal Server Error`: Server error

---

### 2. Change User Role

**Endpoint**: `POST /user/change-role`

**Description**: Changes the role of a specified user account.

**Request**:
- **Content-Type**: `application/json`
- **Body**: ChangeRoleDTO

**Request Body Schema**:
```json
{
  "username": "joao.silva",
  "novo_role": "OPERATOR"
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Role alterado com sucesso.",
  "username": "joao.silva",
  "novo_role": "OPERATOR"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data or role value
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 3. Change Account State

**Endpoint**: `POST /user/change-account-state`

**Description**: Changes the account status of a specified user.

**Request**:
- **Content-Type**: `application/json`
- **Body**: ChangeAccountStateDTO

**Request Body Schema**:
```json
{
  "username": "joao.silva",
  "novo_estado": "ACTIVE"
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Estado da conta alterado com sucesso.",
  "username": "joao.silva",
  "novo_estado": "ACTIVE"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data or status value
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 4. Remove User Account

**Endpoint**: `POST /user/remove`

**Description**: Permanently removes a user account from the system.

**Request**:
- **Content-Type**: `application/json`
- **Body**: RemoveUserAccountDTO

**Request Body Schema**:
```json
{
  "identificador": "joao.silva"
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Conta removida com sucesso.",
  "identificador": "joao.silva"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 5. List All Users

**Endpoint**: `GET /user/all`

**Description**: Retrieves a list of all users in the system.

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
[
  {
    "id": 123,
    "username": "joao.silva",
    "email": "joao.silva@example.com",
    "role": "OPERATOR",
    "status": "ACTIVE",
    "profile": "PUBLIC",
    "personalInfo": {
      "fullName": "João Silva",
      "phoneNumber": "+351 123 456 789"
    },
    "professionalInfo": {
      "company": "Empresa ABC",
      "position": "Operador"
    }
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 6. Change User Attributes

**Endpoint**: `POST /user/change-attributes`

**Description**: Updates specific attributes of a user account.

**Request**:
- **Content-Type**: `application/json`
- **Body**: ChangeAttributesDTO

**Request Body Schema**:
```json
{
  "identificador": "joao.silva",
  "atributos": {
    "email": "novo.email@example.com",
    "phoneNumber": "+351 987 654 321"
  }
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Atributos alterados com sucesso.",
  "identificador": "joao.silva"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 7. Change Password

**Endpoint**: `POST /user/change-password`

**Description**: Changes the password of the currently authenticated user.

**Request**:
- **Content-Type**: `application/json`
- **Body**: ChangePasswordDTO

**Request Body Schema**:
```json
{
  "senha_atual": "password123",
  "nova_senha": "newpassword456",
  "confirmar_senha": "newpassword456"
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Senha alterada com sucesso."
}
```

**Error Responses**:
- `400 Bad Request`: Passwords don't match or invalid request data
- `401 Unauthorized`: Invalid or missing session token
- `500 Internal Server Error`: Server error

---

### 8. Activate Account

**Endpoint**: `POST /user/activate`

**Description**: Activates a deactivated user account.

**Request**:
- **Content-Type**: `application/json`
- **Body**: ActivateAccountDTO

**Request Body Schema**:
```json
{
  "identificador": "joao.silva"
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Conta ativada com sucesso.",
  "identificador": "joao.silva"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 9. Deactivate Account

**Endpoint**: `POST /user/deactivate`

**Description**: Deactivates an active user account.

**Request**:
- **Content-Type**: `application/json`
- **Body**: DeactivateAccountDTO

**Request Body Schema**:
```json
{
  "identificador": "joao.silva"
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Conta desativada com sucesso.",
  "identificador": "joao.silva"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 10. Suspend Account

**Endpoint**: `POST /user/suspend`

**Description**: Suspends a user account temporarily.

**Request**:
- **Content-Type**: `application/json`
- **Body**: SuspendAccountDTO

**Request Body Schema**:
```json
{
  "identificador": "joao.silva"
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Conta suspensa com sucesso.",
  "identificador": "joao.silva"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 11. Request Account Removal

**Endpoint**: `POST /user/request-removal`

**Description**: Requests the removal of a user account.

**Request**:
- **Content-Type**: `application/json`
- **Body**: RequestRemovalDTO

**Request Body Schema**:
```json
{
  "identificador": "joao.silva"
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Pedido de remoção criado com sucesso.",
  "identificador": "joao.silva"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 12. Get Accounts for Removal

**Endpoint**: `POST /user/accounts-for-removal`

**Description**: Retrieves a list of accounts that have requested removal.

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
[
  {
    "id": 123,
    "username": "joao.silva",
    "email": "joao.silva@example.com",
    "role": "OPERATOR",
    "status": "PENDING_REMOVAL",
    "profile": "PUBLIC"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 13. Get Account Status

**Endpoint**: `POST /user/account-status`

**Description**: Retrieves the current status of a specific user account.

**Request**:
- **Content-Type**: `application/json`
- **Body**: AccountStatusDTO

**Request Body Schema**:
```json
{
  "identificador": "joao.silva"
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Estado da conta obtido com sucesso.",
  "identificador": "joao.silva",
  "status": "ACTIVE"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 14. Get Account Profile

**Endpoint**: `POST /user/account-profile`

**Description**: Retrieves the profile type of a specific user account.

**Request**:
- **Content-Type**: `application/json`
- **Body**: AccountProfileDTO

**Request Body Schema**:
```json
{
  "identificador": "joao.silva"
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Perfil da conta obtido com sucesso.",
  "identificador": "joao.silva",
  "profile": "PUBLIC"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 15. Change Account Profile

**Endpoint**: `POST /user/change-profile`

**Description**: Changes the profile type of a user account.

**Request**:
- **Content-Type**: `application/json`
- **Body**: ChangeProfileDTO

**Request Body Schema**:
```json
{
  "identificador": "joao.silva",
  "novo_perfil": "PRIVATE"
}
```

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**:
```json
{
  "message": "Perfil alterado com sucesso.",
  "identificador": "joao.silva",
  "novo_perfil": "PRIVATE"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request data or profile value
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 16. List Registered Users

**Endpoint**: `GET /user/list-accs/registered`

**Description**: Retrieves a list of all registered users.

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**: Array of UserDTO objects

**Error Responses**:
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 17. List Active Users

**Endpoint**: `GET /user/list-accs/active`

**Description**: Retrieves a list of all active users.

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**: Array of UserDTO objects

**Error Responses**:
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 18. List Deactivated Users

**Endpoint**: `GET /user/list-accs/deactivated`

**Description**: Retrieves a list of all deactivated users.

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**: Array of UserDTO objects

**Error Responses**:
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 19. List Users for Removal

**Endpoint**: `GET /user/list-accs/removable`

**Description**: Retrieves a list of users marked for removal.

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**: Array of UserDTO objects

**Error Responses**:
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 20. List Suspended Users

**Endpoint**: `GET /user/list-accs/suspended`

**Description**: Retrieves a list of all suspended users.

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**: Array of UserDTO objects

**Error Responses**:
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 21. List Public Users

**Endpoint**: `GET /user/list-accs/public`

**Description**: Retrieves a list of users with public profiles.

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**: Array of UserDTO objects

**Error Responses**:
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 22. List Private Users

**Endpoint**: `GET /user/list-accs/private`

**Description**: Retrieves a list of users with private profiles.

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**: Array of UserDTO objects

**Error Responses**:
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

### 23. List Users by Role

**Endpoint**: `GET /user/list-accs/{role}`

**Description**: Retrieves a list of users filtered by a specific role.

**Path Parameters**:
- `role` (String): The role to filter by (e.g., "ADMIN", "OPERATOR", "PARTNER")

**Response**:
- **Status**: 200 OK
- **Content-Type**: `application/json`

**Response Body**: Array of UserDTO objects

**Error Responses**:
- `400 Bad Request`: Invalid role parameter
- `401 Unauthorized`: Invalid or missing session token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server error

---

## Data Models

### UserDTO
Complete user information for listing operations:
- **id**: Unique user identifier
- **username**: User's login username
- **email**: User's email address
- **role**: User's role in the system
- **status**: Current account status
- **profile**: User's profile type
- **personalInfo**: Personal information object
- **professionalInfo**: Professional information object

### UserInfoDTO
Basic user information for current user:
- **id**: Unique user identifier
- **role**: User's role in the system
- **fullName**: User's full name

### Account Status Values
- **ACTIVE**: Account is active and can be used
- **INACTIVE**: Account is inactive
- **SUSPENDED**: Account is temporarily suspended
- **PENDING_REMOVAL**: Account is marked for removal
- **DEACTIVATED**: Account has been deactivated

### User Role Values
- **ADMIN**: Administrator with full system access
- **OPERATOR**: Operator with limited access
- **PARTNER**: Partner with specific permissions
- **PRBO**: Planning and Budget Responsible Operator
- **PO**: Planning Operator
- **SDVBO**: Service Development and Validation Budget Operator

### User Profile Values
- **PUBLIC**: Public profile visible to all users
- **PRIVATE**: Private profile with restricted visibility

## Authorization
All endpoints require valid session authentication. Specific authorization requirements depend on the user's role:
- **ADMIN**: Full access to all user management operations
- **Other roles**: Limited access based on role permissions
- **Self-management**: Users can change their own password and view their own information

## Notes
- All user identifiers can be either username or email
- Password changes require current password verification
- Account status changes follow a specific workflow
- User listing endpoints support various filtering options
- Error messages are returned in Portuguese
- The API follows RESTful conventions
- Session tokens are required for all operations 