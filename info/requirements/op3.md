# OP3: Mudança de Role de Utilizador (ChangeRole)

## Descrição

Esta operação permite alterar o **papel (role)** de um utilizador existente, respeitando as permissões associadas ao utilizador autenticado que executa a operação.

---

## Endpoint

```
POST /api/change-role
```

---

## Regras de Permissão

- `BACKOFFICE`:
    - Pode alterar o `role` de um utilizador de `ENDUSER` para `PARTNER`, ou vice-versa.
- `ADMIN`:
    - Pode alterar o `role` de qualquer utilizador para qualquer outro role.
- `ENDUSER`:
    - **Não tem permissão** para alterar qualquer role.

---

## Request

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Body (JSON)

```json
{
  "username": "utilizador123",
  "novo_role": "PARTNER"
}
```

- `username`: Identificador do utilizador a ser modificado.
- `novo_role`: Novo valor de role a ser atribuído (`ENDUSER`, `PARTNER`, `BACKOFFICE`, `ADMIN`).

---

## Response (200 OK)

```json
{
  "message": "Role atualizado com sucesso.",
  "username": "utilizador123",
  "novo_role": "PARTNER"
}
```

---

## Response (403 Forbidden)

```json
{
  "error": "Permissões insuficientes para alterar o role deste utilizador."
}
```

---

## Response (404 Not Found)

```json
{
  "error": "Utilizador não encontrado."
}
```

