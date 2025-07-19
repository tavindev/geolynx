import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { historicalCuriosityService } from '../services/api';

const CreateCuriosityModal = ({ open, onClose, coordinates, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coordinates) {
      setError(
        'Nenhuma coordenada disponível. Por favor, mova o mapa para definir uma localização.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use coordinates as Double values (regular degrees)
      const curiosityData = {
        title: formData.title,
        description: formData.description,
        lat: coordinates.lat,
        long: coordinates.lng,
      };

      await historicalCuriosityService.create(curiosityData);

      // Reset form
      setFormData({
        title: '',
        description: '',
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating historical curiosity:', error);
      setError('Falha ao criar curiosidade histórica. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
      });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adicionar Curiosidade Histórica</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {coordinates && (
              <Alert severity="info">
                Localização: {coordinates.lat.toFixed(6)},{' '}
                {coordinates.lng.toFixed(6)}
              </Alert>
            )}

            <TextField
              name="title"
              label="Título"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              disabled={loading}
              placeholder="Ex: Antigo Moinho de Água"
            />

            <TextField
              name="description"
              label="Descrição da Curiosidade Histórica"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={5}
              disabled={loading}
              placeholder="Descreva um fato histórico interessante sobre este local..."
              helperText="Conte algo sobre a história, cultura, arqueologia ou tradições deste lugar"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !coordinates}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Criando...' : 'Criar Curiosidade'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCuriosityModal;
