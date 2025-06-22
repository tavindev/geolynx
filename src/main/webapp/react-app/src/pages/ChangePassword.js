import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { userService } from '../services/api';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('As novas palavras-passe não coincidem.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      await userService.changePassword({
        senha_atual: formData.currentPassword,
        nova_senha: formData.newPassword,
        confirmacao_nova_senha: formData.confirmPassword
      });
      enqueueSnackbar('Palavra-passe alterada com sucesso!', { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao alterar a palavra-passe.');
      enqueueSnackbar('Erro ao alterar a palavra-passe.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid #e0e0e0',
            boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Alterar Palavra-passe
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="currentPassword"
              label="Palavra-passe Atual"
              type={showPassword.current ? 'text' : 'password'}
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => handleTogglePasswordVisibility('current')} 
                      edge="end"
                      sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                    >
                      {showPassword.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="Nova Palavra-passe"
              type={showPassword.new ? 'text' : 'password'}
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => handleTogglePasswordVisibility('new')} 
                      edge="end"
                      sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Nova Palavra-passe"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                py: 1.5,
                fontWeight: 500,
                boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0px 12px 30px -8px rgba(0, 0, 0, 0.15)',
                  backgroundColor: 'primary.light',
                }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Atualizar'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ChangePassword; 