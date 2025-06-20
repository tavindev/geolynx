# Operações MUST HAVE para Gestão de Contas (ADC)

Este documento lista as operações marcadas como **MUST HAVE (MH)** necessárias para a **gestão de contas** no sistema ADC.

---

## Lista de Operações

| Código     | Nome da Operação           | Descrição                                                                 |
|------------|----------------------------|---------------------------------------------------------------------------|
| GC-001     | Registo de Conta           | Operação de criação inicial de conta no sistema                          |
| GC-002     | Ativação de Conta          | Passar conta para estado ATIVADA, habilitando seu uso                    |
| GC-003     | Atualizar Conta            | Atualização de atributos da própria conta (exceto chaves primárias)     |
| GC-004     | Desativação de Conta       | Alteração do estado para DESATIVADO                                      |
| GC-005     | Suspensão de Conta         | Alteração do estado para SUSPENSO                                         |
| GC-006     | Pedido de Remoção de Conta | Solicitação de remoção da conta (modo A-REMOVER)                         |
| GC-007     | Remoção de Conta           | Remoção definitiva da conta do sistema                                   |
| GC-008     | Mudar Perfil da Conta      | Alterar perfil entre PÚBLICO e PRIVADO (somente role RU)                 |
| GC-014     | Listar contas com perfil A-REMOVER | Lista todas as contas marcadas como A-REMOVER                      |
| GC-015     | Verificar estado de conta  | Consulta do estado atual de uma conta                                    |

---

✅ Estas operações devem obrigatoriamente ser implementadas no sistema.
