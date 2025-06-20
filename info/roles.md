# Roles do Sistema ADC e suas Permissões

## Lista de Roles

### `SYSADMIN` — System Administrator
Responsável pela administração técnica do sistema.

**Permissões:**
- Gerenciar ativação, suspensão, remoção de contas
- Promover usuários SYSBO para SYSADMIN
- Visualizar todos os dados do sistema
- Forçar logout de qualquer usuário

---

### `SYSBO` — System BackOffice
Responsável pela gestão operativa do sistema.

**Permissões:**
- Obter dados e estatísticas operacionais
- Gerenciar produtividade
- Ativar/desativar/suspender contas (exceto SYSADMIN)
- Forçar logout de qualquer usuário exceto SYSADMIN

---

### `SMBO` — Sheet Manager BackOffice
Responsável pela gestão de folhas de obra.

**Permissões:**
- `IMP-FO`: Importar folhas de obra
- `EDIT-FO`: Editar folhas de obra
- `REM-FO`: Remover folhas de obra e execuções associadas
- `VIEW-GEN-FO`: Visualizar folha de obra (genérica)
- `VIEW-DET-FO`: Visualizar folha de obra (detalhada)
- `SEARCH-GEN-FO`: Pesquisar folha de obra (genérica)
- `SEARCH-DET-FO`: Pesquisar folha de obra (detalhada)
- Exportar folhas em JSON

---

### `SGVBO` — Sheet General Viewer BackOffice
Visualizador geral das folhas de obra.

**Permissões:**
- `VIEW-GEN-FO`: Visualizar folha de obra (genérica)
- `SEARCH-GEN-FO`: Pesquisar folha de obra (genérica)
- Gerar relatórios mensais (PDF)

---

### `SDVBO` — Sheet Detailed Viewer BackOffice
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

### `PRBO` — Partner Representative BackOffice
Representante de entidade prestadora de serviços.

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

### `PO` — Partner Operator
Operador de campo que executa operações no terreno.

**Permissões:**
- `START-ACT-OP-FE`: Iniciar atividade
- `STOP-ACT-OP-FE`: Terminar atividade
- `VIEW-ACT-OP-FE`: Visualizar estado da operação em parcela
- `ADDINFO-ACT-OP-FE`: Adicionar fotos, GPS, observações à atividade
- `NOTIFY-OUT`: Ser notificado ao sair da área
- Executar e registrar atividades no tablet
- Ser atribuido a vários pares (operação, parcela)

---

### `ADLU` — Adherent Landowner User
Proprietário aderente a AIGP (gestão da paisagem).

**Permissões:**
- Colocar informação sobre disponibilidade de uso do terreno
- Permissões semelhantes ao `RU`

---

### `RU` — Registered User
Utilizador externo com conta registada.

**Permissões:**
- `LIKE-INT`: Colocar likes em intervenções
- `SUGGEST-INT`: Publicar sugestões ou pedidos de intervenção
- `ROUTE-INT`: Organizar visitas com edição de percursos
- Acesso ao "antes/depois" de intervenções

---

### `VU` — Visitor User
Utilizador externo sem conta registada (público).

**Permissões:**
- Visualizar informação institucional ou resultante de ações de `RU`
- Apenas leitura/pesquisa, sem alteração do sistema

---

### `Sistema` (sem role explícita)
Operações automáticas do sistema.

**Permissões:**
- `NOTIFY-OUT`: Notificar operador fora da área
- `NOTIFY-OPER-POLY-END`: Notificar PRBO de conclusão de operação em parcela
- `NOTIFY-OPER-END`: Notificar PRBO de conclusão total da operação
