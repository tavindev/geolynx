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
  Map as MapIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import proj4 from 'proj4';
import { worksheetService, executionSheetService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Fix for default markers in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Define projection for EPSG:3763 (Portuguese grid system)
proj4.defs(
  'EPSG:3763',
  '+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);

// Convert coordinates to EPSG:4326 (WGS84)
const convertCoordinates = (coordinates) => {
  const isWGS84 = (coord) => {
    return Math.abs(coord[0]) <= 180 && Math.abs(coord[1]) <= 90;
  };

  // Handle the case where each coordinate is wrapped in its own array
  // e.g., [[[lng, lat]], [[lng, lat]], ...] instead of [[lng, lat], [lng, lat], ...]
  if (
    coordinates.length > 0 &&
    Array.isArray(coordinates[0]) &&
    coordinates[0].length === 1 &&
    Array.isArray(coordinates[0][0])
  ) {
    // Flatten the structure
    const flattened = coordinates.map((pointArray) => pointArray[0]);

    return flattened.map((coord) => {
      if (!Array.isArray(coord) || coord.length < 2) return [0, 0];

      if (isWGS84(coord)) {
        return [coord[1], coord[0]]; // GeoJSON is [lng, lat], Leaflet expects [lat, lng]
      }
      try {
        const [lng, lat] = proj4('EPSG:3763', 'EPSG:4326', [
          coord[0],
          coord[1],
        ]);
        return [lat, lng];
      } catch (error) {
        console.error('Coordinate conversion error:', error);
        return [0, 0];
      }
    });
  }

  // Standard polygon format
  return coordinates.map((ring) => {
    if (!Array.isArray(ring)) return [];

    return ring.map((coord) => {
      if (!Array.isArray(coord) || coord.length < 2) return [0, 0];

      if (isWGS84(coord)) {
        return [coord[1], coord[0]]; // GeoJSON is [lng, lat], Leaflet expects [lat, lng]
      }
      try {
        const [lng, lat] = proj4('EPSG:3763', 'EPSG:4326', [
          coord[0],
          coord[1],
        ]);
        return [lat, lng];
      } catch (error) {
        console.error('Coordinate conversion error:', error);
        return [0, 0];
      }
    });
  });
};

const WorksheetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [worksheet, setWorksheet] = useState(null);
  const [executionSheets, setExecutionSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState([39.6547, -8.0123]); // Default center for Portugal

  useEffect(() => {
    fetchWorksheet();
    fetchExecutionSheets();
  }, [id]);

  const fetchWorksheet = async () => {
    try {
      setLoading(true);
      const response = await worksheetService.get(id);
      setWorksheet(response.data);

      // Set map center based on first polygon if available
      if (response.data?.features && response.data.features.length > 0) {
        const firstFeature = response.data.features[0];
        if (firstFeature.geometry && firstFeature.geometry.type === 'Polygon') {
          const convertedCoords = convertCoordinates(
            firstFeature.geometry.coordinates
          );
          if (convertedCoords && convertedCoords.length > 0) {
            setMapCenter([convertedCoords[0][0], convertedCoords[0][1]]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching worksheet:', error);
      setError('Erro ao carregar ficha de obra');
    } finally {
      setLoading(false);
    }
  };

  const fetchExecutionSheets = async () => {
    try {
      const response = await executionSheetService.getByWorksheetId(
        parseInt(id)
      );
      const sheets = response.data.executionSheets || [];
      setExecutionSheets(sheets);
    } catch (error) {
      console.error('Error fetching execution sheets:', error);
      // If the specific endpoint fails, fallback to getting all and filtering
      try {
        const fallbackResponse = await executionSheetService.getMyAssignments();
        const allSheets = fallbackResponse.data.executionSheets || [];
        const filteredSheets = allSheets.filter(
          (sheet) => sheet.workSheetId === parseInt(id)
        );
        setExecutionSheets(filteredSheets);
      } catch (fallbackError) {
        console.error(
          'Error in fallback execution sheets fetch:',
          fallbackError
        );
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
                navigate('/dashboard/execution-sheets/create', {
                  state: { worksheetId: parseInt(id) },
                })
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

      {/* Map Section */}
      {worksheet?.features && worksheet.features.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 3,
            border: '1px solid #e0e0e0',
            boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MapIcon sx={{ mr: 1 }} />
            <Typography variant="h5">Mapa de Polígonos</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ height: '500px', position: 'relative' }}>
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {worksheet.features.map((feature, index) => {
                if (feature.geometry && feature.geometry.type === 'Polygon') {
                  const convertedCoords = convertCoordinates(
                    feature.geometry.coordinates
                  );

                  if (convertedCoords && convertedCoords.length >= 3) {
                    return (
                      <Polygon
                        key={index}
                        positions={convertedCoords}
                        pathOptions={{
                          color: '#3498db',
                          fillColor: '#3498db',
                          fillOpacity: 0.3,
                          weight: 2,
                        }}
                      >
                        <Popup>
                          <Box sx={{ minWidth: 200 }}>
                            <Typography variant="h6">
                              Polígono{' '}
                              {feature.properties?.polygonId ||
                                feature.properties?.id ||
                                index + 1}
                            </Typography>
                            {feature.properties?.aigp && (
                              <Typography variant="body2">
                                <strong>AIGP:</strong> {feature.properties.aigp}
                              </Typography>
                            )}
                            {feature.properties?.ruralPropertyId && (
                              <Typography variant="body2">
                                <strong>Propriedade Rural:</strong>{' '}
                                {feature.properties.ruralPropertyId}
                              </Typography>
                            )}
                            {feature.properties?.uiId && (
                              <Typography variant="body2">
                                <strong>UI:</strong> {feature.properties.uiId}
                              </Typography>
                            )}
                            {feature.properties?.area && (
                              <Typography variant="body2">
                                <strong>Área:</strong> {feature.properties.area}{' '}
                                ha
                              </Typography>
                            )}
                          </Box>
                        </Popup>
                      </Polygon>
                    );
                  }
                }
                return null;
              })}
            </MapContainer>
          </Box>
        </Paper>
      )}

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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Folhas de Execução Associadas
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AssignmentIcon />}
            onClick={() =>
              navigate('/dashboard/execution-sheets', {
                state: { worksheetId: parseInt(id) },
              })
            }
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
                        ? new Date(sheet.startingDate).toLocaleDateString(
                            'pt-PT'
                          )
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {sheet.finishingDate
                        ? new Date(sheet.finishingDate).toLocaleDateString(
                            'pt-PT'
                          )
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
                        onClick={() =>
                          navigate(`/dashboard/execution-sheets/${sheet.id}`)
                        }
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
