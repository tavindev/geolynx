# Operações de Criação/Edição/Remoção/Visualização de Folhas de Execução

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