import React, { useState, useEffect } from 'react';
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
  Skeleton,
  Alert,
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
import { dashboardService } from '../services/api';

const StatCard = ({ title, value, icon, color, onClick, loading = false }) => (
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
        {loading ? <Skeleton width={60} /> : value}
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

  const [dashboardStats, setDashboardStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    completionRate: '0%'
  });
  const [operatorStats, setOperatorStats] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const fetchDashboardData = async () => {
    if (!hasAnyRole(['PRBO', 'SDVBO'])) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await dashboardService.getStatistics();
      setDashboardStats({
        pending: response.data.pending,
        inProgress: response.data.inProgress,
        completed: response.data.completed,
        completionRate: response.data.completionRate
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchOperatorData = async () => {
    if (!hasRole('PO')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await dashboardService.getOperatorStatistics();
      setOperatorStats({
        assigned: response.data.assigned,
        inProgress: response.data.inProgress,
        completed: response.data.completed,
        total: response.data.total
      });
    } catch (err) {
      console.error('Error fetching operator data:', err);
      setError('Erro ao carregar dados do operador');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasAnyRole(['PRBO', 'SDVBO'])) {
      fetchDashboardData();
    } else if (hasRole('PO')) {
      fetchOperatorData();
    }
  }, [hasRole, hasAnyRole]);

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

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Operações Atribuídas"
              value={operatorStats.assigned}
              icon={<AssignmentIcon />}
              color="info.main"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Em Progresso"
              value={operatorStats.inProgress}
              icon={<PlayIcon />}
              color="warning.main"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Concluídas"
              value={operatorStats.completed}
              icon={<CheckIcon />}
              color="success.main"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total"
              value={operatorStats.total}
              icon={<ScheduleIcon />}
              color="primary.main"
              loading={loading}
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

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Folhas Pendentes"
              value={dashboardStats.pending}
              icon={<ScheduleIcon />}
              color="warning.main"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Em Execução"
              value={dashboardStats.inProgress}
              icon={<PlayIcon />}
              color="info.main"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Concluídas"
              value={dashboardStats.completed}
              icon={<CheckIcon />}
              color="success.main"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Taxa Conclusão"
              value={dashboardStats.completionRate}
              icon={<AssignmentIcon />}
              color="primary.main"
              loading={loading}
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
