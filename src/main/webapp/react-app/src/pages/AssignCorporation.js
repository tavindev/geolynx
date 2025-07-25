import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { userService, corporationService } from '../services/api';

const AssignCorporation = () => {
  const [users, setUsers] = useState([]);
  const [corporations, setCorporations] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCorporation, setSelectedCorporation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
    fetchCorporations();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.listUsers();
      const prboPoUsers = response.data.filter(
        (user) => user.role === 'PRBO' || user.role === 'PO'
      );
      setUsers(prboPoUsers);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar utilizadores' });
    }
  };

  const fetchCorporations = async () => {
    try {
      const response = await corporationService.getAll();
      setCorporations(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao carregar empresas' });
    }
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedCorporation) {
      setMessage({
        type: 'error',
        text: 'Selecione um utilizador e uma empresa',
      });
      return;
    }

    setLoading(true);
    try {
      await userService.assignCorporation({
        identificador: selectedUser,
        corporationId: selectedCorporation,
      });
      setMessage({ type: 'success', text: 'Utilizador atribuído com sucesso' });
      setSelectedUser('');
      setSelectedCorporation('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atribuir utilizador' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Atribuir Utilizadores a Empresas
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Atribuir utilizadores PRBO ou PO a empresas
        </Typography>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Utilizador</InputLabel>
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                label="Utilizador"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Box display="flex" alignItems="center">
                      <PersonIcon sx={{ mr: 1 }} />
                      {user.fullName} ({user.role})
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Empresa</InputLabel>
              <Select
                value={selectedCorporation}
                onChange={(e) => setSelectedCorporation(e.target.value)}
                label="Empresa"
              >
                {corporations.map((corp) => (
                  <MenuItem key={corp.id} value={corp.id}>
                    <Box display="flex" alignItems="center">
                      <BusinessIcon sx={{ mr: 1 }} />
                      {corp.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleAssign}
              disabled={loading || !selectedUser || !selectedCorporation}
              fullWidth
            >
              {loading ? 'A atribuir...' : 'Atribuir Utilizador'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AssignCorporation;
