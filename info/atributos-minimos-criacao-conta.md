# Atributos Mínimos Necessários para Criação de Conta no Sistema ADC

Este documento especifica os **atributos mínimos obrigatórios** para registrar uma conta no sistema, com base nas roles previstas.

---

## Atributos Comuns (para todos os perfis aplicáveis)

| Campo     | Tipo     | Exemplo               | Observações |
|-----------|----------|------------------------|-------------|
| `UserID`  | Integer  | `100`                 | Identificador único do usuário |
| `UNAME`   | String   | `nickname`, `hj`      | Nome de usuário |
| `EMAIL`   | Email    | `hj@fct.unl.pt`       | Endereço de email válido (RFC 899) |
| `PWD`     | String   | `hashed_base64_pwd`   | Senha (hash + base64) |

---

## Requisitos por Role

### ADLU (Adherent Landowner User)
Mesmos 4 atributos comuns.

### RU (Registered User)
Mesmos 4 atributos comuns.

### PO (Partner Operator)
| Campo     | Tipo     | Exemplo               |
|-----------|----------|------------------------|
| `UserID`  | Integer  | `100`                 |
| `UNAME`   | String   | `hj`                  |
| `EMAIL`   | Email    | `hj@fct.unl.pt`       |
| `PWD`     | String   | `hashed_base64_pwd`   |
| `NOME`    | String   | `António Santos`      |
| `PARTNER` | String   | `Empresa XYZ`         |
| `PHONE1`  | String   | `+351 217982630`      |

### SYSBO / SMBO / SGVBO / SDVBO / PRBO
Estes roles requerem **todos os atributos completos** para ativação:
- UserID
- UNAME
- EMAIL
- PWD
- NOME
- PN (País de Nacionalidade)
- PR (País de Residência)
- END (Endereço)
- ENDCP (Código Postal)
- PHONE1
- NIF
- CC
- CCDE
- CCLE
- CCV
- DNASC

> As contas criadas ficam inicialmente no modo `INATIVO`
