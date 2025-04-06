# OP4: Mudança de Estado de Conta (ChangeAccountState)

## Descrição

Esta operação permite alterar o **estado da conta** de um utilizador entre os estados permitidos: `ATIVADA` e `DESATIVADA`. A alteração está sujeita às permissões atribuídas ao `role` do utilizador que realiza a operação.

---

## Endpoint

```
POST /api/user/change-account-state
```

---

## Regras de Permissão

- `ADMIN`:
    - Pode mudar o estado de **qualquer conta**, de **qualquer estado** para **qualquer outro estado**.

- `BACKOFFICE`:
    - Pode mudar o estado de contas de:
        - `DESATIVADA` para `ATIVADA`
        - `ATIVADA` para `DESATIVADA`

---

## Estados Possíveis

- `ATIVADA`
- `DESATIVADA`

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
  "novo_estado": "ATIVADA"
}
```

- `username`: Identificador do utilizador a ser modificado.
- `novo_estado`: Novo estado desejado para a conta (`ATIVADA` ou `DESATIVADA`).

---

## Response (200 OK)

```json
{
  "message": "Estado da conta atualizado com sucesso.",
  "username": "utilizador123",
  "novo_estado": "ATIVADA"
}
```

---

## Response (403 Forbidden)

```json
{
  "error": "Permissões insuficientes para alterar o estado desta conta."
}
```

---

## Response (404 Not Found)

```json
{
  "error": "Utilizador não encontrado."
}
```

