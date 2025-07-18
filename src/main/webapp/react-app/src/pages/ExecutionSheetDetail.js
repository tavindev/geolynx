import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { executionSheetService, userService } from '../services/api';

const ExecutionSheetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();

  const [executionSheet, setExecutionSheet] = useState(null);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchExecutionSheet();
    fetchOperators();
  }, [id]);

  const fetchExecutionSheet = async () => {
    try {
      setLoading(true);
      const response = await executionSheetService.getById(id);
      setExecutionSheet(response.data);
    } catch (err) {
      setError('Erro ao carregar folha de execução');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOperators = async () => {
    try {
      // Get all users and filter operators
      const response = await userService.listUsers();
      const operatorUsers = response.data.filter(user =>
        user.role === 'OPERATOR' || user.role === 'PO'
      );
      setOperators(operatorUsers);
    } catch (err) {
      console.error('Error fetching operators:', err);
    }
  };

  const handleAssignOperation = async () => {
    try {
      await executionSheetService.assignOperation({
        executionSheetId: id,
        polygonId: formData.polygonId,
        operationId: formData.operationId,
        operatorId: formData.operatorId,
      });

      setDialogType(null);
      setFormData({});
      fetchExecutionSheet();
      setError(null);
    } catch (err) {
      setError('Erro ao atribuir operação');
      console.error(err);
    }
  };

  const handleStartActivity = async (polygonId, operationId) => {
    try {
      await executionSheetService.startActivity({
        executionSheetId: id,
        polygonId,
        operationId,
      });

      fetchExecutionSheet();
      setError(null);
    } catch (err) {
      setError('Erro ao iniciar atividade');
      console.error(err);
    }
  };

  const handleStopActivity = async (polygonId, operationId) => {
    try {
      await executionSheetService.stopActivity({
        executionSheetId: id,
        polygonId,
        operationId,
      });

      fetchExecutionSheet();
      setError(null);
    } catch (err) {
      setError('Erro ao parar atividade');
      console.error(err);
    }
  };

  const handleEditOperation = async () => {
    try {
      await executionSheetService.editOperation({
        executionSheetId: id,
        operationId: formData.operationId,
        plannedCompletionDate: formData.plannedCompletionDate,
        estimatedDurationHours: formData.estimatedDurationHours,
        observations: formData.observations,
      });

      setDialogType(null);
      setFormData({});
      fetchExecutionSheet();
      setError(null);
    } catch (err) {
      setError('Erro ao editar operação');
      console.error(err);
    }
  };

  const handleExport = async () => {
    try {
      const response = await executionSheetService.export({ executionSheetId: id });
      // Handle export - could download as file or show in new window
      console.log('Exported:', response.data);
      // You could create a downloadable file here
      const blob = new Blob([JSON.stringify(response.data.executionSheet, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `execution-sheet-${id}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erro ao exportar folha de execução');
      console.error(err);
    }
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
        <Alert severity="error">Folha de execução não encontrada</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/execution-sheets')}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Folha de Execução #{executionSheet.id}
          </Typography>
          {hasPermission('export_execution_sheets') && (
            <Button
              variant="outlined"
              startIcon={<ViewIcon />}
              onClick={handleExport}
            >
              Exportar
            </Button>
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Folha de Obra ID:</strong> {executionSheet.workSheetId}
            </Typography>
            <Typography variant="body1">
              <strong>Data Início:</strong> {executionSheet.startingDate}
            </Typography>
            <Typography variant="body1">
              <strong>Data Fim:</strong> {executionSheet.finishingDate || 'Em andamento'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Última Atividade:</strong> {executionSheet.lastActivityDate}
            </Typography>
            <Typography variant="body1">
              <strong>Observações:</strong> {executionSheet.observations || 'Nenhuma'}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Operations Section */}
      <Typography variant="h5" gutterBottom>
        Operações
      </Typography>

      {executionSheet.operations && executionSheet.operations.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {executionSheet.operations.map((operation, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {operation.operationCode}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Área Executada:</strong> {operation.areaHaExecuted} ha ({operation.areaPerc}%)
                  </Typography>
                  <Typography variant="body2">
                    <strong>Período:</strong> {operation.startingDate} - {operation.finishingDate || 'Em andamento'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Duração Estimada:</strong> {operation.estimatedDurationHours} horas
                  </Typography>
                  <Typography variant="body2">
                    <strong>Data Prevista:</strong> {operation.plannedCompletionDate}
                  </Typography>
                  {operation.observations && (
                    <Typography variant="body2">
                      <strong>Observações:</strong> {operation.observations}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  {hasPermission('edit_operations') && (
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setFormData({
                          operationId: operation.id || index,
                          plannedCompletionDate: operation.plannedCompletionDate,
                          estimatedDurationHours: operation.estimatedDurationHours,
                          observations: operation.observations,
                        });
                        setDialogType('edit');
                      }}
                    >
                      Editar
                    </Button>
                  )}
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={async () => {
                      try {
                        const response = await executionSheetService.viewStatusGlobal({
                          executionSheetId: id,
                          operationId: operation.id || index,
                        });
                        setSelectedOperation(response.data);
                        setDialogType('viewGlobal');
                      } catch (err) {
                        setError('Erro ao carregar estado global');
                      }
                    }}
                  >
                    Ver Estado Global
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          Nenhuma operação definida
        </Alert>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Polygon Operations Section */}
      <Typography variant="h5" gutterBottom>
        Operações por Polígono
      </Typography>

      {executionSheet.polygonsOperations && executionSheet.polygonsOperations.length > 0 ? (
        executionSheet.polygonsOperations.map((polygonOp) => (
          <Paper key={polygonOp.polygonId} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Polígono #{polygonOp.polygonId}
            </Typography>
            <List>
              {polygonOp.operations.map((op) => (
                <ListItem key={op.operationId} divider>
                  <ListItemText
                    primary={`Operação #${op.operationId}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Estado: <Chip
                            label={getStatusLabel(op.status)}
                            color={getStatusColor(op.status)}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Typography>
                        {op.operatorId && (
                          <Typography variant="body2">
                            Operador ID: {op.operatorId}
                          </Typography>
                        )}
                        {op.startingDate && (
                          <Typography variant="body2">
                            Início: {op.startingDate} | Fim: {op.finishingDate || 'Em andamento'}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    {op.status === 'pending' && hasPermission('assign_operations') && (
                      <Tooltip title="Atribuir Operador">
                        <IconButton
                          edge="end"
                          onClick={() => {
                            setFormData({
                              polygonId: polygonOp.polygonId,
                              operationId: op.operationId,
                            });
                            setDialogType('assign');
                          }}
                        >
                          <AssignIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {op.status === 'assigned' && op.operatorId === user?.id && (
                      <Tooltip title="Iniciar">
                        <IconButton
                          edge="end"
                          onClick={() => handleStartActivity(polygonOp.polygonId, op.operationId)}
                        >
                          <StartIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {op.status === 'ongoing' && op.operatorId === user?.id && (
                      <Tooltip title="Parar">
                        <IconButton
                          edge="end"
                          onClick={() => handleStopActivity(polygonOp.polygonId, op.operationId)}
                        >
                          <StopIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Ver Detalhes">
                      <IconButton
                        edge="end"
                        onClick={async () => {
                          try {
                            const response = await executionSheetService.viewActivity({
                              executionSheetId: id,
                              polygonId: polygonOp.polygonId,
                              operationId: op.operationId,
                            });
                            setSelectedOperation(response.data);
                            setDialogType('viewActivity');
                          } catch (err) {
                            setError('Erro ao carregar detalhes da atividade');
                          }
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        ))
      ) : (
        <Alert severity="info">
          Nenhuma operação de polígono definida
        </Alert>
      )}

      {/* Dialogs */}
      {/* Assign Operation Dialog */}
      <Dialog open={dialogType === 'assign'} onClose={() => setDialogType(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Atribuir Operação</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Operador</InputLabel>
            <Select
              value={formData.operatorId || ''}
              onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
              label="Operador"
            >
              {operators.map((operator) => (
                <MenuItem key={operator.id} value={operator.id}>
                  {operator.personalInfo?.fullName || operator.username} ({operator.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogType(null)}>Cancelar</Button>
          <Button
            onClick={handleAssignOperation}
            variant="contained"
            color="primary"
            disabled={!formData.operatorId}
          >
            Atribuir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Operation Dialog */}
      <Dialog open={dialogType === 'edit'} onClose={() => setDialogType(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Operação</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Data Prevista de Conclusão"
            type="date"
            value={formData.plannedCompletionDate || ''}
            onChange={(e) => setFormData({ ...formData, plannedCompletionDate: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Duração Estimada (horas)"
            type="number"
            value={formData.estimatedDurationHours || ''}
            onChange={(e) => setFormData({ ...formData, estimatedDurationHours: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Observações"
            multiline
            rows={3}
            value={formData.observations || ''}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogType(null)}>Cancelar</Button>
          <Button onClick={handleEditOperation} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Activity Dialog */}
      <Dialog open={dialogType === 'viewActivity'} onClose={() => setDialogType(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes da Atividade</DialogTitle>
        <DialogContent>
          {selectedOperation && selectedOperation.operationDetail ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Estado:</strong> {getStatusLabel(selectedOperation.operationDetail.status)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Operador ID:</strong> {selectedOperation.operationDetail.operatorId || 'Não atribuído'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Data Início:</strong> {selectedOperation.operationDetail.startingDate || 'Não iniciado'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Data Fim:</strong> {selectedOperation.operationDetail.finishingDate || 'Em andamento'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Última Atividade:</strong> {selectedOperation.operationDetail.lastActivityDate || 'N/A'}
              </Typography>
              {selectedOperation.operationDetail.observations && (
                <Typography variant="body1" gutterBottom>
                  <strong>Observações:</strong> {selectedOperation.operationDetail.observations}
                </Typography>
              )}
              {selectedOperation.operationDetail.tracks && selectedOperation.operationDetail.tracks.length > 0 && (
                <Typography variant="body1" gutterBottom>
                  <strong>Trilhas GPS:</strong> {selectedOperation.operationDetail.tracks.length} registros
                </Typography>
              )}
            </Box>
          ) : (
            <Typography>Carregando detalhes...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogType(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* View Global Status Dialog */}
      <Dialog open={dialogType === 'viewGlobal'} onClose={() => setDialogType(null)} maxWidth="md" fullWidth>
        <DialogTitle>Estado Global da Operação</DialogTitle>
        <DialogContent>
          {selectedOperation ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedOperation.operationCode}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Estado Global:</strong> <Chip
                  label={getStatusLabel(selectedOperation.globalStatus)}
                  color={getStatusColor(selectedOperation.globalStatus)}
                  size="small"
                />
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Estados por Polígono:
              </Typography>

              {selectedOperation.polygonStatuses && selectedOperation.polygonStatuses.map((polyStatus) => (
                <Paper key={polyStatus.polygonId} sx={{ p: 2, mb: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Polígono #{polyStatus.polygonId}</strong>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Estado: <Chip
                          label={getStatusLabel(polyStatus.status)}
                          color={getStatusColor(polyStatus.status)}
                          size="small"
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Operador ID: {polyStatus.operatorId || 'Não atribuído'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Início: {polyStatus.startingDate || 'Não iniciado'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Fim: {polyStatus.finishingDate || 'Em andamento'}
                      </Typography>
                    </Grid>
                    {polyStatus.observations && (
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          Observações: {polyStatus.observations}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography>Carregando estado global...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogType(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExecutionSheetDetail;