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
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Assignment as AssignIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { executionSheetService, worksheetService } from '../services/api';

const ExecutionSheets = () => {
  const [executionSheets, setExecutionSheets] = useState([]);
  const [worksheets, setWorksheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // Get all worksheets
      const worksheetsResponse = await worksheetService.getAll();
      setWorksheets(worksheetsResponse.data);

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
              : ' Primeiro, crie uma folha de obra.'}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Folha de Obra</TableCell>
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
                  <TableCell>{sheet.workSheetId}</TableCell>
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
                    {hasPermission('assign_operations') && (
                      <Tooltip title="Atribuir Operações">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/dashboard/execution-sheets/${sheet.id}/assign`)
                          }
                        >
                          <AssignIcon />
                        </IconButton>
                      </Tooltip>
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
    </Container>
  );
};

export default ExecutionSheets;
