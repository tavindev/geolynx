# Roles do Sistema ADC e suas Permissões

## Lista de Roles

### `SMBO` — Sheet Manager
Responsável por gerenciar as folhas de obra.

**Permissões:**
- `IMP-FO`: Importar folhas de obra
- `EDIT-FO`: Editar folhas de obra
- `REM-FO`: Remover folhas de obra e execuções associadas
- `VIEW-GEN-FO`: Visualizar folha de obra (genérica)
- `VIEW-DET-FO`: Visualizar folha de obra (detalhada)
- `SEARCH-GEN-FO`: Pesquisar folha de obra (genérica)
- `SEARCH-DET-FO`: Pesquisar folha de obra (detalhada)

---

### `SGVBO` — Sheet General Viewer
Visualizador geral do progresso.

**Permissões:**
- `VIEW-GEN-FO`: Visualizar folha de obra (genérica)
- `SEARCH-GEN-FO`: Pesquisar folha de obra (genérica)
- Gerar relatórios mensais (PDF)

---

### `SDVBO` — Sheet Detailed Viewer
Visualizador detalhado das execuções.

**Permissões:**
- `VIEW-DET-FO`: Visualizar folha de obra (detalhada)
- `SEARCH-DET-FO`: Pesquisar folha de obra (detalhada)
- `VIEW-STATUS-OP-GLOBAL-FE`: Visualizar estado de operações
- `EXPORT-FE`: Exportar folha de execução
- `EDIT-OP-FE`: Editar dados de operação (tempo, duração)
- Acessar painel de monitorização
- Acessar painel de contactos de emergência

---

### `PRBO` — Representative
Representante de uma entidade prestadora de serviços.

**Permissões:**
- `CREATE-FE`: Criar folha de execução
- `ASSIGN-OP-FE`: Atribuir operação/parcela a operadores
- `VIEW-ACT-OP-FE`: Visualizar estado de operação em parcela
- `VIEW-STATUS-OP-GLOBAL-FE`: Visualizar estado global da operação
- `EDIT-OP-FE`: Editar dados da operação (duração, previsão)
- Definir plano de execução por áreas, máquinas ou operações
- Adicionar velocidade e tempo estimado de execução
- Ser notificado quando operações forem concluídas

---

### `PO` — Operator
Operador de campo que executa operações.

**Permissões:**
- `START-ACT-OP-FE`: Iniciar atividade
- `STOP-ACT-OP-FE`: Terminar atividade
- `VIEW-ACT-OP-FE`: Visualizar estado da operação em parcela
- `ADDINFO-ACT-OP-FE`: Adicionar fotos, GPS, observações à atividade
- Ser notificado ao sair da área (`NOTIFY-OUT`)
- Executar e registrar atividades no tablet
- Ser atribuído a vários pares (operação, parcela)

---

### `Sistema (sem role explícita)`
Operações automáticas não ligadas a uma role específica:

**Permissões:**
- `NOTIFY-OUT`: Notificar operador fora da área
- `NOTIFY-OPER-POLY-END`: Notificar PRBO de conclusão de operação numa parcela
- `NOTIFY-OPER-END`: Notificar PRBO de conclusão total da operação

---