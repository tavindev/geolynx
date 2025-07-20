import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { executionSheetService } from '../services/api';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext';

const MyWorksheets = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, hasRole } = useAuth();
  const [executionSheets, setExecutionSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyOperations();
  }, []);

  const fetchMyOperations = async () => {
    try {
      setLoading(true);
      if (hasRole('PO')) {
        // For PO operators, get their assigned execution sheets
        const response = await executionSheetService.getMyAssignments();
        const mySheets = response.data?.executionSheets || [];
        setExecutionSheets(mySheets);
      } else {
        // For other roles, show empty or redirect
        setExecutionSheets([]);
      }
    } catch (error) {
      console.error('Error fetching my operations:', error);
      setError('Erro ao carregar operações atribuídas');
      enqueueSnackbar('Erro ao carregar operações atribuídas', { variant: 'error' });
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Minhas Operações
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visualize e gerencie suas operações atribuídas
        </Typography>
      </Box>

      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          border: '1px solid #e0e0e0',
          boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Execução</TableCell>
              <TableCell>Folha de Obra</TableCell>
              <TableCell>Data Início</TableCell>
              <TableCell>Data Fim</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Última Atividade</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {executionSheets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhuma operação atribuída encontrada
                </TableCell>
              </TableRow>
            ) : (
              executionSheets.map((sheet) => (
                <TableRow key={sheet.id}>
                  <TableCell>{sheet.id}</TableCell>
                  <TableCell>{sheet.workSheetId}</TableCell>
                  <TableCell>{formatDate(sheet.startingDate)}</TableCell>
                  <TableCell>{formatDate(sheet.finishingDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(sheet.globalStatus)}
                      color={getStatusColor(sheet.globalStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(sheet.lastActivityDate)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Visualizar Detalhes">
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/dashboard/execution-sheets/${sheet.id}`)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyWorksheets;
