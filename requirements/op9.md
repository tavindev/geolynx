# OP9: LOGOUT de uma Sessão (SessionLogout)

## Descrição

Esta operação permite que o utilizador realize o **logout** de uma sessão. Após a execução da operação, o servidor revoga o **token** associado à sessão, invalidando-o, mesmo que este ainda estivesse válido. O cliente é redirecionado para uma página de **logout**, onde a informação da sessão desaparece. A partir deste ponto, não será possível realizar operações em nome do utilizador até que ele faça o **login** novamente, obtendo um novo token válido.

---

## Endpoint

```
POST /api/logout
```

---

## Regras de Permissão

- A operação de **logout** pode ser realizada por qualquer utilizador autenticado com um **token válido**.
- Após a execução do logout, o utilizador não poderá realizar qualquer operação até realizar um **novo login**.

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
  "token": "<token_atual>"
}
```

- `token`: O token da sessão atual que será revogado.

---

## Response (200 OK)

```json
{
  "message": "Logout realizado com sucesso. A sessão foi encerrada."
}
```

---

## Response (401 Unauthorized)

```json
{
  "error": "Sessão inválida ou já encerrada."
}
```

---

## Observações

- O token revogado não pode ser reutilizado para realizar novas operações.
- Para realizar novas operações, o utilizador deverá passar por um novo processo de **login** para obter um novo token válido.
