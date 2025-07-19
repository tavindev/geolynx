import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { userService, authService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MyProfile = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profile: 'PUBLICO',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        profile: user.profile || 'PUBLICO',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Update user attributes
      await userService.changeAttributes({
        identificador: user.username, // Add the user identifier
        atributos: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          profile: formData.profile,
        },
      });

      // Update profile if changed
      if (formData.profile !== user.profile) {
        await userService.changeProfile({
          identificador: user.username,
          perfil: formData.profile,
        });
      }

      // Refresh user data
      const response = await authService.getCurrentUser();
      setUser(response.data);

      enqueueSnackbar('Perfil atualizado com sucesso!', { variant: 'success' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar perfil.');
      enqueueSnackbar('Erro ao atualizar perfil.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid #e0e0e0',
            boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Meu Perfil
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Atualize suas informações pessoais
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Perfil de Privacidade</InputLabel>
                  <Select
                    name="profile"
                    value={formData.profile}
                    onChange={handleChange}
                    label="Perfil de Privacidade"
                    disabled={loading}
                  >
                    <MenuItem value="PUBLICO">Público</MenuItem>
                    <MenuItem value="PRIVADO">Privado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    <strong>Username:</strong> {user?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Role:</strong> {user?.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Estado da Conta:</strong>{' '}
                    {user?.accountStatus || 'ACTIVE'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 500,
                boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0px 12px 30px -8px rgba(0, 0, 0, 0.15)',
                  backgroundColor: 'primary.light',
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Atualizar Perfil'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default MyProfile;
