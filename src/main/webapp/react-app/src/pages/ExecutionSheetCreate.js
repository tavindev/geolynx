import React, { useState, useEffect } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Dialog,
   DialogTitle,
   DialogContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { executionSheetService, worksheetService } from '../services/api';
import PolygonSelector from '../components/PolygonSelector';
import 'leaflet-draw/dist/leaflet.draw.css';

const steps = [
  'Selecionar Folha de Obra',
  'Informações Básicas',
  'Configurar Operações',
  'Configurar Polígonos',
  'Revisar e Criar',
];

const ExecutionSheetCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const worksheetIdFromUrl = searchParams.get('worksheetId') || location.state?.worksheetId;
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [worksheets, setWorksheets] = useState([]);
  const [selectedWorksheet, setSelectedWorksheet] = useState(null);
  const [polygonSelectorOpen, setPolygonSelectorOpen] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    workSheetId: null,
    startingDate: new Date().toISOString().split('T')[0],
    finishingDate: '',
    lastActivityDate: new Date().toISOString().split('T')[0],
    observations: '',
    operations: [],
    polygonsOperations: [],
  });

  // Operations form
  const [operationForm, setOperationForm] = useState({
    operationCode: '',
    areaHaExecuted: '',
    areaPerc: '',
    polygonId: '',
    startingDate: '',
    finishingDate: '',
    observations: '',
    plannedCompletionDate: '',
    estimatedDurationHours: '',
  });

  // Polygon operations form
  const [polygonForm, setPolygonForm] = useState({
    polygonId: '',
    operations: [],
  });

  useEffect(() => {
    fetchWorksheets();
  }, []);

  useEffect(() => {
    if (worksheetIdFromUrl && worksheets.length > 0) {
      const worksheet = worksheets.find(
        (w) => w.id.toString() === worksheetIdFromUrl.toString()
      );
      if (worksheet) {
        handleWorksheetSelect(worksheet);
        setActiveStep(1); // Skip to basic info step
      }
    }
  }, [worksheetIdFromUrl, worksheets]);

  const fetchWorksheets = async () => {
    try {
      const response = await worksheetService.getAll();
      setWorksheets(response.data || []);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar folhas de obra', { variant: 'error' });
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleWorksheetSelect = (worksheet) => {
    setSelectedWorksheet(worksheet);
    setFormData((prev) => ({
      ...prev,
      workSheetId: worksheet.id,
    }));
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOperationFormChange = (field, value) => {
    setOperationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addOperation = () => {
    if (operationForm.operationCode && operationForm.areaHaExecuted) {
      const newOperation = {
        id: Date.now(),
        ...operationForm,
        areaPerc: operationForm.areaPerc || '100',
      };
      setFormData((prev) => ({
        ...prev,
        operations: [...prev.operations, newOperation],
      }));
      setOperationForm({
        operationCode: '',
        areaHaExecuted: '',
        areaPerc: '',
        polygonId: '',
        startingDate: '',
        finishingDate: '',
        observations: '',
        plannedCompletionDate: '',
        estimatedDurationHours: '',
      });
    }
  };

  const removeOperation = (index) => {
    setFormData((prev) => ({
      ...prev,
      operations: prev.operations.filter((_, i) => i !== index),
    }));
  };

  const addPolygonOperation = () => {
    if (polygonForm.polygonId) {
      const newPolygonOp = {
        polygonId: parseInt(polygonForm.polygonId),
        operations: formData.operations.map((op) => ({
          operationId: op.id,
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
        polygonsOperations: [...prev.polygonsOperations, newPolygonOp],
      }));
      setPolygonForm({ polygonId: '', operations: [] });
    }
  };

  const removePolygonOperation = (index) => {
    setFormData((prev) => ({
      ...prev,
      polygonsOperations: prev.polygonsOperations.filter((_, i) => i !== index),
    }));
  };

  const handleOpenPolygonSelector = () => {
    if (formData.workSheetId) {
      setPolygonSelectorOpen(true);
    } else {
      enqueueSnackbar('Por favor, selecione uma folha de obra primeiro', { variant: 'warning' });
    }
  };

  const handleClosePolygonSelector = () => {
    setPolygonSelectorOpen(false);
  };

  const handlePolygonSelect = (polygon) => {
    // Update operation form with selected polygon ID
    setOperationForm((prev) => ({
      ...prev,
      polygonId: polygon.id.toString(),
    }));

    // Also update the polygon form for quick addition
    setPolygonForm((prev) => ({
      ...prev,
      polygonId: polygon.id.toString(),
    }));

    // Close the selector dialog
    handleClosePolygonSelector();

    if (polygon.type === 'custom') {
      enqueueSnackbar(`Polígono personalizado "${polygon.name}" selecionado`, { variant: 'success' });
    } else {
      enqueueSnackbar(`Polígono ${polygon.id} selecionado`, { variant: 'success' });
    }
  };

  const handlePolygonCreated = async (polygonData) => {
    // For custom polygons, we don't need to store them separately in the backend
    // They will be included in the execution sheet data when it's created
    console.log('Custom polygon created for execution sheet:', polygonData);
    return polygonData; // Just return the data, don't make API call
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await executionSheetService.create(formData);
      enqueueSnackbar('Folha de execução criada com sucesso!', {
        variant: 'success',
      });
      navigate('/dashboard/execution-sheets');
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Erro ao criar folha de execução',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  const renderWorksheetSelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Selecione uma Folha de Obra
      </Typography>

      {selectedWorksheet && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Folha de obra pré-selecionada:{' '}
          <strong>Folha #{selectedWorksheet.id}</strong>
        </Alert>
      )}

      <Grid container spacing={2}>
        {worksheets.map((worksheet) => (
          <Grid item xs={12} md={6} key={worksheet.id}>
            <Card
              sx={{
                cursor: 'pointer',
                border: selectedWorksheet?.id === worksheet.id ? 2 : 1,
                borderColor:
                  selectedWorksheet?.id === worksheet.id
                    ? 'primary.main'
                    : 'divider',
              }}
              onClick={() => handleWorksheetSelect(worksheet)}
            >
              <CardContent>
                <Typography variant="h6">Folha #{worksheet.id}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Data de Início: {worksheet.startingDate || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Data de Fim: {worksheet.finishingDate || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Fornecedor: {worksheet.serviceProviderId || 'N/A'}
                </Typography>
                {worksheet.aigp && worksheet.aigp.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {worksheet.aigp.map((aigp, index) => (
                      <Chip
                        key={index}
                        label={aigp}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderBasicInfo = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Informações Básicas
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Data de Início"
            type="date"
            value={formData.startingDate}
            onChange={(e) => handleFormChange('startingDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Data de Fim"
            type="date"
            value={formData.finishingDate}
            onChange={(e) => handleFormChange('finishingDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Observações"
            value={formData.observations}
            onChange={(e) => handleFormChange('observations', e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderOperationsConfig = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configurar Operações
      </Typography>

      {/* Add Operation Form */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Adicionar Operação
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Código da Operação"
                value={operationForm.operationCode}
                onChange={(e) =>
                  handleOperationFormChange('operationCode', e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Área Executada (ha)"
                type="number"
                value={operationForm.areaHaExecuted}
                onChange={(e) =>
                  handleOperationFormChange('areaHaExecuted', e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="ID do Polígono"
                  type="number"
                  value={operationForm.polygonId}
                  onChange={(e) =>
                    handleOperationFormChange('polygonId', e.target.value)
                  }
                />
                <Button
                  variant="outlined"
                  onClick={handleOpenPolygonSelector}
                  sx={{ minWidth: 'auto', px: 2 }}
                  title="Selecionar no mapa"
                  disabled={!formData.workSheetId}
                >
                  🗺️
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Duração Estimada (h)"
                type="number"
                value={operationForm.estimatedDurationHours}
                onChange={(e) =>
                  handleOperationFormChange(
                    'estimatedDurationHours',
                    e.target.value
                  )
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de Início"
                type="date"
                value={operationForm.startingDate}
                onChange={(e) =>
                  handleOperationFormChange('startingDate', e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data de Fim"
                type="date"
                value={operationForm.finishingDate}
                onChange={(e) =>
                  handleOperationFormChange('finishingDate', e.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Observações"
                value={operationForm.observations}
                onChange={(e) =>
                  handleOperationFormChange('observations', e.target.value)
                }
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addOperation}
              disabled={
                !operationForm.operationCode || !operationForm.areaHaExecuted
              }
            >
              Adicionar Operação
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Operations List */}
      {formData.operations.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Área (ha)</TableCell>
                <TableCell>Polígono</TableCell>
                <TableCell>Duração (h)</TableCell>
                <TableCell>Data Início</TableCell>
                <TableCell>Data Fim</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.operations.map((operation, index) => (
                <TableRow key={operation.id}>
                  <TableCell>{operation.operationCode}</TableCell>
                  <TableCell>{operation.areaHaExecuted}</TableCell>
                  <TableCell>{operation.polygonId || '-'}</TableCell>
                  <TableCell>{operation.estimatedDurationHours || '-'}</TableCell>
                  <TableCell>{operation.startingDate || '-'}</TableCell>
                  <TableCell>{operation.finishingDate || '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeOperation(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const renderPolygonsConfig = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configurar Polígonos
      </Typography>

      {/* Add Polygon Form */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Adicionar Polígono
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="ID do Polígono"
                  type="number"
                  value={polygonForm.polygonId}
                  onChange={(e) =>
                    setPolygonForm((prev) => ({
                      ...prev,
                      polygonId: e.target.value,
                    }))
                  }
                />
                <Button
                  variant="outlined"
                  onClick={handleOpenPolygonSelector}
                  sx={{ minWidth: 'auto', px: 2 }}
                  title="Selecionar no mapa"
                  disabled={!formData.workSheetId}
                >
                  🗺️
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addPolygonOperation}
                disabled={
                  !polygonForm.polygonId || formData.operations.length === 0
                }
              >
                Adicionar Polígono
              </Button>
              {formData.operations.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                  Adicione operações primeiro
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Polygons List */}
      {formData.polygonsOperations.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID do Polígono</TableCell>
                <TableCell>Número de Operações</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.polygonsOperations.map((polygon, index) => (
                <TableRow key={index}>
                  <TableCell>{polygon.polygonId}</TableCell>
                  <TableCell>{polygon.operations.length}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removePolygonOperation(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const renderReview = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Revisar Informações
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Informações Básicas
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Folha de Obra"
                    secondary={`#${formData.workSheetId}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Data de Início"
                    secondary={formData.startingDate}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Data de Fim"
                    secondary={formData.finishingDate || 'Não definida'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Observações"
                    secondary={formData.observations || 'Nenhuma'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Resumo
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Operações"
                    secondary={`${formData.operations.length} operações`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Polígonos"
                    secondary={`${formData.polygonsOperations.length} polígonos`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderWorksheetSelection();
      case 1:
        return renderBasicInfo();
      case 2:
        return renderOperationsConfig();
      case 3:
        return renderPolygonsConfig();
      case 4:
        return renderReview();
      default:
        return 'Unknown step';
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.workSheetId !== null;
      case 1:
        return formData.startingDate;
      case 2:
        return formData.operations.length > 0;
      case 3:
        return formData.polygonsOperations.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Criar Folha de Execução
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 3 }}>{getStepContent(activeStep)}</Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            Anterior
          </Button>

          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !isStepValid(activeStep)}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <SaveIcon />
                }
              >
                {loading ? 'Criando...' : 'Criar Folha de Execução'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid(activeStep)}
                endIcon={<ArrowForwardIcon />}
              >
                Próximo
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Polygon Selector Modal */}
      <PolygonSelector
        open={polygonSelectorOpen}
        onClose={handleClosePolygonSelector}
        onSelect={handlePolygonSelect}
        onPolygonCreated={handlePolygonCreated}
        worksheetId={formData.workSheetId}
        allowDrawing={true}
        title="Selecionar ou Desenhar Polígono"
      />
    </Container>
  );
};

export default ExecutionSheetCreate;