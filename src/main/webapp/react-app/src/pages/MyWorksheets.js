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
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { worksheetService } from '../services/api';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext';

const MyWorksheets = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [worksheets, setWorksheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorksheets();
  }, []);

  const fetchWorksheets = async () => {
    try {
      setLoading(true);
      const response = await worksheetService.getAll();
      // The response data is directly an array
      const myWorksheets = response.data || response || [];
      setWorksheets(myWorksheets);
    } catch (error) {
      console.error('Error fetching worksheets:', error);
      setError('Erro ao carregar fichas de obra');
      enqueueSnackbar('Erro ao carregar fichas de obra', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza de que deseja excluir esta ficha?')) {
      try {
        await worksheetService.delete(id);
        enqueueSnackbar('Ficha removida com sucesso', { variant: 'success' });
        fetchWorksheets();
      } catch (error) {
        enqueueSnackbar('Erro ao remover ficha', { variant: 'error' });
      }
    }
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
          Minhas Fichas de Obra
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visualize e gerencie suas fichas de obra
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
              <TableCell>ID</TableCell>
              <TableCell>AIGP</TableCell>
              <TableCell>Data Início</TableCell>
              <TableCell>Data Fim</TableCell>
              <TableCell>Data Emissão</TableCell>
              <TableCell>Operações</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {worksheets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhuma ficha de obra encontrada
                </TableCell>
              </TableRow>
            ) : (
              worksheets.map((worksheet) => (
                <TableRow key={worksheet.id}>
                  <TableCell>{worksheet.id}</TableCell>
                  <TableCell>
                    {worksheet.aigp && worksheet.aigp.length > 0 ? (
                      worksheet.aigp.map((code, index) => (
                        <Chip 
                          key={index} 
                          label={code} 
                          size="small" 
                          sx={{ mr: 0.5 }}
                        />
                      ))
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{formatDate(worksheet.startingDate)}</TableCell>
                  <TableCell>{formatDate(worksheet.finishingDate)}</TableCell>
                  <TableCell>{formatDate(worksheet.issueDate)}</TableCell>
                  <TableCell>
                    {worksheet.operations ? worksheet.operations.length : 0}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Visualizar">
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/dashboard/worksheet/${worksheet.id}`)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/dashboard/worksheet-update/${worksheet.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remover">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(worksheet.id)}
                      >
                        <DeleteIcon />
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
