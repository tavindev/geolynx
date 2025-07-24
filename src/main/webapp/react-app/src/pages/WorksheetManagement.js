import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Upload as UploadIcon,
  Map as MapIcon,
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  GetApp as ExportIcon,
  Add as AddIcon,
  Description as DescriptionIcon,
  DateRange as DateIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { worksheetService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const WorksheetManagement = () => {
  const [worksheets, setWorksheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWorksheet, setSelectedWorksheet] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    withExecutionSheets: 0,
  });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const hasImportPermission = ['SYSADMIN', 'SMBO'].includes(user?.role);
  const hasRemovePermission = ['SYSADMIN', 'SMBO'].includes(user?.role);
  const hasViewDetailedPermission = ['SYSADMIN', 'SMBO', 'SDVBO'].includes(user?.role);
  const hasViewGeneralPermission = ['SYSADMIN', 'SMBO', 'SGVBO'].includes(user?.role);

  const fetchWorksheets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await worksheetService.getAll();
      const data = response.data || [];
      setWorksheets(data);
      
      // Calculate stats
      const now = new Date();
      setStats({
        total: data.length,
        active: data.filter(w => new Date(w.finishingDate) >= now).length,
        completed: data.filter(w => new Date(w.finishingDate) < now).length,
        withExecutionSheets: 0, // Would need to check execution sheets
      });
    } catch (error) {
      enqueueSnackbar('Erro ao carregar folhas de obra', { variant: 'error' });
      console.error('Error fetching worksheets:', error);
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchWorksheets();
  }, [fetchWorksheets]);

  const handleDelete = async () => {
    if (!selectedWorksheet) return;

    try {
      await worksheetService.delete(selectedWorksheet.id);
      enqueueSnackbar('Folha de obra removida com sucesso', {
        variant: 'success',
      });
      fetchWorksheets();
    } catch (error) {
      enqueueSnackbar('Erro ao remover folha de obra', { variant: 'error' });
      console.error('Error deleting worksheet:', error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedWorksheet(null);
    }
  };

  const handleFileUpload = async (file) => {
    setUploadProgress(true);

    try {
      const fileContent = await file.text();
      const geoJson = JSON.parse(fileContent);

      if (geoJson.type !== 'FeatureCollection' && geoJson.type !== 'Feature') {
        throw new Error('Ficheiro GeoJSON inválido');
      }

      await worksheetService.create(geoJson);
      enqueueSnackbar('Folha de obra importada com sucesso', {
        variant: 'success',
      });
      fetchWorksheets();
      setUploadDialogOpen(false);
    } catch (error) {
      if (error instanceof SyntaxError) {
        enqueueSnackbar(
          'Ficheiro inválido. Por favor, selecione um ficheiro GeoJSON válido',
          { variant: 'error' }
        );
      } else {
        enqueueSnackbar(error.message || 'Erro ao importar folha de obra', {
          variant: 'error',
        });
      }
      console.error('Error uploading worksheet:', error);
    } finally {
      setUploadProgress(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/geo+json': ['.geojson'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
  });

  const handleView = (worksheet) => {
    navigate(`/dashboard/worksheet/${worksheet.id}`);
  };

  const handleExport = async (worksheet) => {
    try {
      const response = await worksheetService.get(worksheet.id);
      const data = response.data;
      
      // Create a downloadable file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `worksheet-${worksheet.id}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      enqueueSnackbar('Erro ao exportar folha de obra', { variant: 'error' });
    }
  };

  const calculateTotalArea = (worksheet) => {
    if (!worksheet.operations) return '0';

    const totalArea = worksheet.operations.reduce((sum, operation) => {
      return sum + (operation.areaHa || 0);
    }, 0);

    return totalArea.toFixed(2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';

    let date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else if (dateString.includes('-')) {
      date = new Date(dateString + 'T00:00:00');
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('pt-PT');
  };

  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Total de Folhas
                </Typography>
                <Typography variant="h4">
                  {stats.total}
                </Typography>
              </Box>
              <DescriptionIcon color="primary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Ativas
                </Typography>
                <Typography variant="h4">
                  {stats.active}
                </Typography>
              </Box>
              <DateIcon color="success" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Concluídas
                </Typography>
                <Typography variant="h4">
                  {stats.completed}
                </Typography>
              </Box>
              <DescriptionIcon color="default" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Códigos POSA Únicos
                </Typography>
                <Typography variant="h4">
                  {[...new Set(worksheets.map(w => w.posaCode).filter(Boolean))].length}
                </Typography>
              </Box>
              <BusinessIcon color="secondary" sx={{ fontSize: 40 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTableView = () => (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Data de Emissão</TableCell>
            <TableCell>Data de Início</TableCell>
            <TableCell>Data de Fim</TableCell>
            <TableCell>Data de Adjudicação</TableCell>
            <TableCell>Código POSA</TableCell>
            <TableCell>Código POSP</TableCell>
            <TableCell>AIGPs</TableCell>
            <TableCell>Nº de Features</TableCell>
            <TableCell>Área Total (ha)</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {worksheets.map((worksheet) => (
            <TableRow key={worksheet.id || Math.random()} hover>
              <TableCell>{worksheet.id || '-'}</TableCell>
              <TableCell>{formatDate(worksheet.issueDate)}</TableCell>
              <TableCell>{formatDate(worksheet.startingDate)}</TableCell>
              <TableCell>{formatDate(worksheet.finishingDate)}</TableCell>
              <TableCell>{formatDate(worksheet.awardDate)}</TableCell>
              <TableCell>
                <Chip
                  label={worksheet.posaCode || 'N/A'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={worksheet.pospCode || 'N/A'}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              </TableCell>
              <TableCell>
                {worksheet.aigp?.map((aigp, index) => (
                  <Chip 
                    key={index} 
                    label={aigp} 
                    size="small" 
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </TableCell>
              <TableCell>{worksheet.features?.length || 0}</TableCell>
              <TableCell>{calculateTotalArea(worksheet)}</TableCell>
              <TableCell align="right">
                <Tooltip title="Ver detalhes">
                  <IconButton
                    onClick={() => handleView(worksheet)}
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {worksheet.features && worksheet.features.length > 0 && (
                  <Tooltip title="Ver no mapa">
                    <IconButton
                      onClick={() =>
                        navigate('/dashboard/map', {
                          state: { worksheetId: worksheet.id },
                        })
                      }
                      color="secondary"
                    >
                      <MapIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Ver folhas de execução">
                  <IconButton
                    onClick={() =>
                      navigate('/dashboard/execution-sheets', {
                        state: { worksheetId: worksheet.id },
                      })
                    }
                    color="info"
                  >
                    <AssignmentIcon />
                  </IconButton>
                </Tooltip>
                {hasImportPermission && (
                  <>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => navigate(`/dashboard/worksheet-update/${worksheet.id}`)}
                        color="default"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Exportar">
                      <IconButton
                        onClick={() => handleExport(worksheet)}
                        color="default"
                      >
                        <ExportIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                {hasRemovePermission && (
                  <Tooltip title="Remover">
                    <IconButton
                      onClick={() => {
                        setSelectedWorksheet(worksheet);
                        setDeleteDialogOpen(true);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          Folhas de Obra
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {hasRole('PRBO') && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate('/dashboard/execution-sheets/create')}
            >
              Nova Folha de Execução
            </Button>
          )}
          {hasImportPermission && (
            <>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate('/dashboard/worksheet/create')}
              >
                Criar Folha de Obra
              </Button>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setUploadDialogOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                Importar GeoJSON
              </Button>
            </>
          )}
        </Box>
      </Box>

      {renderStatsCards()}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : worksheets.length === 0 ? (
        <Alert severity="info">Nenhuma folha de obra encontrada.</Alert>
      ) : (
        renderTableView()
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Remoção</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja remover a folha de obra com ID "
            {selectedWorksheet?.id || 'Desconhecido'}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Remover
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={uploadDialogOpen}
        onClose={() => !uploadProgress && setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Importar Folha de Obra (GeoJSON)</DialogTitle>
        <DialogContent>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            <input {...getInputProps()} />
            {uploadProgress ? (
              <CircularProgress />
            ) : (
              <>
                <UploadIcon
                  sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {isDragActive
                    ? 'Largue o ficheiro aqui'
                    : 'Arraste um ficheiro GeoJSON aqui'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ou clique para selecionar
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  Formatos aceites: .geojson, .json
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setUploadDialogOpen(false)}
            disabled={uploadProgress}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorksheetManagement;
