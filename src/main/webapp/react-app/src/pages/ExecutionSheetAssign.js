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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { executionSheetService, userService, worksheetService } from '../services/api';

const ExecutionSheetAssign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();

  const [executionSheet, setExecutionSheet] = useState(null);
  const [worksheet, setWorksheet] = useState(null);
  const [operators, setOperators] = useState([]);
  const [filteredOperators, setFilteredOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [assignmentInProgress, setAssignmentInProgress] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // First fetch execution sheet
      const executionSheetResponse = await executionSheetService.getById(id);
      setExecutionSheet(executionSheetResponse.data);
      
      // Then fetch the worksheet and operators in parallel
      const [worksheetResponse, operatorsResponse] = await Promise.all([
        worksheetService.get(executionSheetResponse.data.workSheetId),
        userService.listUsers()
      ]);

      setWorksheet(worksheetResponse.data);
      
      // Filter users to only show PO (Partner Operator) roles
      const partnerOperators = operatorsResponse.data.filter(user => 
        user.role === 'PO'
      );
      setOperators(partnerOperators);
      
      // Filter operators to show only those from the same corporation as the service provider
      const serviceProviderId = worksheetResponse.data.metadata?.serviceProviderId;
      if (serviceProviderId) {
        const compatibleOperators = partnerOperators.filter(operator => 
          operator.corporationId === serviceProviderId.toString()
        );
        setFilteredOperators(compatibleOperators);
      } else {
        // If no serviceProviderId, show all operators
        setFilteredOperators(partnerOperators);
      }

    } catch (err) {
      setError('Erro ao carregar dados da folha de execução');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignOperation = async (polygonId, operationId, operatorId) => {
    try {
      setAssignmentInProgress(true);
      setError(null);
      
      await executionSheetService.assignOperation({
        executionSheetId: parseInt(id),
        polygonId: polygonId,
        operationId: operationId,
        operatorId: operatorId.toString(), // Ensure operatorId is sent as string
      });

      setSuccess('Operação atribuída com sucesso!');
      
      // Refresh the execution sheet data
      await fetchData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      setError('Erro ao atribuir operação: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setAssignmentInProgress(false);
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

  const getOperatorName = (operatorId) => {
    const operator = operators.find(op => op.id === operatorId);
    return operator?.personalInfo?.fullName || operator?.username || `Operador ${operatorId}`;
  };

  const getPendingOperations = () => {
    if (!executionSheet?.polygonsOperations) return [];
    
    const pendingOps = [];
    executionSheet.polygonsOperations.forEach(polygonOp => {
      polygonOp.operations.forEach(op => {
        if (op.status === 'pending') {
          pendingOps.push({
            polygonId: polygonOp.polygonId,
            operationId: op.operationId,
            status: op.status,
          });
        }
      });
    });
    return pendingOps;
  };

  const getAssignedOperations = () => {
    if (!executionSheet?.polygonsOperations) return [];
    
    const assignedOps = [];
    executionSheet.polygonsOperations.forEach(polygonOp => {
      polygonOp.operations.forEach(op => {
        if (op.status !== 'pending') {
          assignedOps.push({
            polygonId: polygonOp.polygonId,
            operationId: op.operationId,
            status: op.status,
            operatorId: op.operatorId,
            startingDate: op.startingDate,
            finishingDate: op.finishingDate,
          });
        }
      });
    });
    return assignedOps;
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

  const pendingOperations = getPendingOperations();
  const assignedOperations = getAssignedOperations();

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/execution-sheets')}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Atribuir Operações - Folha #{executionSheet.id}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Folha de Obra ID:</strong> {executionSheet.workSheetId}
            </Typography>
            <Typography variant="body1">
              <strong>Data Início:</strong> {executionSheet.startingDate}
            </Typography>
            {worksheet?.metadata?.serviceProviderId && (
              <Typography variant="body1">
                <strong>Prestador de Serviço ID:</strong> {worksheet.metadata.serviceProviderId}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Total de Operadores Disponíveis:</strong> {filteredOperators.length}
            </Typography>
            <Typography variant="body1">
              <strong>Operações Pendentes:</strong> {pendingOperations.length}
            </Typography>
          </Grid>
        </Grid>
        
        {filteredOperators.length === 0 && operators.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Nenhum operador da empresa prestadora de serviços (ID: {worksheet?.metadata?.serviceProviderId}) foi encontrado. 
            Total de operadores PO no sistema: {operators.length}
          </Alert>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Pending Operations Section */}
      <Typography variant="h5" gutterBottom>
        Operações Pendentes de Atribuição
      </Typography>

      {pendingOperations.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Todas as operações foram atribuídas.
        </Alert>
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {pendingOperations.map((operation, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Polígono #{operation.polygonId}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Operação ID:</strong> {operation.operationId}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Estado:</strong>{' '}
                    <Chip
                      label={getStatusLabel(operation.status)}
                      color={getStatusColor(operation.status)}
                      size="small"
                    />
                  </Typography>
                </CardContent>
                <CardActions>
                  <FormControl fullWidth sx={{ mx: 2, mb: 2 }}>
                    <InputLabel>Selecionar Operador</InputLabel>
                    <Select
                      label="Selecionar Operador"
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssignOperation(
                            operation.polygonId,
                            operation.operationId,
                            e.target.value
                          );
                        }
                      }}
                      disabled={assignmentInProgress || filteredOperators.length === 0}
                      value=""
                    >
                      {filteredOperators.length === 0 ? (
                        <MenuItem disabled>
                          Nenhum operador da empresa disponível
                        </MenuItem>
                      ) : (
                        filteredOperators.map((operator) => (
                          <MenuItem key={operator.id} value={operator.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PersonIcon sx={{ mr: 1, fontSize: 'small' }} />
                              {operator.personalInfo?.fullName || operator.username}
                            </Box>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Assigned Operations Section */}
      <Typography variant="h5" gutterBottom>
        Operações Atribuídas
      </Typography>

      {assignedOperations.length === 0 ? (
        <Alert severity="info">
          Nenhuma operação foi atribuída ainda.
        </Alert>
      ) : (
        <Paper sx={{ p: 2 }}>
          <List>
            {assignedOperations.map((operation, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`Polígono #${operation.polygonId} - Operação #${operation.operationId}`}
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        <strong>Operador:</strong> {getOperatorName(operation.operatorId)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Estado:</strong>{' '}
                        <Chip
                          label={getStatusLabel(operation.status)}
                          color={getStatusColor(operation.status)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                      {operation.startingDate && (
                        <Typography variant="body2">
                          <strong>Período:</strong> {operation.startingDate} -{' '}
                          {operation.finishingDate || 'Em andamento'}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Operators Summary */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Operadores Disponíveis ({filteredOperators.length})
        </Typography>
        <Paper sx={{ p: 2 }}>
          {filteredOperators.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              Nenhum operador (PO) da empresa prestadora de serviços encontrado.
              {operators.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Total de operadores PO no sistema: {operators.length}
                  </Typography>
                </Box>
              )}
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredOperators.map((operator) => (
                <Grid item xs={12} sm={6} md={4} key={operator.id}>
                  <Box sx={{ p: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>{operator.personalInfo?.fullName || operator.username}</strong>
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {operator.id} | Role: {operator.role}
                      {operator.corporationId && ` | Corp: ${operator.corporationId}`}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ExecutionSheetAssign;