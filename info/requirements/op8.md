# OP8: Modificação de Password do Utilizador (ChangePassword)

## Descrição

Esta operação permite ao utilizador modificar a sua password, fornecendo a **password atual** e a **nova password** (com dupla verificação). A mudança de password é permitida apenas para o próprio utilizador, independentemente do `role`.

---

## Endpoint

```
POST /api/user/change-password
```

---

## Regras de Permissão

- A operação pode ser executada apenas pelo utilizador que está a modificar a sua própria senha, independentemente do `role` do utilizador.

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
  "senha_atual": "senha123",
  "nova_senha": "NovaSenha2025!",
  "confirmacao_senha": "NovaSenha2025!"
}
```

- `senha_atual`: A senha atual do utilizador.
- `nova_senha`: A nova senha que o utilizador deseja definir.
- `confirmacao_senha`: A confirmação da nova senha, que deve ser igual à `nova_senha`.

---

## Response (200 OK)

```json
{
  "message": "Password alterada com sucesso."
}
```

---

## Response (400 Bad Request)

```json
{
  "error": "As senhas não coincidem."
}
```

---

## Response (401 Unauthorized)

```json
{
  "error": "Senha atual incorreta."
}
```

---

## Observações

- A nova senha deve seguir os requisitos definidos para a criação de senhas seguras (exemplo: combinação de caracteres alfabéticos, numéricos e sinais de pontuação).
