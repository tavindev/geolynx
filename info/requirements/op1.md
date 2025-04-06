# OP1: Criação e Registo de Contas de Utilizadores

## Descrição

Esta operação permite o **registo e criação de até 4 contas de utilizadores** na aplicação através de uma chamada REST (método `POST`). Deve ser demonstrada a possibilidade de registo de utilizadores, incluindo um conjunto de atributos obrigatórios e opcionais, como descrito abaixo.

---

## Endpoint

```
POST /api/user/register
```

---

## Atributos Obrigatórios

Durante o registo, os seguintes atributos são obrigatórios:

- `email`: Email do utilizador no formato `<string>@<string>.<dom>`  
  Exemplo: `petermurphy3456@campus.fct.unl.pt`
- `username`: Nome de utilizador ou nickname  
  Exemplo: `petermurphy3456`
- `nome_completo`: Nome completo do utilizador  
  Exemplo: `Manuel Francisco da Silva Marques`
- `telefone`: Número de telefone  
  Exemplo: `+3512895629`
- `password`: Palavra-passe com confirmação  
  Deve conter letras maiúsculas e minúsculas, números e sinais de pontuação  
  Exemplo: `2025adcAVALind!!!`
- `confirmar_password`: Confirmação da palavra-passe (deve ser igual à anterior)
- `perfil`: Pode ser `público` ou `privado`

---

## Atributos Adicionais (Opcionais no Registo, Atualizáveis Posteriormente)

- `cartao_cidadao`: Número do cartão de cidadão
- `role`: Papel do utilizador (`ENDUSER`, `BACKOFFICE`, `ADMIN`, `PARTNER`)
- `nif`: Número de identificação fiscal do utilizador
- `entidade_empregadora`: Nome da empresa ou entidade empregadora  
  Exemplo: `Smart Forest S.A.`
- `funcao`: Cargo ou função do utilizador  
  Exemplo: `Professor`, `Estudante`, `Gerente`, `Técnico de Floresta`
- `morada`: Endereço completo  
  Exemplo: `Rua dos alunos de APDC2324, No 100, Piso 2, Porta 116`
- `nif_entidade_empregadora`: Número de identificação fiscal da entidade empregadora  
  Exemplo: `177888999`
- `estado_conta`: Estado atual da conta (`ATIVADA`, `SUSPENSA`, `DESATIVADA`)

### Atributos Adicionais Valorativos

- `foto`: Imagem de perfil no formato JPEG

---

## Regras Iniciais Pós-Criação

- Todas as contas criadas têm por padrão:
    - `ROLE`: `enduser`
    - `estado_conta`: `DESATIVADA`
- A modificação do `ROLE` só pode ser feita por utilizadores com `ROLE` igual a `backoffice` ou `admin`.

---

## Conta Inicial de Administração

Durante o **deployment** da aplicação, deverá ser criada automaticamente uma conta com os seguintes dados:

```json
{
  "username": "root",
  "email": "root@admin.com",
  "nome_completo": "Administrador do Sistema",
  "telefone": "+351900000000",
  "password": "RootAdmin123!",
  "perfil": "privado",
  "role": "ADMIN",
  "estado_conta": "ATIVADA"
}
```

Esta conta serve como ponto de entrada para a administração do sistema.

---

## Request

### Headers

```http
Content-Type: application/json
```

### Body (JSON)

```json
{
  "email": "utilizador@example.com",
  "username": "utilizador123",
  "nome_completo": "João Maria Santos",
  "telefone": "+351912345678",
  "password": "Exemplo123!",
  "confirmar_password": "Exemplo123!",
  "perfil": "publico"
}
```

---

## Response (201 Created)

```json
{
  "message": "Conta criada com sucesso.",
  "usuario": {
    "username": "utilizador123",
    "email": "utilizador@example.com",
    "estado_conta": "DESATIVADA",
    "role": "enduser"
  }
}
```

---

## Response (400 Bad Request)

```json
{
  "error": "As passwords não coincidem."
}

ou

{
  "error": "Email inválido."
}
```