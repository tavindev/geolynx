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
  Chip,
} from '@mui/material';
import { AutorenewOutlined as AutorenewIcon } from '@mui/icons-material';
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
  { value: 'VU', label: 'Visitor User' },
];

const STATES = [
  { value: 'ATIVADA', label: 'Ativo' },
  { value: 'SUSPENSA', label: 'Suspenso' },
  { value: 'DESATIVADA', label: 'Desativado' },
  { value: 'A_REMOVER', label: 'Remoção Pendente' },
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
  const [savingField, setSavingField] = useState(''); // 'role' or 'state'
  const [lastSaved, setLastSaved] = useState({});

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get the specific user data using the new endpoint
        const response = await userService.getUserById(userId);
        const userData = response.data;

        setUser(userData);
        setNewRole(userData.role || '');
        setNewState(userData.accountStatus || 'ACTIVE');
      } catch (err) {
        setError('Falha ao carregar dados do utilizador.');
        enqueueSnackbar('Falha ao carregar dados do utilizador.', {
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, enqueueSnackbar]);

  const handleRoleChange = async (newRoleValue) => {
    // Store previous value for rollback
    const previousRole = newRole;

    // Optimistic update - update UI immediately
    setNewRole(newRoleValue);
    setUser((prev) => ({ ...prev, role: newRoleValue }));
    setSubmitting(true);
    setSavingField('role');
    setError('');

    try {
      await userService.changeRole({
        identifier: userId,
        newRole: newRoleValue,
      });

      enqueueSnackbar('Role do utilizador atualizada com sucesso!', {
        variant: 'success',
      });

      setLastSaved((prev) => ({ ...prev, role: new Date() }));
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Erro ao atualizar role do utilizador';
      setError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: 'error' });

      // Rollback on error
      setNewRole(previousRole);
      setUser((prev) => ({ ...prev, role: previousRole }));
    } finally {
      setSubmitting(false);
      setSavingField('');
    }
  };

  const handleStateChange = async (newStateValue) => {
    // Store previous value for rollback
    const previousState = newState;

    // Optimistic update - update UI immediately
    setNewState(newStateValue);
    setUser((prev) => ({ ...prev, accountStatus: newStateValue }));
    setSubmitting(true);
    setSavingField('state');
    setError('');

    try {
      await userService.changeAccountState({
        identifier: userId,
        newState: newStateValue,
      });

      enqueueSnackbar('Estado do utilizador atualizado com sucesso!', {
        variant: 'success',
      });

      setLastSaved((prev) => ({ ...prev, state: new Date() }));
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Erro ao atualizar estado do utilizador';
      setError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: 'error' });

      // Rollback on error
      setNewState(previousState);
      setUser((prev) => ({ ...prev, accountStatus: previousState }));
    } finally {
      setSubmitting(false);
      setSavingField('');
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography component="h1" variant="h5">
              Alterar Role e Estado do Utilizador
            </Typography>
            {submitting && (
              <Chip
                icon={<AutorenewIcon />}
                label="A guardar..."
                color="primary"
                size="small"
              />
            )}
          </Box>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Utilizador: <strong>{user.username}</strong>
          </Typography>
          {user.fullName && (
            <Typography variant="body2" align="center" sx={{ mb: 3 }}>
              {user.fullName}
            </Typography>
          )}

          <Box sx={{ mt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role"
                name="role"
                value={newRole}
                label="Role"
                onChange={(e) => handleRoleChange(e.target.value)}
                disabled={savingField === 'role' || user.role === 'SYSADMIN'}
              >
                {ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label} ({r.value})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {user.role === 'SYSADMIN'
                  ? 'Não é possível alterar o role de um SYSADMIN'
                  : savingField === 'role'
                  ? 'A guardar alteração...'
                  : lastSaved.role
                  ? `Guardado às ${lastSaved.role.toLocaleTimeString('pt-PT')}`
                  : 'As alterações são guardadas automaticamente'}
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
                onChange={(e) => handleStateChange(e.target.value)}
                disabled={savingField === 'state'}
              >
                {STATES.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {savingField === 'state'
                  ? 'A guardar alteração...'
                  : lastSaved.state
                  ? `Guardado às ${lastSaved.state.toLocaleTimeString('pt-PT')}`
                  : 'As alterações são guardadas automaticamente'}
              </FormHelperText>
            </FormControl>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard/list-users')}
                disabled={savingField !== ''}
              >
                Voltar à Lista de Utilizadores
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ChangeRole;
