import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { worksheetService, executionSheetService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const WorksheetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [worksheet, setWorksheet] = useState(null);
  const [executionSheets, setExecutionSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorksheet();
    fetchExecutionSheets();
  }, [id]);

  const fetchWorksheet = async () => {
    try {
      setLoading(true);
      const response = await worksheetService.get(id);
      setWorksheet(response.data);
    } catch (error) {
      console.error('Error fetching worksheet:', error);
      setError('Erro ao carregar ficha de obra');
    } finally {
      setLoading(false);
    }
  };

  const fetchExecutionSheets = async () => {
    try {
      const response = await executionSheetService.getByWorksheetId(parseInt(id));
      const sheets = response.data.executionSheets || [];
      setExecutionSheets(sheets);
    } catch (error) {
      console.error('Error fetching execution sheets:', error);
      // If the specific endpoint fails, fallback to getting all and filtering
      try {
        const fallbackResponse = await executionSheetService.getMyAssignments();
        const allSheets = fallbackResponse.data.executionSheets || [];
        const filteredSheets = allSheets.filter(sheet => sheet.workSheetId === parseInt(id));
        setExecutionSheets(filteredSheets);
      } catch (fallbackError) {
        console.error('Error in fallback execution sheets fetch:', fallbackError);
        setExecutionSheets([]);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Voltar
          </Button>
          {hasPermission('create_execution_sheet') && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() =>
                navigate(`/dashboard/execution-sheets/create?worksheetId=${id}`)
              }
            >
              Criar Folha de Execução
            </Button>
          )}
        </Box>
        <Typography variant="h4" gutterBottom>
          Detalhes da Ficha de Obra
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: '1px solid #e0e0e0',
          boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {worksheet?.metadata && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Informações Gerais
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                ID da Ficha
              </Typography>
              <Typography variant="body1" gutterBottom>
                {worksheet.metadata.id || '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                AIGP
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {worksheet.metadata.aigp &&
                worksheet.metadata.aigp.length > 0 ? (
                  worksheet.metadata.aigp.map((code, index) => (
                    <Chip key={index} label={code} size="small" />
                  ))
                ) : (
                  <Typography variant="body1">-</Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Data de Início
              </Typography>
              <Typography variant="body1">
                {formatDate(worksheet.metadata.startingDate)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Data de Fim
              </Typography>
              <Typography variant="body1">
                {formatDate(worksheet.metadata.finishingDate)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">
                Data de Emissão
              </Typography>
              <Typography variant="body1">
                {formatDate(worksheet.metadata.issueDate)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Código POSA
              </Typography>
              <Typography variant="body1">
                {worksheet.metadata.posaCode || '-'}
              </Typography>
              <Typography variant="caption" display="block">
                {worksheet.metadata.posaDescription || ''}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Código POSP
              </Typography>
              <Typography variant="body1">
                {worksheet.metadata.pospCode || '-'}
              </Typography>
              <Typography variant="caption" display="block">
                {worksheet.metadata.pospDescription || ''}
              </Typography>
            </Grid>

            {worksheet.metadata.operations &&
              worksheet.metadata.operations.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Operações
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    {worksheet.metadata.operations.map((operation, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={`${operation.operationCode} - ${operation.operationDescription}`}
                          secondary={`Área: ${operation.areaHa} ha`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}

            {worksheet.features && worksheet.features.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Características Geográficas
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2">
                  {worksheet.features.length} área(s) definida(s)
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Paper>

      {/* Execution Sheets Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mt: 3,
          border: '1px solid #e0e0e0',
          boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Folhas de Execução Associadas
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AssignmentIcon />}
            onClick={() => navigate('/dashboard/execution-sheets', { state: { worksheetId: parseInt(id) } })}
          >
            Ver Todas
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {executionSheets.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Data de Início</TableCell>
                  <TableCell>Data de Fim</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {executionSheets.map((sheet) => (
                  <TableRow key={sheet.id}>
                    <TableCell>{sheet.id}</TableCell>
                    <TableCell>
                      {sheet.startingDate
                        ? new Date(sheet.startingDate).toLocaleDateString('pt-PT')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {sheet.finishingDate
                        ? new Date(sheet.finishingDate).toLocaleDateString('pt-PT')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(sheet.globalStatus)}
                        color={getStatusColor(sheet.globalStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/dashboard/execution-sheets/${sheet.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhuma folha de execução associada a esta ficha de obra.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default WorksheetDetail;
