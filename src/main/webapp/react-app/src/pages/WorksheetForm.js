import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { worksheetService } from '../services/api';

// Predefined operation codes - in a real app, these would come from an API
const OPERATION_CODES = [
  { code: 'OP001', description: 'Limpeza de Terreno' },
  { code: 'OP002', description: 'Plantação' },
  { code: 'OP003', description: 'Manutenção' },
  { code: 'OP004', description: 'Colheita' },
  { code: 'OP005', description: 'Preparação do Solo' },
];

const POSA_CODES = [
  { code: 'POSA001', description: 'Plano Operacional de Silvicultura A' },
  { code: 'POSA002', description: 'Plano Operacional de Silvicultura B' },
  { code: 'POSA003', description: 'Plano Operacional de Silvicultura C' },
];

const POSP_CODES = [
  { code: 'POSP001', description: 'Plano Operacional de Silvicultura Preventiva A' },
  { code: 'POSP002', description: 'Plano Operacional de Silvicultura Preventiva B' },
  { code: 'POSP003', description: 'Plano Operacional de Silvicultura Preventiva C' },
];

const WorksheetForm = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditMode = !!id;

  // Form data matching the actual worksheet schema
  const [formData, setFormData] = useState({
    id: id || null,
    startingDate: '',
    finishingDate: '',
    issueDate: new Date().toISOString().split('T')[0],
    serviceProviderId: '',
    awardDate: '',
    issuingUserId: '',
    aigp: [],
    posaCode: '',
    posaDescription: '',
    pospCode: '',
    pospDescription: '',
    operations: [],
    features: [],
  });

  const [aigpInput, setAigpInput] = useState('');
  const [operationForm, setOperationForm] = useState({
    operationCode: '',
    operationDescription: '',
    areaHa: '',
    polygonId: '',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchWorksheet();
    }
  }, [id]);

  const fetchWorksheet = async () => {
    try {
      setLoading(true);
      const response = await worksheetService.get(id);
      const worksheet = response.data;
      
      // Extract metadata from the response
      const metadata = worksheet.metadata || {};
      
      setFormData({
        id: metadata.id || id,
        startingDate: metadata.startingDate ? metadata.startingDate.split('T')[0] : '',
        finishingDate: metadata.finishingDate ? metadata.finishingDate.split('T')[0] : '',
        issueDate: metadata.issueDate ? metadata.issueDate.split('T')[0] : '',
        serviceProviderId: metadata.serviceProviderId || '',
        awardDate: metadata.awardDate ? metadata.awardDate.split('T')[0] : '',
        issuingUserId: metadata.issuingUserId || '',
        aigp: metadata.aigp || [],
        posaCode: metadata.posaCode || '',
        posaDescription: metadata.posaDescription || '',
        pospCode: metadata.pospCode || '',
        pospDescription: metadata.pospDescription || '',
        operations: metadata.operations || [],
        features: worksheet.features || [],
      });
    } catch (error) {
      enqueueSnackbar('Erro ao carregar folha de obra', { variant: 'error' });
      console.error('Error fetching worksheet:', error);
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

  const handlePosaCodeChange = (code) => {
    const selected = POSA_CODES.find(p => p.code === code);
    setFormData(prev => ({
      ...prev,
      posaCode: code,
      posaDescription: selected ? selected.description : '',
    }));
  };

  const handlePospCodeChange = (code) => {
    const selected = POSP_CODES.find(p => p.code === code);
    setFormData(prev => ({
      ...prev,
      pospCode: code,
      pospDescription: selected ? selected.description : '',
    }));
  };

  const handleOperationCodeChange = (code) => {
    const selected = OPERATION_CODES.find(op => op.code === code);
    setOperationForm(prev => ({
      ...prev,
      operationCode: code,
      operationDescription: selected ? selected.description : '',
    }));
  };

  const handleAddAigp = () => {
    if (aigpInput.trim() && !formData.aigp.includes(aigpInput.trim())) {
      setFormData(prev => ({
        ...prev,
        aigp: [...prev.aigp, aigpInput.trim()],
      }));
      setAigpInput('');
    }
  };

  const handleRemoveAigp = (index) => {
    setFormData(prev => ({
      ...prev,
      aigp: prev.aigp.filter((_, i) => i !== index),
    }));
  };

  const handleAddOperation = () => {
    if (operationForm.operationCode && operationForm.areaHa) {
      setFormData(prev => ({
        ...prev,
        operations: [...prev.operations, { 
          operationCode: operationForm.operationCode,
          operationDescription: operationForm.operationDescription,
          areaHa: operationForm.areaHa,
          polygonId: operationForm.polygonId ? parseInt(operationForm.polygonId) : null,
        }],
      }));
      setOperationForm({
        operationCode: '',
        operationDescription: '',
        areaHa: '',
        polygonId: '',
      });
    }
  };

  const handleRemoveOperation = (index) => {
    setFormData(prev => ({
      ...prev,
      operations: prev.operations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.startingDate || !formData.finishingDate) {
      enqueueSnackbar('Por favor, preencha as datas de início e fim', { variant: 'warning' });
      return;
    }

    setSaving(true);
    try {
      const worksheetData = {
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:4326'
          }
        },
        features: formData.features,
        metadata: {
          id: formData.id,
          startingDate: formData.startingDate,
          finishingDate: formData.finishingDate,
          issueDate: formData.issueDate,
          serviceProviderId: formData.serviceProviderId ? parseInt(formData.serviceProviderId) : null,
          awardDate: formData.awardDate,
          issuingUserId: formData.issuingUserId ? parseInt(formData.issuingUserId) : null,
          aigp: formData.aigp,
          posaCode: formData.posaCode,
          posaDescription: formData.posaDescription,
          pospCode: formData.pospCode,
          pospDescription: formData.pospDescription,
          operations: formData.operations.map(op => ({
            operationCode: op.operationCode,
            operationDescription: op.operationDescription,
            areaHa: parseFloat(op.areaHa),
            polygonId: op.polygonId,
          })),
        },
      };

      await worksheetService.create(worksheetData);
      enqueueSnackbar(
        isEditMode ? 'Folha de obra atualizada com sucesso' : 'Folha de obra criada com sucesso',
        { variant: 'success' }
      );
      navigate('/dashboard/worksheets');
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Erro ao salvar folha de obra',
        { variant: 'error' }
      );
      console.error('Error saving worksheet:', error);
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Editar Folha de Obra' : 'Criar Folha de Obra'}
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard/worksheets')}
          >
            Voltar
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Informações Básicas
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Data de Emissão"
              type="date"
              value={formData.issueDate}
              onChange={(e) => handleFormChange('issueDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Data de Fim"
              type="date"
              value={formData.finishingDate}
              onChange={(e) => handleFormChange('finishingDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Data de Adjudicação"
              type="date"
              value={formData.awardDate}
              onChange={(e) => handleFormChange('awardDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="ID do Fornecedor de Serviço"
              type="number"
              value={formData.serviceProviderId}
              onChange={(e) => handleFormChange('serviceProviderId', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="ID do Utilizador Emissor"
              type="number"
              value={formData.issuingUserId}
              onChange={(e) => handleFormChange('issuingUserId', e.target.value)}
            />
          </Grid>

          {/* POSA and POSP Selection */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Planos Operacionais
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Código POSA</InputLabel>
              <Select
                value={formData.posaCode}
                onChange={(e) => handlePosaCodeChange(e.target.value)}
                label="Código POSA"
              >
                <MenuItem value="">
                  <em>Nenhum</em>
                </MenuItem>
                {POSA_CODES.map(posa => (
                  <MenuItem key={posa.code} value={posa.code}>
                    {posa.code} - {posa.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Descrição POSA"
              value={formData.posaDescription}
              onChange={(e) => handleFormChange('posaDescription', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Código POSP</InputLabel>
              <Select
                value={formData.pospCode}
                onChange={(e) => handlePospCodeChange(e.target.value)}
                label="Código POSP"
              >
                <MenuItem value="">
                  <em>Nenhum</em>
                </MenuItem>
                {POSP_CODES.map(posp => (
                  <MenuItem key={posp.code} value={posp.code}>
                    {posp.code} - {posp.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Descrição POSP"
              value={formData.pospDescription}
              onChange={(e) => handleFormChange('pospDescription', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>

          {/* AIGP Management */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              AIGPs
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Adicionar AIGP"
                value={aigpInput}
                onChange={(e) => setAigpInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAigp();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddAigp}
                disabled={!aigpInput.trim()}
              >
                Adicionar
              </Button>
            </Box>

            {formData.aigp.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.aigp.map((aigp, index) => (
                  <Chip
                    key={index}
                    label={aigp}
                    onDelete={() => handleRemoveAigp(index)}
                  />
                ))}
              </Box>
            )}
          </Grid>

          {/* Operations Management */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Operações
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Código da Operação</InputLabel>
                      <Select
                        value={operationForm.operationCode}
                        onChange={(e) => handleOperationCodeChange(e.target.value)}
                        label="Código da Operação"
                      >
                        <MenuItem value="">
                          <em>Selecione</em>
                        </MenuItem>
                        {OPERATION_CODES.map(op => (
                          <MenuItem key={op.code} value={op.code}>
                            {op.code} - {op.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Descrição da Operação"
                      value={operationForm.operationDescription}
                      onChange={(e) => setOperationForm({ ...operationForm, operationDescription: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      label="Área (ha)"
                      type="number"
                      value={operationForm.areaHa}
                      onChange={(e) => setOperationForm({ ...operationForm, areaHa: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      label="ID do Polígono"
                      type="number"
                      value={operationForm.polygonId}
                      onChange={(e) => setOperationForm({ ...operationForm, polygonId: e.target.value })}
                      helperText="ID do polígono na folha"
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <Button
                      variant="contained"
                      onClick={handleAddOperation}
                      disabled={!operationForm.operationCode || !operationForm.areaHa}
                      startIcon={<AddIcon />}
                      fullWidth
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {formData.operations.length > 0 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Área (ha)</TableCell>
                      <TableCell>Polígono ID</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.operations.map((operation, index) => (
                      <TableRow key={index}>
                        <TableCell>{operation.operationCode}</TableCell>
                        <TableCell>{operation.operationDescription}</TableCell>
                        <TableCell>{operation.areaHa}</TableCell>
                        <TableCell>{operation.polygonId || '-'}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveOperation(index)}
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
          </Grid>

          {/* Features Info */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mt: 2 }}>
              Para adicionar features geométricas (polígonos), use a funcionalidade de importação GeoJSON na página de listagem.
              {isEditMode && ' As features existentes serão mantidas.'}
            </Alert>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard/worksheets')}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default WorksheetForm;
