import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { worksheetService } from '../services/api';

const WorksheetCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    priority: '',
    status: 'OPEN',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create a minimal valid GeoJSON structure
      const worksheetData = {
        type: "FeatureCollection",
        crs: {
          type: "name",
          properties: {
            name: "EPSG:4326"
          }
        },
        features: [],
        metadata: {
          id: Date.now(), // Generate a temporary ID
          startingDate: new Date().toISOString().split('T')[0],
          finishingDate: new Date().toISOString().split('T')[0],
          issueDate: new Date().toISOString().split('T')[0],
          serviceProviderId: 1,
          awardDate: new Date().toISOString().split('T')[0],
          issuingUserId: 1,
          aigp: [],
          posaCode: formData.type,
          posaDescription: formData.description,
          pospCode: formData.priority,
          pospDescription: formData.title,
          operations: []
        }
      };
      
      await worksheetService.create(worksheetData);
      enqueueSnackbar('Worksheet created successfully!', { variant: 'success' });
      setFormData({
        title: '',
        description: '',
        type: '',
        priority: '',
        status: 'OPEN',
      });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create worksheet.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create New Worksheet
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Type"
                  >
                    <MenuItem value="TASK">Task</MenuItem>
                    <MenuItem value="ISSUE">Issue</MenuItem>
                    <MenuItem value="FEATURE">Feature</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    label="Priority"
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="URGENT">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Worksheet'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default WorksheetCreate; 