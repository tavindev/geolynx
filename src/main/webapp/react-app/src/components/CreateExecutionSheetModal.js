import React, { useState, useEffect } from 'react';
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
  Typography,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  MapOutlined as MapIcon,
} from '@mui/icons-material';
import { executionSheetService, worksheetService } from '../services/api';

const CreateExecutionSheetModal = ({
  open,
  onClose,
  coordinates,
  user,
  onSuccess,
  preselectedPolygon = null,
  preselectedWorksheet = null,
}) => {
  const [formData, setFormData] = useState({
    workSheetId: preselectedWorksheet?.id || '',
    startingDate: new Date().toISOString().split('T')[0],
    finishingDate: '',
    observations: '',
    operations: [],
    polygonsOperations: [],
  });

  const [operationForm, setOperationForm] = useState({
    operationCode: '',
    areaHaExecuted: '',
    estimatedDurationHours: '',
    observations: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [worksheets, setWorksheets] = useState([]);
  const [selectedWorksheet, setSelectedWorksheet] =
    useState(preselectedWorksheet);

  useEffect(() => {
    if (open) {
      loadWorksheets();
    }
  }, [open]);

  useEffect(() => {
    if (preselectedWorksheet) {
      setFormData((prev) => ({
        ...prev,
        workSheetId: preselectedWorksheet.id,
      }));
      setSelectedWorksheet(preselectedWorksheet);
    }
  }, [preselectedWorksheet]);

  useEffect(() => {
    if (preselectedPolygon && formData.operations.length > 0) {
      // Auto-add polygon operations when we have both polygon and operations
      const polygonOps = {
        polygonId:
          preselectedPolygon.properties.polygon_id ||
          preselectedPolygon.properties.id,
        operations: formData.operations.map((op, idx) => ({
          operationId: idx + 1,
          status: 'pending',
          startingDate: null,
          finishingDate: null,
          lastActivityDate: null,
          observations: '',
          tracks: [],
          operatorId: null,
        })),
      };
      setFormData((prev) => ({
        ...prev,
        polygonsOperations: [polygonOps],
      }));
    }
  }, [preselectedPolygon, formData.operations]);

  const loadWorksheets = async () => {
    try {
      const response = await worksheetService.getAll();
      const worksheetData = response.data || response;
      if (Array.isArray(worksheetData)) {
        setWorksheets(worksheetData);
      }
    } catch (error) {
      console.error('Error loading worksheets:', error);
      setError('Erro ao carregar folhas de obra');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'workSheetId') {
      const worksheet = worksheets.find((w) => w.id.toString() === value);
      setSelectedWorksheet(worksheet);
    }
  };

  const handleOperationChange = (e) => {
    const { name, value } = e.target;
    setOperationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addOperation = () => {
    if (operationForm.operationCode && operationForm.areaHaExecuted) {
      const newOperation = {
        ...operationForm,
        areaPerc: 0, // Will be calculated by backend
        startingDate: formData.startingDate,
        finishingDate: formData.finishingDate,
        plannedCompletionDate: formData.finishingDate,
      };

      setFormData((prev) => ({
        ...prev,
        operations: [...prev.operations, newOperation],
      }));

      // Reset operation form
      setOperationForm({
        operationCode: '',
        areaHaExecuted: '',
        estimatedDurationHours: '',
        observations: '',
      });
    }
  };

  const removeOperation = (index) => {
    setFormData((prev) => ({
      ...prev,
      operations: prev.operations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.workSheetId) {
      setError('Por favor, selecione uma folha de obra');
      return;
    }

    if (formData.operations.length === 0) {
      setError('Por favor, adicione pelo menos uma operação');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data for submission
      const executionSheetData = {
        ...formData,
        lastActivityDate: formData.startingDate,
        // Ensure polygonsOperations are properly set
        polygonsOperations:
          formData.polygonsOperations.length > 0
            ? formData.polygonsOperations
            : preselectedPolygon
            ? [
                {
                  polygonId:
                    preselectedPolygon.properties.polygon_id ||
                    preselectedPolygon.properties.id,
                  operations: formData.operations.map((op, idx) => ({
                    operationId: idx + 1,
                    status: 'pending',
                    startingDate: null,
                    finishingDate: null,
                    lastActivityDate: null,
                    observations: '',
                    tracks: [],
                    operatorId: null,
                  })),
                },
              ]
            : [],
      };

      await executionSheetService.create(executionSheetData);

      // Reset form
      setFormData({
        workSheetId: '',
        startingDate: new Date().toISOString().split('T')[0],
        finishingDate: '',
        observations: '',
        operations: [],
        polygonsOperations: [],
      });
      setOperationForm({
        operationCode: '',
        areaHaExecuted: '',
        estimatedDurationHours: '',
        observations: '',
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating execution sheet:', error);
      setError(
        error.response?.data?.message ||
          'Falha ao criar folha de execução. Por favor, tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        workSheetId: preselectedWorksheet?.id || '',
        startingDate: new Date().toISOString().split('T')[0],
        finishingDate: '',
        observations: '',
        operations: [],
        polygonsOperations: [],
      });
      setOperationForm({
        operationCode: '',
        areaHaExecuted: '',
        estimatedDurationHours: '',
        observations: '',
      });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MapIcon color="primary" />
          <Typography variant="h6">Criar Folha de Execução</Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

            {preselectedPolygon && (
              <Alert severity="info">
                Polígono selecionado: ID{' '}
                {preselectedPolygon.properties.polygon_id ||
                  preselectedPolygon.properties.id}
                {preselectedPolygon.properties.aigp &&
                  ` - AIGP: ${preselectedPolygon.properties.aigp}`}
              </Alert>
            )}

            {/* Worksheet Selection */}
            <FormControl fullWidth required>
              <InputLabel>Folha de Obra</InputLabel>
              <Select
                name="workSheetId"
                value={formData.workSheetId}
                onChange={handleChange}
                disabled={loading || !!preselectedWorksheet}
              >
                {worksheets.map((worksheet) => (
                  <MenuItem key={worksheet.id} value={worksheet.id}>
                    Folha #{worksheet.id} - {worksheet.aigp?.join(', ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Dates */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="startingDate"
                  label="Data de Início"
                  type="date"
                  value={formData.startingDate}
                  onChange={handleChange}
                  required
                  fullWidth
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="finishingDate"
                  label="Data de Fim"
                  type="date"
                  value={formData.finishingDate}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            {/* Observations */}
            <TextField
              name="observations"
              label="Observações"
              value={formData.observations}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              disabled={loading}
            />

            <Divider />

            {/* Operations Section */}
            <Typography variant="subtitle1" fontWeight="bold">
              Operações
            </Typography>

            {/* Add Operation Form */}
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="operationCode"
                    label="Código da Operação"
                    value={operationForm.operationCode}
                    onChange={handleOperationChange}
                    fullWidth
                    disabled={loading}
                    placeholder="Ex: OP001"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="areaHaExecuted"
                    label="Área (ha)"
                    type="number"
                    value={operationForm.areaHaExecuted}
                    onChange={handleOperationChange}
                    fullWidth
                    disabled={loading}
                    inputProps={{ step: '0.01' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="estimatedDurationHours"
                    label="Duração Estimada (horas)"
                    type="number"
                    value={operationForm.estimatedDurationHours}
                    onChange={handleOperationChange}
                    fullWidth
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      height: '100%',
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={addOperation}
                      disabled={
                        !operationForm.operationCode ||
                        !operationForm.areaHaExecuted ||
                        loading
                      }
                      fullWidth
                    >
                      Adicionar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Operations List */}
            {formData.operations.length > 0 && (
              <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                {formData.operations.map((operation, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => removeOperation(index)}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${operation.operationCode} - ${operation.areaHaExecuted} ha`}
                      secondary={
                        operation.estimatedDurationHours
                          ? `${operation.estimatedDurationHours} horas`
                          : null
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {formData.operations.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
              >
                Nenhuma operação adicionada
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={
              loading ||
              !formData.workSheetId ||
              formData.operations.length === 0
            }
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Criando...' : 'Criar Folha de Execução'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateExecutionSheetModal;
