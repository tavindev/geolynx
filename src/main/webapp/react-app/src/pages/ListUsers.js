import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Pagination,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  LockOpen as ActiveIcon,
  Lock as InactiveIcon,
  ManageAccounts as ManageAccountsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { userService } from '../services/api';

const UserCard = ({ user, onEdit, onChangeRole, onDelete, onManageAccount }) => {
  const username = user.username;
  const email = user.email;
  const role = user.role;
  const status = user.accountStatus;
  const fullName = user.fullName || username;
  const isSysAdmin = role === 'SYSADMIN';

  const getRoleChip = (role) => {
    const roles = {
      SYSADMIN: { label: 'SysAdmin', color: 'error', icon: <AdminIcon /> },
      SMBO: { label: 'SMBO', color: 'warning', icon: <PersonIcon /> },
      RU: { label: 'Utilizador', color: 'info', icon: <PersonIcon /> },
      PO: { label: 'PO', color: 'primary', icon: <PersonIcon /> },
      ADLU: { label: 'ADLU', color: 'primary', icon: <PersonIcon /> },
      PRBO: { label: 'PRBO', color: 'secondary', icon: <PersonIcon /> },
      SGVBO: { label: 'SGVBO', color: 'secondary', icon: <PersonIcon /> },
      SDVBO: { label: 'SDVBO', color: 'secondary', icon: <PersonIcon /> },
      VU: { label: 'VU', color: 'default', icon: <PersonIcon /> },
    };
    return roles[role] || { label: role, color: 'default', icon: <PersonIcon /> };
  };

  const getStatusChip = (status) => {
    const statusMap = {
      'ACTIVE': { label: 'Ativo', color: 'success', icon: <ActiveIcon /> },
      'INACTIVE': { label: 'Inativo', color: 'error', icon: <InactiveIcon /> },
      'SUSPENDED': { label: 'Suspenso', color: 'warning', icon: <InactiveIcon /> },
      'PENDING_REMOVAL': { label: 'Remoção Pendente', color: 'error', icon: <InactiveIcon /> },
    };
    return statusMap[status] || { label: status, color: 'default', icon: <PersonIcon /> };
  };
  
  const roleChip = getRoleChip(role);
  const statusChip = getStatusChip(status);

  return (
    <Card 
      elevation={0}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        border: '1px solid #e0e0e0',
        boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 12px 30px -8px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" component="div" noWrap>{fullName}</Typography>
            <Typography color="text.secondary" noWrap>{email}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip icon={roleChip.icon} label={roleChip.label} color={roleChip.color} size="small" />
          <Chip icon={statusChip.icon} label={statusChip.label} color={statusChip.color} size="small" variant="outlined" />
        </Box>
      </CardContent>
      <Box sx={{ 
        p: 1, 
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 0.5
      }}>
        <Tooltip title="Gerir Conta">
          <IconButton size="small" onClick={() => onManageAccount(username)} color="primary" sx={{ p: 0.5, '&:hover': { color: 'primary.light' } }}>
            <ManageAccountsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar Atributos">
          <IconButton size="small" onClick={() => onEdit(username)} color="primary" sx={{ p: 0.5, '&:hover': { color: 'primary.light' } }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={isSysAdmin ? "Não pode alterar um SysAdmin" : "Alterar Role/Estado"}>
          <span>
            <IconButton size="small" onClick={() => onChangeRole(username)} color="secondary" disabled={isSysAdmin} sx={{ p: 0.5, '&:hover': { color: 'secondary.light' } }}>
              <AdminIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={isSysAdmin ? "Não pode remover um SysAdmin" : "Remover Utilizador"}>
          <span>
            <IconButton size="small" onClick={() => onDelete(user)} color="error" disabled={isSysAdmin} sx={{ p: 0.5 }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Card>
  );
};

const ListUsers = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.listUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Erro ao carregar utilizadores');
      enqueueSnackbar('Erro ao carregar utilizadores', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = users.filter(user => {
      const username = user.username || '';
      const email = user.email || '';
      const fullName = user.fullName || '';
      const role = user.role || '';
      
      return (
        username.toLowerCase().includes(lowercasedFilter) ||
        email.toLowerCase().includes(lowercasedFilter) ||
        fullName.toLowerCase().includes(lowercasedFilter) ||
        role.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredUsers(filtered);
    setPage(1);
  }, [searchTerm, users]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await userService.removeUser({ identificador: userToDelete.username });
      enqueueSnackbar('Utilizador removido com sucesso!', { variant: 'success' });
      fetchUsers(); // Refresh the list
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Erro ao remover utilizador.', { variant: 'error' });
    } finally {
      handleCloseDeleteDialog();
    }
  };
  
  const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px"><CircularProgress /></Box>;
  }

  if (error) {
    return <Container maxWidth="lg"><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Gestão de Utilizadores
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Procure, visualize e gira as contas dos utilizadores.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate('/dashboard/removal-requests')}
          startIcon={<DeleteIcon />}
        >
          Pedidos de Remoção
        </Button>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          mb: 4, 
          p: 2,
          border: '1px solid #e0e0e0',
          boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pesquisar por nome, email, username ou role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ 
            startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment> 
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {paginatedUsers.map((user) => (
          <Grid item key={user.username || user.email} xs={12} sm={6} md={4} lg={3}>
            <UserCard 
              user={user}
              onEdit={(username) => navigate(`/dashboard/change-attributes/${username}`)}
              onChangeRole={(username) => navigate(`/dashboard/change-role/${username}`)}
              onDelete={handleOpenDeleteDialog}
              onManageAccount={(username) => navigate(`/dashboard/account-management/${username}`)}
            />
          </Grid>
        ))}
      </Grid>
      
      {filteredUsers.length > rowsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={Math.ceil(filteredUsers.length / rowsPerPage)} 
            page={page} 
            onChange={handlePageChange}
            color="primary" 
          />
        </Box>
      )}

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Remoção</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem a certeza que deseja remover o utilizador <strong>{userToDelete?.username}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteUser} color="error">Remover</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListUsers;
