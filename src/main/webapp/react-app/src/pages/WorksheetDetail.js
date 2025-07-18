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
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { worksheetService } from '../services/api';

const WorksheetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worksheet, setWorksheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorksheet();
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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
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
                {worksheet.metadata.aigp && worksheet.metadata.aigp.length > 0 ? (
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

            {worksheet.metadata.operations && worksheet.metadata.operations.length > 0 && (
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
    </Container>
  );
};

export default WorksheetDetail;
