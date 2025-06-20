# Operações MUST HAVE para Gestão de Contas (ADC)

Este documento lista as operações marcadas como **MUST HAVE (MH)** necessárias para a **gestão de contas** no sistema ADC, incluindo os **roles autorizados** a executá-las.

---

## Lista de Operações

| Código   | Nome da Operação           | Descrição                                                                 | Roles Autorizados             |
|----------|----------------------------|---------------------------------------------------------------------------|-------------------------------|
| GC-001   | Registo de Conta           | Operação de criação inicial de conta no sistema                          | Todos                         |
| GC-002   | Ativação de Conta          | Passar conta para estado ATIVADA, habilitando seu uso                    | `SYSADMIN`, `SYSBO`           |
| GC-003   | Atualizar Conta            | Atualização de atributos da própria conta (exceto chaves primárias)     | Todos (na própria conta)      |
| GC-004   | Desativação de Conta       | Alteração do estado para DESATIVADO                                      | `SYSADMIN`, `SYSBO`           |
| GC-005   | Suspensão de Conta         | Alteração do estado para SUSPENSO                                        | `SYSADMIN`, `SYSBO`           |
| GC-006   | Pedido de Remoção de Conta | Solicitação de remoção da conta (modo A-REMOVER)                         | Todos (na própria conta)      |
| GC-007   | Remoção de Conta           | Remoção definitiva da conta do sistema                                   | `SYSADMIN`, `SYSBO`           |
| GC-008   | Mudar Perfil da Conta      | Alterar perfil entre PÚBLICO e PRIVADO                                   | Somente `RU`                  |
| GC-014   | Listar contas A-REMOVER    | Listar todas as contas marcadas como A-REMOVER                           | `SYSADMIN`, `SYSBO`           |
| GC-015   | Verificar estado da conta  | Consulta do estado atual de uma conta                                    | Todos (restrito por role)     |

> ⚠️ A verificação de permissões deve respeitar o escalonamento e equivalência entre roles.