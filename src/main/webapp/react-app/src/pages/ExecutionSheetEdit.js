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
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { executionSheetService, worksheetService } from '../services/api';
import PolygonSelector from '../components/PolygonSelector';

const ExecutionSheetEdit = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [executionSheet, setExecutionSheet] = useState(null);
  const [worksheet, setWorksheet] = useState(null);
  const [operationDialogOpen, setOperationDialogOpen] = useState(false);
  const [polygonDialogOpen, setPolygonDialogOpen] = useState(false);
  const [polygonSelectorOpen, setPolygonSelectorOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    startingDate: '',
    finishingDate: '',
    observations: '',
  });

  // Operation form
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

  // Polygon form
  const [polygonForm, setPolygonForm] = useState({
    polygonId: '',
  });

  useEffect(() => {
    fetchExecutionSheet();
  }, [id]);

  const fetchExecutionSheet = async () => {
    try {
      setLoading(true);
      const response = await executionSheetService.getById(id);
      const sheet = response.data;
      setExecutionSheet(sheet);
      
      // Set form data
      setFormData({
        startingDate: sheet.startingDate ? sheet.startingDate.split('T')[0] : '',
        finishingDate: sheet.finishingDate ? sheet.finishingDate.split('T')[0] : '',
        observations: sheet.observations || '',
      });

      // Fetch worksheet details
      if (sheet.workSheetId) {
        try {
          const worksheetResponse = await worksheetService.get(sheet.workSheetId);
          setWorksheet(worksheetResponse.data);
        } catch (error) {
          console.error('Error fetching worksheet:', error);
        }
      }
    } catch (error) {
      enqueueSnackbar('Erro ao carregar folha de execução', { variant: 'error' });
      console.error('Error fetching execution sheet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Use the editOperation endpoint to update the execution sheet
      await executionSheetService.editOperation({
        executionSheetId: id,
        startingDate: formData.startingDate,
        finishingDate: formData.finishingDate,
        observations: formData.observations,
      });
      
      enqueueSnackbar('Folha de execução atualizada com sucesso', { variant: 'success' });
      navigate(`/dashboard/execution-sheets/${id}`);
    } catch (error) {
      enqueueSnackbar('Erro ao atualizar folha de execução', { variant: 'error' });
      console.error('Error updating execution sheet:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddOperation = () => {
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
    setOperationDialogOpen(true);
  };

  const handleEditOperation = (polygonId, operation) => {
    setSelectedOperation({ polygonId, operationId: operation.operationId });
    setOperationForm({
      operationCode: operation.operationCode || '',
      areaHaExecuted: operation.areaHaExecuted || '',
      areaPerc: operation.areaPerc || '',
      polygonId: polygonId.toString(),
      startingDate: operation.startingDate ? operation.startingDate.split('T')[0] : '',
      finishingDate: operation.finishingDate ? operation.finishingDate.split('T')[0] : '',
      observations: operation.observations || '',
      plannedCompletionDate: operation.plannedCompletionDate ? operation.plannedCompletionDate.split('T')[0] : '',
      estimatedDurationHours: operation.estimatedDurationHours || '',
    });
    setOperationDialogOpen(true);
  };

  const handleSaveOperation = async () => {
    try {
      if (selectedOperation) {
        // Edit existing operation
        await executionSheetService.editOperation({
          executionSheetId: id,
          polygonId: selectedOperation.polygonId,
          operationId: selectedOperation.operationId,
          ...operationForm,
        });
        enqueueSnackbar('Operação atualizada com sucesso', { variant: 'success' });
      } else {
        // Add new operation - this would need a new endpoint
        enqueueSnackbar('Funcionalidade de adicionar operação ainda não implementada', { variant: 'info' });
      }
      
      setOperationDialogOpen(false);
      fetchExecutionSheet();
    } catch (error) {
      enqueueSnackbar('Erro ao salvar operação', { variant: 'error' });
      console.error('Error saving operation:', error);
    }
  };

  const handleDeleteOperation = async (polygonId, operationId) => {
    if (window.confirm('Tem certeza que deseja remover esta operação?')) {
      try {
        // This would need a delete operation endpoint
        enqueueSnackbar('Funcionalidade de remover operação ainda não implementada', { variant: 'info' });
        // await executionSheetService.deleteOperation({ executionSheetId: id, polygonId, operationId });
        // fetchExecutionSheet();
      } catch (error) {
        enqueueSnackbar('Erro ao remover operação', { variant: 'error' });
      }
    }
  };

  const handleAddPolygon = () => {
    setPolygonForm({ polygonId: '' });
    setPolygonDialogOpen(true);
  };

  const handleSavePolygon = async () => {
    try {
      // This would need an add polygon endpoint
      enqueueSnackbar('Funcionalidade de adicionar polígono ainda não implementada', { variant: 'info' });
      setPolygonDialogOpen(false);
    } catch (error) {
      enqueueSnackbar('Erro ao adicionar polígono', { variant: 'error' });
    }
  };

  const handleDeletePolygon = async (polygonId) => {
    if (window.confirm('Tem certeza que deseja remover este polígono e todas as suas operações?')) {
      try {
        // This would need a delete polygon endpoint
        enqueueSnackbar('Funcionalidade de remover polígono ainda não implementada', { variant: 'info' });
      } catch (error) {
        enqueueSnackbar('Erro ao remover polígono', { variant: 'error' });
      }
    }
  };

  const handleOpenPolygonSelector = () => {
    if (executionSheet?.workSheetId) {
      setPolygonSelectorOpen(true);
    } else {
      enqueueSnackbar('Folha de obra não encontrada', { variant: 'warning' });
    }
  };

  const handlePolygonSelect = (polygon) => {
    setPolygonForm({ polygonId: polygon.id.toString() });
    setPolygonSelectorOpen(false);
    enqueueSnackbar(`Polígono ${polygon.id} selecionado`, { variant: 'success' });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'default',
      assigned: 'info',
      ongoing: 'warning',
      completed: 'success',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendente',
      assigned: 'Atribuído',
      ongoing: 'Em Progresso',
      completed: 'Concluído',
    };
    return labels[status] || status;
  };

if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!executionSheet) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity=\"error\">Folha de execução não encontrada</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth=\"lg\" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant=\"h4\" component=\"h1\">
            Editar Folha de Execução #{id}
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/dashboard/execution-sheets/${id}`)}
          >
            Voltar
          </Button>
        </Box>

        {/* Basic Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant=\"h6\" gutterBottom>
              Informações Básicas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label=\"Data de Início\"
                  type=\"date\"
                  value={formData.startingDate}
                  onChange={(e) => handleFormChange('startingDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label=\"Data de Fim\"
                  type=\"date\"
                  value={formData.finishingDate}
                  onChange={(e) => handleFormChange('finishingDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label=\"Observações\"
                  value={formData.observations}
                  onChange={(e) => handleFormChange('observations', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Polygons and Operations */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant=\"h6\">
                Polígonos e Operações
              </Typography>
              <Button
                size=\"small\"
                startIcon={<AddIcon />}
                onClick={handleAddPolygon}
                variant=\"outlined\"
              >
                Adicionar Polígono
              </Button>
            </Box>

            {executionSheet.polygonsOperations && executionSheet.polygonsOperations.length > 0 ? (
              executionSheet.polygonsOperations.map((polygon) => (
                <Card key={polygon.polygonId} sx={{ mb: 2, bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant=\"subtitle1\">
                        Polígono #{polygon.polygonId}
                      </Typography>
                      <Box>
                        <Button
                          size=\"small\"
                          startIcon={<AddIcon />}
                          onClick={handleAddOperation}
                          sx={{ mr: 1 }}
                        >
                          Adicionar Operação
                        </Button>
                        <IconButton
                          size=\"small\"
                          color=\"error\"
                          onClick={() => handleDeletePolygon(polygon.polygonId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <TableContainer>
                      <Table size=\"small\">
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Operador</TableCell>
                            <TableCell>Data Início</TableCell>
                            <TableCell>Data Fim</TableCell>
                            <TableCell align=\"right\">Ações</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {polygon.operations.map((operation) => (
                            <TableRow key={operation.operationId}>
                              <TableCell>{operation.operationId}</TableCell>
                              <TableCell>
                                <Chip
                                  label={getStatusLabel(operation.status)}
                                  color={getStatusColor(operation.status)}
                                  size=\"small\"
                                />
                              </TableCell>
                              <TableCell>{operation.operatorId || '-'}</TableCell>
                              <TableCell>
                                {operation.startingDate
                                  ? new Date(operation.startingDate).toLocaleDateString('pt-PT')
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {operation.finishingDate
                                  ? new Date(operation.finishingDate).toLocaleDateString('pt-PT')
                                  : '-'}
                              </TableCell>
                              <TableCell align=\"right\">
                                <IconButton
                                  size=\"small\"
                                  onClick={() => handleEditOperation(polygon.polygonId, operation)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size=\"small\"
                                  color=\"error\"
                                  onClick={() => handleDeleteOperation(polygon.polygonId, operation.operationId)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Alert severity=\"info\">Nenhum polígono encontrado</Alert>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant=\"outlined\"
            onClick={() => navigate(`/dashboard/execution-sheets/${id}`)}
          >
            Cancelar
          </Button>
          <Button
            variant=\"contained\"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </Box>
      </Paper>

      {/* Operation Dialog */}
      <Dialog open={operationDialogOpen} onClose={() => setOperationDialogOpen(false)} maxWidth=\"sm\" fullWidth>
        <DialogTitle>
          {selectedOperation ? 'Editar Operação' : 'Adicionar Operação'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label=\"Código da Operação\"
                value={operationForm.operationCode}
                onChange={(e) => setOperationForm({ ...operationForm, operationCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label=\"Área Executada (ha)\"
                type=\"number\"
                value={operationForm.areaHaExecuted}
                onChange={(e) => setOperationForm({ ...operationForm, areaHaExecuted: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label=\"Data de Início\"
                type=\"date\"
                value={operationForm.startingDate}
                onChange={(e) => setOperationForm({ ...operationForm, startingDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label=\"Data de Fim\"
                type=\"date\"
                value={operationForm.finishingDate}
                onChange={(e) => setOperationForm({ ...operationForm, finishingDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label=\"Observações\"
                value={operationForm.observations}
                onChange={(e) => setOperationForm({ ...operationForm, observations: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOperationDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveOperation} variant=\"contained\">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Polygon Dialog */}
      <Dialog open={polygonDialogOpen} onClose={() => setPolygonDialogOpen(false)} maxWidth=\"sm\" fullWidth>
        <DialogTitle>Adicionar Polígono</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label=\"ID do Polígono\"
                type=\"number\"
                value={polygonForm.polygonId}
                onChange={(e) => setPolygonForm({ polygonId: e.target.value })}
              />
              <Button
                variant=\"outlined\"
                onClick={handleOpenPolygonSelector}
                sx={{ minWidth: 'auto', px: 2 }}
                title=\"Selecionar no mapa\"
              >
                <MapIcon />
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPolygonDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSavePolygon} variant=\"contained\">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Polygon Selector */}
      <PolygonSelector
        open={polygonSelectorOpen}
        onClose={() => setPolygonSelectorOpen(false)}
        onSelect={handlePolygonSelect}
        worksheetId={executionSheet.workSheetId}
        title=\"Selecionar Polígono\"
      />
    </Container>
  );
 };
