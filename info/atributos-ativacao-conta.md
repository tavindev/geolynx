# Atributos Obrigatórios para Ativação de Conta no Sistema ADC

Este documento especifica os **atributos obrigatórios** para que uma conta possa ser **ativada** no sistema ADC. Todos os campos abaixo devem estar devidamente preenchidos conforme a role do utilizador.

---

## SYSBO, SMBO, SGVBO, SDVBO, PRBO

> Requerem **todos os campos abaixo**:

| Campo     | Tipo     | Exemplo                             |
|-----------|----------|-------------------------------------|
| `UserID`  | Integer  | `100`                               |
| `UNAME`   | String   | `hj`                                |
| `EMAIL`   | Email    | `hj@fct.unl.pt`                     |
| `PWD`     | String   | `hashed_base64_pwd`                 |
| `NOME`    | String   | `António José dos Santos Sydney`    |
| `PN`      | String   | `Portugal`                          |
| `PR`      | String   | `Portugal`                          |
| `END`     | String   | `Rua Francisco Costa 23, 2. DTO`    |
| `ENDCP`   | String   | `2829516 Caparica`                  |
| `PHONE1`  | String   | `+351 217982630`                    |
| `NIF`     | String   | `178654267`                         |
| `CC`      | String   | `9456723`                           |
| `CCDE`    | Data     | `24/12/2018`                        |
| `CCLE`    | String   | `Lisboa`                            |
| `CCV`     | Data     | `24/12/2028`                        |
| `DNASC`   | String   | `23/09/1991`                        |

---

## ADLU (Adherent Landowner User)

Mesmos campos que os roles acima.

---

## PO (Partner Operator)

| Campo     | Tipo     | Exemplo               |
|-----------|----------|------------------------|
| `UserID`  | Integer  | `100`                 |
| `UNAME`   | String   | `hj`                  |
| `EMAIL`   | Email    | `hj@fct.unl.pt`       |
| `PWD`     | String   | `hashed_base64_pwd`   |
| `NOME`    | String   | `António Santos`      |
| `PARTNER` | String   | `Empresa XYZ`         |
| `PHONE1`  | String   | `+351 217982630`      |

---

## RU (Registered User)

| Campo     | Tipo     | Exemplo                             |
|-----------|----------|-------------------------------------|
| `UserID`  | Integer  | `100`                               |
| `UNAME`   | String   | `hj`                                |
| `EMAIL`   | Email    | `hj@fct.unl.pt`                     |
| `PWD`     | String   | `hashed_base64_pwd`                 |
| `NOME`    | String   | `António José dos Santos Sydney`    |
| `PN`      | String   | `Portugal`                          |
| `PR`      | String   | `Portugal`                          |
| `END`     | String   | `Rua Francisco Costa 23, 2. DTO`    |
| `ENDCP`   | String   | `2829516 Caparica`                  |
| `PHONE1`  | String   | `+351 217982630`                    |
