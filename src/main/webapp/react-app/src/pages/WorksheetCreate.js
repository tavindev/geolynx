import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Map as MapIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { worksheetService, corporationService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PolygonSelector from '../components/PolygonSelector';
import { useSnackbar } from 'notistack';

const WorksheetUpdate = () => {
  const navigate = useNavigate();
  const { worksheetId } = useParams();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [serviceProviders, setServiceProviders] = useState([]);
  const [polygonSelectorOpen, setPolygonSelectorOpen] = useState(false);
  const [availablePolygons, setAvailablePolygons] = useState([]);
  
  const [formData, setFormData] = useState({
    // Metadata fields
    startingDate: '',
    finishingDate: '',
    issueDate: '',
    serviceProviderId: '',
    awardDate: '',
    issuingUserId: '',
    aigp: [],
    posaCode: '',
    posaDescription: '',
    pospCode: '',
    pospDescription: '',
    operations: [],
    // Feature fields
    features: []
  });

  const [newAigp, setNewAigp] = useState('');
  const [newOperation, setNewOperation] = useState({
    operationCode: '',
    operationDescription: '',
    areaHa: ''
  });

  useEffect(() => {
    fetchWorksheet();
    fetchServiceProviders();
    fetchAvailablePolygons();
  }, [worksheetId]);

  const fetchWorksheet = async () => {
    try {
      setLoading(true);
      const response = await worksheetService.get(worksheetId);
      const worksheet = response.data;
      
      // Parse the worksheet data
      if (worksheet) {
        setFormData({
          startingDate: worksheet.metadata?.starting_date ? worksheet.metadata.starting_date.split('T')[0] : '',
          finishingDate: worksheet.metadata?.finishing_date ? worksheet.metadata.finishing_date.split('T')[0] : '',
          issueDate: worksheet.metadata?.issue_date ? worksheet.metadata.issue_date.split('T')[0] : '',
          serviceProviderId: worksheet.metadata?.service_provider_id || '',
          awardDate: worksheet.metadata?.award_date ? worksheet.metadata.award_date.split('T')[0] : '',
          issuingUserId: worksheet.metadata?.issuing_user_id || user?.id || '',
          aigp: worksheet.metadata?.aigp || [],
          posaCode: worksheet.metadata?.posa_code || '',
          posaDescription: worksheet.metadata?.posa_description || '',
          pospCode: worksheet.metadata?.posp_code || '',
          pospDescription: worksheet.metadata?.posp_description || '',
          operations: worksheet.metadata?.operations || [],
          features: worksheet.features || []
        });
      }
    } catch (error) {
      console.error('Error fetching worksheet:', error);
      enqueueSnackbar('Erro ao carregar ficha de obra', { variant: 'error' });
      setError('Erro ao carregar ficha de obra');
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceProviders = async () => {
    try {
      const response = await corporationService.getAll();
      setServiceProviders(response.data || []);
    } catch (error) {
      console.error('Error fetching service providers:', error);
    }
  };

  const fetchAvailablePolygons = async () => {
    try {
      const response = await worksheetService.getPolygons();
      setAvailablePolygons(response.data || []);
    } catch (error) {
      console.error('Error fetching polygons:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAigp = () => {
    if (newAigp.trim()) {
      setFormData(prev => ({
        ...prev,
        aigp: [...prev.aigp, newAigp.trim()]
      }));
      setNewAigp('');
    }
  };

  const handleRemoveAigp = (index) => {
    setFormData(prev => ({
      ...prev,
      aigp: prev.aigp.filter((_, i) => i !== index)
    }));
  };

  const handleAddOperation = () => {
    if (newOperation.operationCode && newOperation.operationDescription && newOperation.areaHa) {
      setFormData(prev => ({
        ...prev,
        operations: [...prev.operations, {
          operation_code: newOperation.operationCode,
          operation_description: newOperation.operationDescription,
          area_ha: parseFloat(newOperation.areaHa)
        }]
      }));
      setNewOperation({
        operationCode: '',
        operationDescription: '',
        areaHa: ''
      });
    }
  };

  const handleRemoveOperation = (index) => {
    setFormData(prev => ({
      ...prev,
      operations: prev.operations.filter((_, i) => i !== index)
    }));
  };

  const handleAddPolygon = () => {
    setPolygonSelectorOpen(true);
  };

  const handlePolygonSelect = (polygon) => {
    // Check if polygon is already selected
    const isAlreadySelected = formData.features.some(
      feature => feature.properties?.id === polygon.id || 
                 feature.properties?.polygonId === polygon.id
    );

    if (isAlreadySelected) {
      setError('Este polígono já foi selecionado');
      return;
    }

    // Add the selected polygon to features
    let newFeature;
    
    if (polygon.type === 'custom') {
      // Custom drawn polygon
      newFeature = polygon.originalFeature || {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: polygon.feature?.geometry?.coordinates || []
        },
        properties: {
          ...polygon.properties,
          id: polygon.id,
          name: polygon.name
        }
      };
    } else {
      // Existing polygon from selection
      newFeature = polygon.feature || {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: []
        },
        properties: {
          ...polygon.properties,
          id: polygon.id,
          name: polygon.name
        }
      };
    }

    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeature]
    }));

    setError('');
  };

  const handleRemovePolygon = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const formatDate = (date) => {
    if (!date) return null;
    return date; // Already in YYYY-MM-DD format from input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.serviceProviderId) {
        setError('Por favor, selecione um fornecedor de serviços');
        setSaving(false);
        return;
      }

      if (formData.features.length === 0) {
        setError('Por favor, selecione pelo menos um polígono no mapa');
        setSaving(false);
        return;
      }

      // Create the GeoJSON structure expected by the backend
      const worksheetData = {
        type: "FeatureCollection",
        crs: {
          type: "name",
          properties: {
            name: "EPSG:3763" // Portuguese grid system
          }
        },
        features: formData.features,
        metadata: {
          id: parseInt(worksheetId), // Include the ID for update
          starting_date: formatDate(formData.startingDate),
          finishing_date: formatDate(formData.finishingDate),
          issue_date: formatDate(formData.issueDate),
          service_provider_id: parseInt(formData.serviceProviderId),
          award_date: formatDate(formData.awardDate),
          issuing_user_id: formData.issuingUserId || null,
          aigp: formData.aigp,
          posa_code: formData.posaCode,
          posa_description: formData.posaDescription,
          posp_code: formData.pospCode,
          posp_description: formData.pospDescription,
          operations: formData.operations
        }
      };

      // Use the same endpoint as create (import) - the backend should handle updates when ID is present
      await worksheetService.create(worksheetData);
      enqueueSnackbar('Ficha de obra atualizada com sucesso!', { variant: 'success' });
      navigate('/dashboard/worksheets');
    } catch (error) {
      console.error('Error updating worksheet:', error);
      enqueueSnackbar('Erro ao atualizar ficha de obra', { variant: 'error' });
      setError(error.response?.data?.error || error.response?.data?.message || 'Erro ao atualizar ficha de obra');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/worksheets')}
        >
          Voltar
        </Button>
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          Editar Ficha de Obra #{worksheetId}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Dates Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Datas
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de Início"
                name="startingDate"
                type="date"
                value={formData.startingDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de Fim"
                name="finishingDate"
                type="date"
                value={formData.finishingDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de Emissão"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de Adjudicação"
                name="awardDate"
                type="date"
                value={formData.awardDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Service Provider Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Fornecedor de Serviços
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Fornecedor de Serviços</InputLabel>
                <Select
                  name="serviceProviderId"
                  value={formData.serviceProviderId}
                  onChange={handleChange}
                  label="Fornecedor de Serviços"
                >
                  {serviceProviders.map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Polygon Selection Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Seleção de Polígonos
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<MapIcon />}
                  onClick={handleAddPolygon}
                >
                  Adicionar Polígono
                </Button>
              </Box>

              {formData.features.length > 0 ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {formData.features.length} polígono(s) selecionado(s)
                  </Typography>
                  {formData.features.map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        mb: 1,
                        backgroundColor: 'grey.50',
                        borderRadius: 1,
                      }}
                    >
                      <Box>
                        <Typography>
                          <strong>
                            {feature.properties?.name || 
                             `Polígono ${feature.properties?.id || feature.properties?.polygonId || index + 1}`}
                          </strong>
                        </Typography>
                        {feature.properties?.aigp && (
                          <Typography variant="body2" color="text.secondary">
                            AIGP: {feature.properties.aigp}
                          </Typography>
                        )}
                        {feature.properties?.description && (
                          <Typography variant="body2" color="text.secondary">
                            {feature.properties.description}
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => handleRemovePolygon(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Nenhum polígono selecionado. Clique no botão acima para adicionar polígonos.
                </Alert>
              )}
            </Grid>

            {/* AIGP Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                AIGP
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  label="Adicionar AIGP"
                  value={newAigp}
                  onChange={(e) => setNewAigp(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAigp();
                    }
                  }}
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddAigp}
                  startIcon={<AddIcon />}
                >
                  Adicionar
                </Button>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.aigp.map((code, index) => (
                  <Chip
                    key={index}
                    label={code}
                    onDelete={() => handleRemoveAigp(index)}
                  />
                ))}
              </Box>
            </Grid>

            {/* POSA/POSP Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Códigos POSA e POSP
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código POSA"
                name="posaCode"
                value={formData.posaCode}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Descrição POSA"
                name="posaDescription"
                value={formData.posaDescription}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código POSP"
                name="pospCode"
                value={formData.pospCode}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Descrição POSP"
                name="pospDescription"
                value={formData.pospDescription}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Operations Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Operações
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Código da Operação"
                  value={newOperation.operationCode}
                  onChange={(e) => setNewOperation({ ...newOperation, operationCode: e.target.value })}
                  size="small"
                />
                <TextField
                  label="Descrição da Operação"
                  value={newOperation.operationDescription}
                  onChange={(e) => setNewOperation({ ...newOperation, operationDescription: e.target.value })}
                  size="small"
                  sx={{ minWidth: 300 }}
                />
                <TextField
                  label="Área (ha)"
                  type="number"
                  value={newOperation.areaHa}
                  onChange={(e) => setNewOperation({ ...newOperation, areaHa: e.target.value })}
                  size="small"
                  sx={{ width: 100 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddOperation}
                  startIcon={<AddIcon />}
                >
                  Adicionar
                </Button>
              </Box>

              {formData.operations.map((operation, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    mb: 1,
                    backgroundColor: 'grey.50',
                    borderRadius: 1,
                  }}
                >
                  <Typography>
                    <strong>{operation.operation_code}</strong> - {operation.operation_description} ({operation.area_ha} ha)
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveOperation(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>

            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard/worksheets')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Polygon Selector Dialog */}
      <PolygonSelector
        open={polygonSelectorOpen}
        onClose={() => setPolygonSelectorOpen(false)}
        onSelect={handlePolygonSelect}
        title="Adicionar Polígono à Ficha de Obra"
        allowDrawing={true}
        availablePolygons={availablePolygons}
        selectedPolygonIds={formData.features.map(f => f.properties?.id || f.properties?.polygonId).filter(Boolean)}
      />
    </Container>
  );
};

export default WorksheetUpdate;
