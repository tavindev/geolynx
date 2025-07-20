import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Map as MapIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  ListAlt as ListIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid #e0e0e0',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s',
      '&:hover': onClick
        ? {
            transform: 'translateY(-2px)',
            boxShadow: '0px 12px 30px -8px rgba(0, 0, 0, 0.15)',
          }
        : {},
    }}
    onClick={onClick}
  >
    <Box>
      <Typography color="text.secondary" gutterBottom variant="body2">
        {title}
      </Typography>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </Box>
    <Box
      sx={{
        bgcolor: color,
        width: 56,
        height: 56,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {React.cloneElement(icon, { sx: { color: 'white', fontSize: 28 } })}
    </Box>
  </Paper>
);

const QuickActionCard = ({
  title,
  description,
  icon,
  path,
  color = 'primary.main',
}) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 12px 30px -8px rgba(0, 0, 0, 0.15)',
        },
      }}
      onClick={() => navigate(path)}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
          <IconButton
            size="small"
            sx={{
              bgcolor: color,
              color: 'white',
              '&:hover': { bgcolor: color },
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

const Home = () => {
  const { user, hasRole, hasAnyRole } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Bom dia';
    } else if (currentHour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

  // Show operator dashboard for operators
  if (hasRole('PO')) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography variant="h4" gutterBottom>
            {getGreeting()}, {user?.fullName || 'Operador'}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Dashboard do Operador - Gestão de Atividades
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Operações Atribuídas"
              value="3"
              icon={<AssignmentIcon />}
              color="info.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Em Progresso"
              value="2"
              icon={<PlayIcon />}
              color="warning.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Concluídas"
              value="5"
              icon={<CheckIcon />}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total"
              value="10"
              icon={<ScheduleIcon />}
              color="primary.main"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Ações Rápidas
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <QuickActionCard
                title="Minhas Operações"
                description="Ver operações atribuídas"
                icon={<AssignmentIcon />}
                path="/dashboard/my-worksheets"
                color="primary.main"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <QuickActionCard
                title="Mapa"
                description="Visualizar áreas de operação"
                icon={<MapIcon />}
                path="/dashboard/map"
                color="success.main"
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  }

  // Admin Dashboard
  if (hasAnyRole(['ADMIN', 'SYSADMIN', 'SMBO'])) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography variant="h4" gutterBottom>
            {getGreeting()}, {user?.fullName || 'Administrador'}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Bem-vindo ao Sistema GeoLynx
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <QuickActionCard
              title="Dashboard Administrativo"
              description="Gerir utilizadores e visualizar estatísticas"
              icon={<PeopleIcon />}
              path="/dashboard/admin"
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <QuickActionCard
              title="Folhas de Obra"
              description="Gerir e visualizar folhas de obra"
              icon={<AssignmentIcon />}
              path="/dashboard/worksheets"
              color="secondary.main"
            />
          </Grid>
        </Grid>
      </Container>
    );
  }

  // PRBO/SDVBO Dashboard
  if (hasAnyRole(['PRBO', 'SDVBO'])) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography variant="h4" gutterBottom>
            {getGreeting()}, {user?.fullName || 'Gestor'}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Dashboard de Gestão de Execução
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Folhas Pendentes"
              value="5"
              icon={<ScheduleIcon />}
              color="warning.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Em Execução"
              value="12"
              icon={<PlayIcon />}
              color="info.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Concluídas (Mês)"
              value="8"
              icon={<CheckIcon />}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Taxa Conclusão"
              value="67%"
              icon={<AssignmentIcon />}
              color="primary.main"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Gestão de Execução
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <QuickActionCard
                title="Folhas de Execução"
                description="Criar e gerir folhas de execução"
                icon={<DescriptionIcon />}
                path="/dashboard/execution-sheets"
                color="primary.main"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <QuickActionCard
                title="Ver Mapa"
                description="Visualizar operações no mapa"
                icon={<MapIcon />}
                path="/dashboard/map"
                color="success.main"
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  }

  // Default dashboard for other roles
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          {getGreeting()}, {user?.fullName || 'Utilizador'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Bem-vindo ao Sistema GeoLynx
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <QuickActionCard
            title="Ver Mapa"
            description="Explorar dados geográficos"
            icon={<MapIcon />}
            path="/dashboard/map"
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <QuickActionCard
            title="Meu Perfil"
            description="Gerir informações da conta"
            icon={<PeopleIcon />}
            path="/dashboard/change-password"
            color="secondary.main"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
