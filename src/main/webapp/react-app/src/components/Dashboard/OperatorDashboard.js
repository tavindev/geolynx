import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { executionSheetService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const OperatorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assigned: 0,
    ongoing: 0,
    completed: 0,
    total: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperatorData();
  }, []);

  const fetchOperatorData = async () => {
    try {
      setLoading(true);
      // Note: These endpoints would need to be implemented in the backend
      // For now, we'll show placeholder data
      setStats({
        assigned: 3,
        ongoing: 2,
        completed: 5,
        total: 10,
      });
      
      setRecentActivities([
        {
          id: 1,
          type: 'assigned',
          description: 'Nova operação atribuída - Polígono #123',
          date: new Date().toLocaleDateString('pt-PT'),
        },
        {
          id: 2,
          type: 'completed',
          description: 'Operação concluída - Polígono #121',
          date: new Date().toLocaleDateString('pt-PT'),
        },
      ]);
    } catch (error) {
      console.error('Error fetching operator data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'assigned':
        return <AssignmentIcon color="info" />;
      case 'ongoing':
        return <PlayIcon color="warning" />;
      case 'completed':
        return <CheckIcon color="success" />;
      default:
        return <ScheduleIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard do Operador
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Atribuídas
                  </Typography>
                  <Typography variant="h4">
                    {stats.assigned}
                  </Typography>
                </Box>
                <AssignmentIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Em Progresso
                  </Typography>
                  <Typography variant="h4">
                    {stats.ongoing}
                  </Typography>
                </Box>
                <PlayIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Concluídas
                  </Typography>
                  <Typography variant="h4">
                    {stats.completed}
                  </Typography>
                </Box>
                <CheckIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total
                  </Typography>
                  <Typography variant="h4">
                    {stats.total}
                  </Typography>
                </Box>
                <ScheduleIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Atividades Recentes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {recentActivities.length > 0 ? (
                <List>
                  {recentActivities.map((activity) => (
                    <ListItem key={activity.id} disablePadding sx={{ mb: 1 }}>
                      <Box display="flex" alignItems="center" width="100%">
                        {getActivityIcon(activity.type)}
                        <ListItemText
                          primary={activity.description}
                          secondary={activity.date}
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="textSecondary">
                  Sem atividades recentes
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ações Rápidas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AssignmentIcon />}
                  onClick={() => navigate('/dashboard/execution-sheets')}
                >
                  Ver Minhas Operações
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/dashboard/map')}
                >
                  Abrir Mapa
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OperatorDashboard;
