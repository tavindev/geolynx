# OP2: Login

## Descrição

Esta operação permite a **autenticação de um utilizador** através de uma chamada REST (método `POST`). O utilizador fornece um **identificador** (por exemplo, *username* ou *email*) e uma **password**. Se as credenciais forem válidas, o servidor devolve um **token de sessão** com informações relevantes sobre o utilizador autenticado e a validade da sessão.

---

## Endpoint

```
POST /api/user/login
```

---

## Request

### Headers

```http
Content-Type: application/json
```

### Body (JSON)

```json
{
  "identificador": "utilizador@example.com",
  "password": "minhaPassword123"
}
```

- `identificador`: Pode ser um `username`, `UserID` ou `email`.
- `password`: Palavra-passe do utilizador.

---

## Response (200 OK)

Se a autenticação for bem-sucedida, a resposta incluirá um **token de sessão** com os seguintes atributos:

```json
{
  "token": {
    "user": "utilizador@example.com",
    "role": "ADMIN",
    "validity": {
      "valid_from": "2025-04-06T10:00:00Z",
      "valid_to": "2025-04-06T12:00:00Z",
      "verificador": "2f3f1d7b9a..."
    }
  }
}
```

### Atributos do Token

- `USER`: Identificador do utilizador autenticado.
- `ROLE`: Papel/código de role do utilizador.
- `VALIDITY`:
    - `VALID_FROM`: Data/hora de início da validade (gerada pelo servidor).
    - `VALID_TO`: Data/hora de expiração da sessão.
    - `VERIFICADOR`: Valor aleatório (ex: hash ou UUID) que garante a autenticidade do token.

> A forma como o `VERIFICADOR` é gerado é **definida pela implementação**, podendo ser um número aleatório, um hash, um JWT claim adicional, etc.

---

## Response (401 Unauthorized)

```json
{
  "error": "Credenciais inválidas"
}
```

---

## Comportamento após Login

- Se o login for bem-sucedido, o utilizador será redirecionado para uma **página de boas-vindas**.
- A página exibe:
    - O papel (*ROLE*) do utilizador autenticado.
    - A lista de operações permitidas de acordo com o papel.

---

## Notas de Implementação

- O `VERIFICADOR` pode ser usado como uma **prova de que o token foi emitido pelo servidor**.
- Este token pode ser incluído nos headers das próximas requisições (ex: `Authorization: Bearer <token>`).
- A expiração da sessão (`VALID_TO`) deve ser verificada em cada operação subsequente.

