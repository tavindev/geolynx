import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Chip,
  Alert,
  CircularProgress,
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
  Visibility as ViewIcon,
  Assignment as AssignIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  GetApp as ExportIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { executionSheetService, worksheetService, userService } from '../services/api';

const ExecutionSheets = () => {
  const [executionSheets, setExecutionSheets] = useState([]);
  const [worksheets, setWorksheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operators, setOperators] = useState([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  const worksheetIdFilter = location.state?.worksheetId;

  useEffect(() => {
    fetchData();
  }, [worksheetIdFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get operators (only if user has permission to list users)
      try {
        const usersResponse = await userService.listUsers();
        const operatorUsers = usersResponse.data.filter(user =>
          user.role === 'PO'
        );
        setOperators(operatorUsers);
      } catch (err) {
        console.log('No permission to list users, skipping operators');
        setOperators([]);
      }

      // Get all worksheets (only if user has permission)
      try {
        const worksheetsResponse = await worksheetService.getAll();
        setWorksheets(worksheetsResponse.data);
      } catch (err) {
        console.log('No permission to view worksheets, skipping');
        setWorksheets([]);
      }

      // Get execution sheets
      try {
        let executionSheetsResponse;
        
        if (worksheetIdFilter) {
          // If filtering by worksheet ID, use the specific endpoint
          executionSheetsResponse = await executionSheetService.getByWorksheetId(worksheetIdFilter);
        } else {
          // Otherwise, get the operator's assignments
          executionSheetsResponse = await executionSheetService.getMyAssignments();
        }
        
        const sheets = executionSheetsResponse.data.executionSheets || [];
        setExecutionSheets(sheets);
      } catch (err) {
        // If user doesn't have permission or no sheets exist
        console.log('No execution sheets available');
        setExecutionSheets([]);
      }
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
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

  const handleExport = async (id) => {
    try {
      const response = await executionSheetService.export({
        executionSheetId: id,
      });
      // Create downloadable file
      const blob = new Blob([JSON.stringify(response.data.executionSheet, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `execution-sheet-${id}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setError(null);
    } catch (err) {
      console.error('Export error:', err);
      setError('Erro ao exportar folha de execução');
    }
  };

  const handleOpenAssignDialog = (sheet) => {
    setSelectedSheet(sheet);
    setSelectedOperator('');
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedSheet(null);
    setSelectedOperator('');
  };

  const handleQuickAssign = async () => {
    if (!selectedSheet || !selectedOperator) return;

    try {
      // Get all pending operations for this execution sheet
      const sheet = await executionSheetService.getById(selectedSheet.id);
      const executionSheetData = sheet.data;

      let assignmentCount = 0;
      let errorCount = 0;

      // Iterate through all polygon operations
      if (executionSheetData.polygonsOperations) {
        for (const polygonOp of executionSheetData.polygonsOperations) {
          for (const op of polygonOp.operations) {
            if (op.status === 'pending') {
              try {
                await executionSheetService.assignOperation({
                  executionSheetId: selectedSheet.id,
                  polygonId: polygonOp.polygonId,
                  operationId: op.operationId,
                  operatorId: selectedOperator,
                });
                assignmentCount++;
              } catch (err) {
                console.error(`Failed to assign operation ${op.operationId}:`, err);
                errorCount++;
              }
            }
          }
        }
      }

      if (assignmentCount > 0) {
        setError(null);
        alert(`${assignmentCount} operações foram atribuídas com sucesso!${errorCount > 0 ? ` ${errorCount} falharam.` : ''}`);
        fetchData(); // Refresh the data
      } else if (errorCount > 0) {
        setError(`Falha ao atribuir ${errorCount} operações.`);
      } else {
        alert('Não há operações pendentes para atribuir.');
      }

      handleCloseAssignDialog();
    } catch (err) {
      console.error('Error in quick assign:', err);
      setError('Erro ao atribuir operações em massa');
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
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1">
          Folhas de Execução
          {worksheetIdFilter && (
            <Typography variant="body2" color="textSecondary" component="span">
              {' '}(Folha de Obra #{worksheetIdFilter})
            </Typography>
          )}
        </Typography>
        {hasPermission('create_execution_sheet') && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/execution-sheets/create', 
              worksheetIdFilter ? { state: { worksheetId: worksheetIdFilter } } : {}
            )}
          >
            Nova Folha de Execução
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {executionSheets.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Nenhuma folha de execução encontrada.
            {worksheets.length > 0
              ? ' Crie uma nova folha de execução a partir de uma folha de obra.'
              : ' Aguarde que sejam atribuídas folhas de execução.'}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                {worksheets.length > 0 && <TableCell>Folha de Obra</TableCell>}
                <TableCell>Data Início</TableCell>
                <TableCell>Data Fim</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Última Atividade</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {executionSheets.map((sheet) => (
                <TableRow key={sheet.id}>
                  <TableCell>{sheet.id}</TableCell>
                  {worksheets.length > 0 && <TableCell>{sheet.workSheetId}</TableCell>}
                  <TableCell>
                    {sheet.startingDate
                      ? new Date(sheet.startingDate).toLocaleDateString('pt-BR')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {sheet.finishingDate
                      ? new Date(sheet.finishingDate).toLocaleDateString('pt-BR')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(sheet.globalStatus)}
                      color={getStatusColor(sheet.globalStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {sheet.lastActivityDate
                      ? new Date(sheet.lastActivityDate).toLocaleDateString('pt-BR')
                      : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver Detalhes">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/dashboard/execution-sheets/${sheet.id}`)
                        }
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {hasPermission('assign_operations') && operators.length > 0 && (
                      <>
                        <Tooltip title="Atribuir Todas Operações">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenAssignDialog(sheet)}
                          >
                            <PersonIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Atribuir Operações Individuais">
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/dashboard/execution-sheets/${sheet.id}/assign`)
                            }
                          >
                            <AssignIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {hasPermission('export_execution_sheets') && (
                      <Tooltip title="Exportar">
                        <IconButton
                          size="small"
                          onClick={() => handleExport(sheet.id)}
                        >
                          <ExportIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Quick Assign Dialog */}
      <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Atribuir Todas as Operações Pendentes</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selecione um operador para atribuir todas as operações pendentes da Folha de Execução #{selectedSheet?.id}
          </Typography>
          {operators.length > 0 ? (
            <FormControl fullWidth>
              <InputLabel>Operador</InputLabel>
              <Select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                label="Operador"
              >
                {operators.map((operator) => (
                  <MenuItem key={operator.id} value={operator.id}>
                    {operator.personalInfo?.fullName || operator.username} ({operator.role})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Nenhum operador disponível para atribuição.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancelar</Button>
          <Button
            onClick={handleQuickAssign}
            variant="contained"
            color="primary"
            disabled={!selectedOperator || operators.length === 0}
          >
            Atribuir Todas
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExecutionSheets;
