import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Icon,
} from '@mui/material';
import {
  Map as MapIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  ListAlt as ListIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => (
  <Paper 
    elevation={0}
    sx={{ 
      p: 3, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      border: '1px solid #e0e0e0',
      boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
      borderRadius: (theme) => theme.shape.borderRadius,
    }}
  >
    <Box>
      <Typography color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </Box>
    <Icon sx={{ bgcolor: color, width: 56, height: 56, color: 'white' }}>
      {icon}
    </Icon>
  </Paper>
);

const QuickActionCard = ({ title, icon, path, role }) => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%',
        border: '1px solid #e0e0e0',
        boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
        borderRadius: (theme) => theme.shape.borderRadius,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 12px 30px -8px rgba(0, 0, 0, 0.15)',
        }
      }}
      onClick={() => navigate(path)}
    >
      <Icon sx={{ bgcolor: 'primary.main', mb: 1, color: 'white' }}>{icon}</Icon>
      <Typography variant="body1">{title}</Typography>
    </Paper>
  );
}

const Home = () => {
  const { user, mockUsers } = useAuth();
  const totalUsers = mockUsers.length;
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          {getGreeting()}, {user?.nome || user?.identificador}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Aqui está um resumo rápido do estado do sistema.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Total de Utilizadores" 
            value={totalUsers} 
            icon={<PeopleIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Folhas de Obra Ativas" 
            value="12" 
            icon={<AssignmentIcon />} 
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Pontos no Mapa" 
            value="134" 
            icon={<MapIcon />}
            color="#f39c12"
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Ações Rápidas
            </Typography>
            <QuickActionCard title="Nova Ficha de Obra" icon={<AddIcon />} path="/dashboard/worksheet/create" />
            <QuickActionCard title="Minhas Fichas" icon={<ListIcon />} path="/dashboard/my-worksheets" />
            <QuickActionCard title="Gerir Utilizadores" icon={<PeopleIcon />} path="/dashboard/list-users" role="SYSADMIN" />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
