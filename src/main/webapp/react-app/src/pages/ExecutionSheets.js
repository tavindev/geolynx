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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { executionSheetService, worksheetService } from '../services/api';

const ExecutionSheets = () => {
  const [executionSheets, setExecutionSheets] = useState([]);
  const [worksheets, setWorksheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Get all worksheets first
      const worksheetsResponse = await worksheetService.getAll();
      setWorksheets(worksheetsResponse.data);

      // Note: There's no endpoint to list all execution sheets
      // This would need to be implemented in the backend
      // For now, we'll show a message
      setExecutionSheets([]);
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
        </Typography>
        {hasPermission('create_execution_sheet') && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/execution-sheets/create')}
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
                  <TableCell>{sheet.startingDate}</TableCell>
                  <TableCell>{sheet.finishingDate || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(sheet.globalStatus)}
                      color={getStatusColor(sheet.globalStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{sheet.lastActivityDate}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver Detalhes">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/execution-sheets/${sheet.id}`)
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
                            navigate(`/execution-sheets/${sheet.id}/assign`)
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

const handleExport = async (id) => {
  try {
    const response = await executionSheetService.export({
      executionSheetId: id,
    });
    // Handle export - could download as file or show in new window
    console.log('Exported:', response.data);
  } catch (err) {
    console.error('Export error:', err);
  }
};

export default ExecutionSheets;
