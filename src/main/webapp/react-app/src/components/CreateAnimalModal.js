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
import { animalService } from '../services/api';

const CreateAnimalModal = ({ open, onClose, coordinates, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
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
        'No coordinates available. Please move the map to set a location.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert coordinates to the format expected by the backend
      const animalData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        lat: Math.round(coordinates.lat), // Convert to microdegrees as Long
        long: Math.round(coordinates.lng), // Convert to microdegrees as Long
        userId: user.id,
      };

      await animalService.create(animalData);

      // Reset form
      setFormData({
        name: '',
        description: '',
        image: '',
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating animal:', error);
      setError('Failed to create animal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        description: '',
        image: '',
      });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Animal</DialogTitle>
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
                Location: {coordinates.lat.toFixed(6)},{' '}
                {coordinates.lng.toFixed(6)}
              </Alert>
            )}

            <TextField
              name="name"
              label="Animal Name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              disabled={loading}
            />

            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={3}
              disabled={loading}
            />

            <TextField
              name="image"
              label="Image URL"
              value={formData.image}
              onChange={handleChange}
              required
              fullWidth
              disabled={loading}
              helperText="Enter a valid URL for the animal image"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !coordinates}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Creating...' : 'Create Animal'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateAnimalModal;
