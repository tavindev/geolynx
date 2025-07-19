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
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!coordinates) {
      setError('No coordinates available. Please move the map to set a location.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert coordinates to the format expected by the backend
      const curiosityData = {
        description: formData.description,
        lat: Math.round(coordinates.lat * 1000000), // Convert to microdegrees as Long
        long: Math.round(coordinates.lng * 1000000), // Convert to microdegrees as Long
      };

      await historicalCuriosityService.create(curiosityData);
      
      // Reset form
      setFormData({
        description: '',
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating historical curiosity:', error);
      setError('Failed to create historical curiosity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        description: '',
      });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Historical Curiosity</DialogTitle>
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
                Location: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </Alert>
            )}

            <TextField
              name="description"
              label="Historical Curiosity Description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
              disabled={loading}
              helperText="Describe the historical significance or interesting fact about this location"
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
            {loading ? 'Creating...' : 'Add Curiosity'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCuriosityModal;