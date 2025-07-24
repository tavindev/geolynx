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
import PolygonSelectionMap from '../components/PolygonSelectionMap';

const steps = [
  'Selecionar Folha de Obra',
  'Informações Básicas',
  'Configurar Operações',
  'Revisar e Criar',
];

// Predefined operation codes - these should come from the worksheet
const OPERATION_CODES = [
  { code: 'OP001', description: 'Limpeza de Terreno' },
  { code: 'OP002', description: 'Plantação' },
  { code: 'OP003', description: 'Manutenção' },
  { code: 'OP004', description: 'Colheita' },
  { code: 'OP005', description: 'Preparação do Solo' },
];

const ExecutionSheetCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const worksheetIdFromUrl =
    searchParams.get('worksheetId') || location.state?.worksheetId;
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [worksheets, setWorksheets] = useState([]);
  const [selectedWorksheet, setSelectedWorksheet] = useState(null);

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
    areaPerc: '100',
    polygonId: '',
    startingDate: new Date().toISOString().split('T')[0],
    finishingDate: '',
    observations: '',
    estimatedDurationHours: '',
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
    const today = new Date().toISOString().split('T')[0];

    if (field === 'startingDate') {
      if (value < today) {
        enqueueSnackbar('A data de início não pode ser no passado', {
          variant: 'warning',
        });
        return;
      }
      if (formData.finishingDate && value > formData.finishingDate) {
        setFormData((prev) => ({
          ...prev,
          startingDate: value,
          finishingDate: '',
        }));
        enqueueSnackbar(
          'Data de fim foi limpa pois estava antes da nova data de início',
          { variant: 'info' }
        );
        return;
      }
    }

    if (field === 'finishingDate') {
      if (value && formData.startingDate && value < formData.startingDate) {
        enqueueSnackbar(
          'A data de fim não pode ser anterior à data de início',
          { variant: 'warning' }
        );
        return;
      }
      if (value < today) {
        enqueueSnackbar('A data de fim não pode ser no passado', {
          variant: 'warning',
        });
        return;
      }
    }

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
        areaPerc: '100',
        startingDate: new Date().toISOString().split('T')[0],
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Get unique polygon IDs from the worksheet operations
      const polygonIds = [];
      if (selectedWorksheet && selectedWorksheet.metadata && selectedWorksheet.metadata.operations) {
        selectedWorksheet.metadata.operations.forEach(op => {
          if (op.polygonId && !polygonIds.includes(op.polygonId)) {
            polygonIds.push(op.polygonId);
          }
        });
      }

      // If no polygon IDs found in operations, get from features
      if (polygonIds.length === 0 && selectedWorksheet && selectedWorksheet.features) {
        selectedWorksheet.features.forEach(feature => {
          if (feature.properties && feature.properties.polygonId) {
            const id = parseInt(feature.properties.polygonId);
            if (!polygonIds.includes(id)) {
              polygonIds.push(id);
            }
          }
        });
      }

      // Create polygon operations for each polygon
      const polygonsOperations = polygonIds.map(polygonId => ({
        polygonId: parseInt(polygonId),
        operations: formData.operations.map((op, index) => ({
          operationId: index + 1,
          status: 'pending',
          startingDate: null,
          finishingDate: null,
          lastActivityDate: null,
          observations: '',
          tracks: [],
          operatorId: null,
        })),
      }));

      const executionSheetData = {
        ...formData,
        polygonsOperations,
      };

      await executionSheetService.create(executionSheetData);
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
            inputProps={{
              min:
                formData.startingDate || new Date().toISOString().split('T')[0],
            }}
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

  const renderOperationsConfig = () => {
    // Get available operation codes from selected worksheet
    const availableOperations = selectedWorksheet?.metadata?.operations || [];
    const operationCodes = availableOperations.length > 0 
      ? availableOperations.map(op => ({
          code: op.operationCode,
          description: op.operationDescription
        }))
      : OPERATION_CODES;

    return (
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
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Código da Operação</InputLabel>
                  <Select
                    value={operationForm.operationCode}
                    onChange={(e) =>
                      handleOperationFormChange('operationCode', e.target.value)
                    }
                    label="Código da Operação"
                  >
                    <MenuItem value="">
                      <em>Selecione</em>
                    </MenuItem>
                    {operationCodes.map((op) => (
                      <MenuItem key={op.code} value={op.code}>
                        {op.code} - {op.description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Área (ha)"
                  type="number"
                  value={operationForm.areaHaExecuted}
                  onChange={(e) =>
                    handleOperationFormChange('areaHaExecuted', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Área (%)"
                  type="number"
                  value={operationForm.areaPerc}
                  onChange={(e) =>
                    handleOperationFormChange('areaPerc', e.target.value)
                  }
                  required
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Duração (h)"
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
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Data Conclusão Planeada"
                  type="date"
                  value={operationForm.plannedCompletionDate}
                  onChange={(e) =>
                    handleOperationFormChange('plannedCompletionDate', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
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
                  required
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
                  !operationForm.operationCode || 
                  !operationForm.areaHaExecuted ||
                  !operationForm.areaPerc ||
                  !operationForm.startingDate
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
                  <TableCell>Área (%)</TableCell>
                  <TableCell>Duração (h)</TableCell>
                  <TableCell>Data Início</TableCell>
                  <TableCell>Data Fim</TableCell>
                  <TableCell>Data Conclusão Planeada</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.operations.map((operation, index) => (
                  <TableRow key={operation.id}>
                    <TableCell>{operation.operationCode}</TableCell>
                    <TableCell>{operation.areaHaExecuted}</TableCell>
                    <TableCell>{operation.areaPerc}%</TableCell>
                    <TableCell>
                      {operation.estimatedDurationHours || '-'}
                    </TableCell>
                    <TableCell>{operation.startingDate || '-'}</TableCell>
                    <TableCell>{operation.finishingDate || '-'}</TableCell>
                    <TableCell>{operation.plannedCompletionDate || '-'}</TableCell>
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

        {/* Polygon Operations Info */}
        <Alert severity="info" sx={{ mt: 3 }}>
          Os polígonos serão automaticamente associados às operações com base nas configurações da folha de obra selecionada.
        </Alert>
      </Box>
    );
  };

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
                    secondary={`${formData.operations.length} operações configuradas`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Polígonos"
                    secondary="Serão criados automaticamente com base na folha de obra"
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

    </Container>
  );
};

export default ExecutionSheetCreate;
