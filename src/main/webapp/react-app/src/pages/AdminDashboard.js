import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AccountCircle as AccountIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { userService, worksheetService } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingRemoval: 0,
    suspendedUsers: 0,
    totalWorksheets: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [removalRequests, setRemovalRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all users
      const usersResponse = await userService.listUsers();
      const allUsers = usersResponse.data || [];

      // Fetch removal requests
      const removalResponse = await userService.getAccountsForRemoval();
      const removalList = removalResponse.data || [];

      // Fetch worksheets
      const worksheetsResponse = await worksheetService.getAll();
      const allWorksheets = worksheetsResponse.data || [];

      // Calculate stats
      setStats({
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter((u) => u.status === 'ACTIVE').length,
        pendingRemoval: removalList.length,
        suspendedUsers: allUsers.filter((u) => u.status === 'SUSPENDED').length,
        totalWorksheets: allWorksheets.length,
      });

      // Get recent users (last 5)
      setRecentUsers(allUsers.slice(0, 5));
      setRemovalRequests(removalList.slice(0, 3));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'success',
      INACTIVE: 'default',
      SUSPENDED: 'warning',
      PENDING_REMOVAL: 'error',
      DEACTIVATED: 'default',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      ATIVADA: 'Ativo',
      SUSPENSA: 'Suspenso',
      DESATIVADA: 'Desativado',
      A_REMOVER: 'Remoção Pendente',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Administrativo
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Total de Utilizadores
                  </Typography>
                  <Typography variant="h4">{stats.totalUsers}</Typography>
                </Box>
                <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate('/dashboard/list-users')}
              >
                Ver Todos
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Utilizadores Ativos
                  </Typography>
                  <Typography variant="h4">{stats.activeUsers}</Typography>
                </Box>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Pedidos de Remoção
                  </Typography>
                  <Typography variant="h4">{stats.pendingRemoval}</Typography>
                </Box>
                <WarningIcon color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate('/dashboard/removal-requests')}
              >
                Gerir
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Folhas de Obra
                  </Typography>
                  <Typography variant="h4">{stats.totalWorksheets}</Typography>
                </Box>
                <DescriptionIcon color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Users Table */}
      <Paper sx={{ mb: 4 }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Utilizadores Recentes</Typography>
          <Button onClick={() => navigate('/dashboard/list-users')}>
            Ver Todos
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.personalInfo?.fullName || user.username}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(user.accountStatus)}
                      color={getStatusColor(user.accountStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Gerir Conta">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/dashboard/account-management/${user.id}`)
                        }
                      >
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar Atributos">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/dashboard/change-attributes/${user.id}`)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Removal Requests */}
      {removalRequests.length > 0 && (
        <Paper>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Pedidos de Remoção Pendentes</Typography>
            <Button onClick={() => navigate('/dashboard/removal-requests')}>
              Ver Todos
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Utilizador</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {removalRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      {request.personalInfo?.fullName || request.username}
                    </TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{request.role}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => navigate('/dashboard/removal-requests')}
                      >
                        Processar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default AdminDashboard;
