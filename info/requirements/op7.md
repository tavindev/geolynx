# OP7: Modificação de Atributos de Contas de Utilizadores (ChangeAccountAttributes)

## Descrição

Esta operação permite modificar os atributos de contas de utilizadores. A modificação dos atributos é permitida de acordo com o `role` do utilizador que realiza a operação.

---

## Endpoint

```
POST /api/user/change-attributes
```

---

## Regras de Permissão

- `ENDUSER`:
  - Pode modificar **todos os atributos** da própria conta ou adicionar informações de **atributos não definidos**.
  - Não pode alterar:
    - `Username` (ou `UserID`)
    - `Email`
    - `Nome`
    - Atributos de controle como `ROLE` e `ESTADO`.

- `BACKOFFICE` (conta ativada):
  - Pode modificar **todos os atributos** de contas `ENDUSER` ou `PARTNER`, ou adicionar informações de **atributos não definidos**.
  - Não pode alterar:
    - `Username` (ou `UserID`)
    - `Email`

- `ADMIN`:
  - Pode modificar **todos os atributos** de qualquer conta, independentemente do `ROLE` do utilizador.
  - Pode adicionar informações de **atributos não definidos** em contas de qualquer `ROLE`.
  - Pode modificar atributos de controle como:
    - `ROLE`
    - `ESTADO`

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
  "identificador": "utilizador123",
  "atributos": {
    "nome": "Novo Nome",
    "telefone": "+351912345678",
    "morada": "Nova Morada",
    "foto": "url_da_nova_foto.jpg"
  }
}
```

- `identificador`: Pode ser o `username`, `userID`, ou `email` do utilizador cujos atributos serão alterados.
- `atributos`: Os atributos a serem modificados ou adicionados, como `nome`, `telefone`, `foto`, etc.

---

## Response (200 OK)

```json
{
  "message": "Atributos da conta modificados com sucesso.",
  "identificador": "utilizador123"
}
```

---

## Response (403 Forbidden)

```json
{
  "error": "Permissões insuficientes para modificar os atributos da conta."
}
```

---

## Response (404 Not Found)

```json
{
  "error": "Utilizador não encontrado."
}
```

---

## Observações

- A operação `ChangeAccountAttributes` deve garantir que apenas os utilizadores com permissões adequadas possam alterar os atributos de contas.
- Alterações de `ROLE` ou `ESTADO` só podem ser feitas por um utilizador com `role ADMIN`.
