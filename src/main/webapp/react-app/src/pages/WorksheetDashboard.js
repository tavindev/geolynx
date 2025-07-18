import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  GetApp as ExportIcon,
  DateRange as DateIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { worksheetService, executionSheetService } from '../services/api';

const WorksheetDashboard = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [worksheets, setWorksheets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    withExecutionSheets: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorksheets();
  }, []);

  const fetchWorksheets = async () => {
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
      
    } catch (err) {
      console.error('Error fetching worksheets:', err);
      setError('Erro ao carregar folhas de obra');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta folha de obra?')) {
      try {
        await worksheetService.delete(id);
        fetchWorksheets();
      } catch (err) {
        setError('Erro ao remover folha de obra');
      }
    }
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
      setError('Erro ao exportar folha de obra');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Gestão de Folhas de Obra
        </Typography>
        {hasRole('SMBO') && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/worksheet/create')}
          >
            Importar Folha
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
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
                    AIGPs Únicos
                  </Typography>
                  <Typography variant="h4">
                    {[...new Set(worksheets.flatMap(w => w.aigp || []))].length}
                  </Typography>
                </Box>
                <BusinessIcon color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Worksheets Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>AIGPs</TableCell>
                <TableCell>Data Início</TableCell>
                <TableCell>Data Fim</TableCell>
                <TableCell>Data Emissão</TableCell>
                <TableCell>Operações</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {worksheets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="textSecondary">
                      Nenhuma folha de obra encontrada
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                worksheets.map((worksheet) => (
                  <TableRow key={worksheet.id}>
                    <TableCell>{worksheet.id}</TableCell>
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
                    <TableCell>{formatDate(worksheet.startingDate)}</TableCell>
                    <TableCell>{formatDate(worksheet.finishingDate)}</TableCell>
                    <TableCell>{formatDate(worksheet.issueDate)}</TableCell>
                    <TableCell>
                      {worksheet.operations?.length || 0} operações
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver Detalhes">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/dashboard/worksheet/${worksheet.id}`)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {hasRole('SMBO') && (
                        <>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/dashboard/worksheet-update/${worksheet.id}`)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Exportar">
                            <IconButton
                              size="small"
                              onClick={() => handleExport(worksheet)}
                            >
                              <ExportIcon />
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
                        </>
                      )}
                      
                      {hasRole('PRBO') && (
                        <Tooltip title="Criar Folha de Execução">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate('/dashboard/execution-sheets')}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default WorksheetDashboard;
