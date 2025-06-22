# GeoLynx - React Web Application

## Descrição
Aplicação web React para o sistema de gestão territorial GeoLynx. Esta aplicação substitui o frontend HTML/JavaScript tradicional por uma interface moderna e responsiva construída com React e Material-UI.

## Características Principais

### 🎯 Funcionalidades
- **Autenticação JWT**: Sistema seguro com cookies HTTP-only
- **Gestão de Utilizadores**: CRUD completo com diferentes roles e permissões
- **Folhas de Obra**: Criação e gestão de folhas de trabalho
- **Mapa Interativo**: Visualização de áreas de intervenção (preparado para Leaflet)
- **Interface Responsiva**: Adaptada para desktop e dispositivos móveis
- **Sistema de Notificações**: Feedback visual para todas as ações

### 🛡️ Roles Suportados
- SYSADMIN - Administrador do Sistema
- SMBO - Gestor de Folhas
- SGVBO - Visualizador Geral de Folhas
- SDVBO - Visualizador Detalhado de Folhas
- PRBO - Representante de Parceiro
- PO - Operador de Parceiro
- ADLU - Utilizador Proprietário Aderente
- RU - Utilizador Registado
- VU - Utilizador Visitante

## Instalação

### Pré-requisitos
- Node.js (v14 ou superior)
- npm ou yarn
- Backend Java em execução (porta 8080)

### Passos de Instalação

1. **Navegar para a pasta do React**
   ```bash
   cd src/main/webapp/react-app
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente** (opcional)
   Criar ficheiro `.env` na raiz do projeto React:
   ```env
   REACT_APP_API_URL=http://localhost:8080
   ```

4. **Iniciar a aplicação em modo desenvolvimento**
   ```bash
   npm start
   ```
   A aplicação será aberta em http://localhost:3000

5. **Build para produção**
   ```bash
   npm run build
   ```
   Os ficheiros de produção serão gerados na pasta `build/`

## Estrutura do Projeto

```
react-app/
├── public/
│   └── index.html          # HTML principal
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   └── Layout/        # Componentes de layout
│   ├── contexts/          # Contextos React (Auth, etc)
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços de API
│   ├── App.js             # Componente principal
│   ├── index.js           # Ponto de entrada
│   └── index.css          # Estilos globais
└── package.json           # Dependências e scripts
```

## Integração com Backend

A aplicação está configurada para comunicar com o backend Java através do proxy configurado no `package.json`. Todas as chamadas para `/rest/*` são automaticamente redirecionadas para `http://localhost:8080/rest/*`.

### Endpoints Principais
- `/rest/user/login` - Autenticação
- `/rest/user/register` - Registo
- `/rest/user/all` - Lista de utilizadores
- `/rest/work-sheet/create` - Criar folha de obra
- Etc.

## Desenvolvimento

### Adicionar Nova Página

1. Criar componente em `src/pages/`
2. Adicionar rota em `App.js`
3. Adicionar item no menu em `Layout.js`
4. Implementar chamadas API em `services/api.js`

### Convenções de Código
- Usar functional components com hooks
- Separar lógica de negócio em custom hooks
- Usar Material-UI para todos os componentes UI
- Manter consistência com o design system

## Próximos Passos

### Funcionalidades a Implementar
1. **Mapa Interativo Completo**
   - Integração com Leaflet
   - Visualização de AIGPs
   - Tracking GPS de operações
   - Layers de informação

2. **Sistema de Notificações em Tempo Real**
   - WebSockets ou SSE
   - Alertas de saída de área
   - Updates de estado

3. **Dashboard Avançado**
   - Gráficos e estatísticas
   - KPIs de operações
   - Relatórios

4. **PWA Features**
   - Offline support
   - Push notifications
   - App instalável

## Suporte

Para questões ou problemas, contactar a equipa de desenvolvimento ADC-PEI FCT NOVA.
