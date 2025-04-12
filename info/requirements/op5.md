# OP5: Remoção de Contas de Utilizadores (RemoveUserAccount)

## Descrição

Esta operação permite remover uma conta de utilizador da aplicação, desde que respeite os critérios de autorização definidos pelo `role` do utilizador que realiza a operação.

---

## Endpoint

```
POST /api/user/remove
```

---

## Regras de Permissão

- `ADMIN`:
  - Pode remover **qualquer conta**, fornecendo `userID` ou `email`.

- `BACKOFFICE`:
  - Pode remover contas apenas se estas tiverem `role` igual a `ENDUSER` ou `PARTNER`.

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
  "identificador": "gvwchevrand@gmail.com"
}
```

- `identificador`: Pode ser o `username`, `userID`, ou `email` do utilizador a ser removido.

---

## Response (200 OK)

```json
{
  "message": "Conta removida com sucesso.",
  "identificador": "utilizador123"
}
```

---

## Response (403 Forbidden)

```json
{
  "error": "Permissões insuficientes para remover esta conta."
}
```

---

## Response (404 Not Found)

```json
{
  "error": "Utilizador não encontrado."
}
```
