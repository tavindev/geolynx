# Operações de Criação/Edição/Remoção/Visualização de Folhas de Execução

Requisitos Funcionais associados à Folha de Execução

· Cada Representative (PRBO) e Operator (PO) deve estar associado a um prestador de serviço. Os utilizadores “representative” (PRBO) podem abrir folhas de execução associadas a folhas de obra.

· Os Representatives (PRBO) devem poder atribuir operações a realizar em parcelas específicas a um seu prestador de serviço a Operators (POs). Estas operações e parcelas são parte integrante duma folha de obra adjudicada à entidade a que o (representative) PRBO pertence.

· Para cada folha os utilizadores com role Representative (PRBO) devem poder criar um plano de execução, ou seja, definir a ordem das áreas a serem executadas, em que dias, em que número de horas. Este plano pode ser definido dando prioridade às áreas do território, às máquinas ou às operações.

· Quando os Operators (POs) estão no terreno a executar as operações estes devem seguir a aplicação (a desenvolver num tablet), de modo a terem acesso e poderem registar as atividades na respetiva folha de execução, para fornecer informação de atualização de estado de execuções no terreno, podendo anexar observações ou dados correntes sobre a execução de tarefas em curso, permitindo assim que ouros perfis possam acompanhar o estado de execução de tarefas no. Na informação de monitorização e atualização do estado de execuções de tarefas em curso, os utilizadores PO podem adicionar informação multimédia que pode ficar indexada aos mapas no local de execução das tarefas (fotografias, com anotações textuais de observações sumárias (do tipo TWEETs) do que queiram notificar). Os utilizadores PO também podem ser avisados quando saem da área a ser abrangida pela folha de obra a que diz respeito a operação a executar. Esta deteção pode ser feita num mapa com a utilização de GPS.

· Os Representatives (PRBOs) devem poder adicionar às folhas informações sobre a velocidade de execução e o tempo previsto das respetivas operações.

· Os Operators (POs) devem poder iniciar e terminar uma atividade no contexto da realização de uma operação numa parcela.

· Um Operator (PO) pode ter várias pares (operação,parcela) de uma folha de obra associadas a si mesmo.

· O estado de execução deverá poder ser exportado pelo sistema para vir a ser integrado no LAND IT. O formato é o descrito no schema fornecido para as folhas de execução.

· Este projeto deve conter um sistema de notificações em que todos os utilizadores possam receber notificações sobre atualizações, como, por exemplo, quando um Operator (PO) está a sair da área em que é suposto realizar a operação.

· O sistema deverá conter um painel de informações em que o utilizador com o role Sheet Detailed Viewer (SDVBO) pode monitorizar e analisar o progresso das folhas de obra.

· Na conclusão de uma folha de obra deverá ser apresentado um registo de execução, que contém todos os detalhes de como as operações descritas numa folha foram executadas.

· O sistema deverá ter a capacidade de produzir relatórios mensais, em formato PDF, com estatísticas sobre o trabalho no terreno realizado durante esse período. Esta geração pode ser executada por utilizadores com o role Sheet General Viewer.

· O sistema deverá ter um painel com contactos de emergência, no caso de surgirem dúvidas ou imprevistos, em que os Operators podem contactar os Representative, os Sheet Manager ou os Sheet General Viewer.

As operações apresentadas na tabela pretendem incluir as operações MUST HAVE identificadas pela equipa docente, bem como algumas operações que considerámos úteis, mas que estão longe de ser exaustivas. É natural fazerem propostas de operações adicionais não apresentadas aqui.

| OP Code | Operação | Descrição da operação | Roles de autorização | Ref. Recom. | Priorização a definir pela equipa |
|---------|----------|----------------------|---------------------|-------------|-----------------------------------|
| **CREATE-FE** | Criar uma folha de execução associada a uma folha de obra | Criação duma folha de execução a partir duma folha de obra no sistema. As operações estarão ainda por atribuir. | PRBO | MH | |
| **ASSIGN-OP-FE** | Atribuir operações-parcela a operadores | Atribuir operações em parcelas a um operador do mesmo fornecedor que o PRBO. | PRBO | MH | |
| **START-ACT-OP-FE** | Iniciar uma atividade | Começar uma atividade numa parcela. Poderá ser a primeira atividade de uma operação. | PO | MH | |
| **STOP-ACT-OP-FE** | Parar/terminar uma atividade | Terminar uma atividade numa parcela. Poderá ou não terminar a operação associada. | PO | MH | |
| **VIEW-ACT-OP-FE** | Visualizar o estado duma operação numa dada parcela | Visualizar as actividades e o estado relativo à realização duma dada operação numa propriedade | PO, PRBO | MH | |
| **ADDINFO-ACT-OP-FE** | Adicionar dados relativos a uma atividade concluída | Adicionar Fotografias, Tracks GPS e Observações a uma atividade concluída | OP | MH | |
| **VIEW-STATUS-OP-GLOBAL-FE** | Visualizar o estado duma operação | Visualizar as atividades e o estado relativo à realização duma dada operação | PRBO, SDVBO | MH | |
| **EDIT-OP-FE** | Adicionar dados relativos a uma operação | O Representative pode editar dados relativos a uma operação da folha de execução, tais como datas previstas de conclusão ou tempos estimados de duração, etc. | PRBO, SDVBO | MH | |
| **EXPORT-FE** | Exportar Folha de Execução | Exportar o estado atual da execução duma folha de obra no formato fornecido para as folhas de execução. | SDVBO | MH | |

## Legenda dos Roles:
- **PRBO**: Project Representative - Business Owner
- **PO**: Project Operator  
- **OP**: Operator
- **SDVBO**: Service Delivery - Business Owner

## Referências:
- **MH**: Must Have (operacional)