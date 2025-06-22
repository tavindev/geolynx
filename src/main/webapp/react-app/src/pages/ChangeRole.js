import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { userService } from '../services/api';
import { useSnackbar } from 'notistack';

const ROLES = [
  { value: 'SYSADMIN', label: 'System Administrator' },
  { value: 'SMBO', label: 'SMBO' },
  { value: 'SGVBO', label: 'SGVBO' },
  { value: 'SDVBO', label: 'SDVBO' },
  { value: 'PRBO', label: 'PRBO' },
  { value: 'PO', label: 'Partner Operator' },
  { value: 'ADLU', label: 'ADLU' },
  { value: 'RU', label: 'Regular User' },
  { value: 'VU', label: 'Visitor User' }
];

const STATES = [
  { value: 'ACTIVE', label: 'Ativo' },
  { value: 'INACTIVE', label: 'Inativo' },
  { value: 'SUSPENDED', label: 'Suspenso' }
];

const ChangeRole = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [newState, setNewState] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user list to find current user data
        const response = await userService.listUsers();
        const userData = response.data.find(u => u.username === userId || u.email === userId);
        
        if (!userData) {
          throw new Error('User not found');
        }
        
        setUser(userData);
        setNewRole(userData.role || '');
        setNewState(userData.accountStatus || 'ACTIVE');
      } catch (err) {
        setError('Falha ao carregar dados do utilizador.');
        enqueueSnackbar('Falha ao carregar dados do utilizador.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, enqueueSnackbar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Update role if changed
      if (newRole !== user.role) {
        await userService.changeRole({
          username: userId,
          novo_role: newRole
        });
      }

      // Update state if changed
      if (newState !== user.accountStatus) {
        await userService.changeAccountState({
          username: userId,
          novo_estado: newState
        });
      }

      enqueueSnackbar('Role e estado do utilizador atualizados com sucesso!', { variant: 'success' });
      navigate('/dashboard/list-users');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar o utilizador';
      setError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Alert severity="error">Utilizador não encontrado</Alert>
      </Container>
    );
  }
  
  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            padding: 4, 
            width: '100%', 
            border: '1px solid #e0e0e0',
            boxShadow: '0px 10px 30px -5px rgba(0, 0, 0, 0.07)',
            borderRadius: (theme) => theme.shape.borderRadius,
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Alterar Role e Estado do Utilizador
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Utilizador: <strong>{user.username}</strong>
          </Typography>
          {user.fullName && (
            <Typography variant="body2" align="center" sx={{ mb: 3 }}>
              {user.fullName}
            </Typography>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role"
                name="role"
                value={newRole}
                label="Role"
                onChange={(e) => setNewRole(e.target.value)}
                disabled={submitting || user.role === 'SYSADMIN'}
              >
                {ROLES.map(r => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label} ({r.value})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {user.role === 'SYSADMIN' ? 
                  'Não é possível alterar o role de um SYSADMIN' : 
                  'Selecione a nova role para o utilizador.'}
              </FormHelperText>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-select-label">Estado</InputLabel>
              <Select
                labelId="status-select-label"
                id="status"
                name="status"
                value={newState}
                label="Estado"
                onChange={(e) => setNewState(e.target.value)}
                disabled={submitting}
              >
                {STATES.map(s => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Selecione o estado da conta do utilizador.</FormHelperText>
            </FormControl>
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : 'Atualizar'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/dashboard/list-users')}
                disabled={submitting}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ChangeRole;
