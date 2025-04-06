# OP6: Listar Utilizadores com Contas Registadas (ListUsers)

## Descrição

Esta operação permite listar os utilizadores (contas) registadas na aplicação. Os dados apresentados dependem do `role` do utilizador autenticado.

---

## Endpoint

```
POST /api/list-users
```

---

## Regras de Visualização por Role

- `ENDUSER`:
  - Pode listar utilizadores com `role` igual a `ENDUSER`.
  - Apenas se o **perfil da conta for público** e **estado ATIVADO**.
  - Campos visíveis: `username`, `email`, `nome`.

- `BACKOFFICE`:
  - Pode listar todos os atributos de utilizadores com `role` igual a `ENDUSER`.
  - Visualização **independente** do perfil (público ou privado) e estado da conta.

- `ADMIN`:
  - Pode listar **todos os atributos** de **todos os utilizadores**, **independentemente** do role, perfil ou estado da conta.

---

## Atributos Retornados

Os atributos podem incluir (entre outros):

- `username`
- `email`
- `nome completo`
- `telefone`
- `estado da conta`
- `perfil`
- `role`
- `morada`
- `NIF`
- `entidade empregadora`
- `função`
- `NIF da entidade empregadora`
- `foto`

> Atributos que não estejam preenchidos devem ser retornados com o valor `"NOT DEFINED"`.

---

## Request

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Body (JSON)

```json
{}
```

*Esta operação não necessita de parâmetros no corpo da requisição.*

---

## Response (200 OK)

```json
[
  {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "nome": "John Doe",
    "telefone": "+351912345678",
    "estado": "ATIVADA",
    "perfil": "público",
    "role": "ENDUSER",
    "morada": "Rua das Flores, 123",
    "nif": "123456789",
    "entidade_empregadora": "Empresa X",
    "funcao": "Estudante",
    "nif_entidade_empregadora": "987654321",
    "foto": "NOT DEFINED"
  }
]
```

---

## Response (403 Forbidden)

```json
{
  "error": "Permissões insuficientes para listar utilizadores."
}
```
