import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Fab,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  Grid,
  Tabs,
  Tab,
  Paper,
  Divider,
} from '@mui/material';
import {
  MyLocation as MyLocationIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import { worksheetService } from '../services/api';
import proj4 from 'proj4';
import { useSnackbar } from 'notistack';

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
proj4.defs("EPSG:3763", "+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

// Convert coordinates to EPSG:4326 (WGS84)
const convertCoordinates = (coordinates) => {
  const isWGS84 = (coord) => {
    return Math.abs(coord[0]) <= 180 && Math.abs(coord[1]) <= 90;
  };

  return coordinates.map(ring => {
    if (!Array.isArray(ring)) return [];

    return ring.map(coord => {
      if (!Array.isArray(coord) || coord.length < 2) return [0, 0];

      if (isWGS84(coord)) {
        return [coord[1], coord[0]]; // GeoJSON is [lng, lat], Leaflet expects [lat, lng]
      }
      try {
        const [lng, lat] = proj4('EPSG:3763', 'EPSG:4326', [coord[0], coord[1]]);
        return [lat, lng];
      } catch (error) {
        console.error('Coordinate conversion error:', error);
        return [0, 0];
      }
    });
  });
};

// Convert coordinates from WGS84 to EPSG:3763
const convertToEPSG3763 = (coordinates) => {
  return coordinates.map(coord => {
    try {
      const [x, y] = proj4('EPSG:4326', 'EPSG:3763', [coord[1], coord[0]]);
      return [x, y];
    } catch (error) {
      console.error('Coordinate conversion error:', error);
      return [0, 0];
    }
  });
};

// Map controls component
function MapControls() {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleLocate = () => {
    map.locate().on('locationfound', (e) => {
      map.flyTo(e.latlng, map.getZoom());
    });
  };

  return (
    <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Fab size="small" color="primary" onClick={handleZoomIn}>
          <ZoomInIcon />
        </Fab>
        <Fab size="small" color="primary" onClick={handleZoomOut}>
          <ZoomOutIcon />
        </Fab>
        <Fab size="small" color="secondary" onClick={handleLocate}>
          <MyLocationIcon />
        </Fab>
      </Box>
    </Box>
  );
}

const PolygonSelector = ({ 
  open, 
  onClose, 
  onSelect, 
  worksheetId, 
  onPolygonCreated,
  allowDrawing = true,
  title = "Selecionar ou Desenhar Polígono" 
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [polygons, setPolygons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([39.6547, -8.0123]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [drawnPolygon, setDrawnPolygon] = useState(null);
  const [polygonName, setPolygonName] = useState('');
  const [polygonDescription, setPolygonDescription] = useState('');

  useEffect(() => {
    if (open && worksheetId) {
      fetchWorksheetPolygons();
    }
  }, [open, worksheetId]);

  const fetchWorksheetPolygons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await worksheetService.get(worksheetId);
      const worksheet = response.data || response;

      if (worksheet && worksheet.features) {
        const processedPolygons = worksheet.features.map((feature, index) => {
          if (feature.geometry && feature.geometry.type === 'Polygon') {
            const convertedCoords = convertCoordinates(feature.geometry.coordinates);
            
            if (convertedCoords[0] && convertedCoords[0].length >= 3) {
              return {
                id: feature.properties?.polygon_id || index + 1,
                name: `Polígono ${feature.properties?.polygon_id || index + 1}`,
                coordinates: convertedCoords[0],
                properties: feature.properties,
                originalFeature: feature,
              };
            }
          }
          return null;
        }).filter(Boolean);

        setPolygons(processedPolygons);

        // Set map center to first polygon if available
        if (processedPolygons.length > 0 && processedPolygons[0].coordinates.length > 0) {
          const firstCoord = processedPolygons[0].coordinates[0];
          setMapCenter([firstCoord[0], firstCoord[1]]);
        }
      } else {
        setPolygons([]);
      }
    } catch (error) {
      console.error('Error fetching worksheet polygons:', error);
      setError('Erro ao carregar polígonos da folha de obra');
      setPolygons([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePolygonClick = (polygon) => {
    setSelectedPolygon(polygon);
    setActiveTab(0); // Switch to selection tab
  };

  const handleConfirmSelection = () => {
    if (selectedPolygon) {
      onSelect({
        id: selectedPolygon.id,
        name: selectedPolygon.name,
        properties: selectedPolygon.properties,
        feature: selectedPolygon.originalFeature,
        type: 'existing'
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedPolygon(null);
    setIsDrawing(false);
    setDrawnPolygon(null);
    setPolygonName('');
    setPolygonDescription('');
    setActiveTab(0);
    onClose();
  };

  const getPolygonColor = (polygon) => {
    return selectedPolygon?.id === polygon.id ? '#e74c3c' : '#3498db';
  };

  const handleCreated = (e) => {
    const { layerType, layer } = e;
    if (layerType === 'polygon') {
      const latlngs = layer.getLatLngs()[0];
      const coordinates = latlngs.map(latlng => [latlng.lat, latlng.lng]);
      
      setDrawnPolygon({
        coordinates: coordinates,
        leafletLayer: layer
      });
      setIsDrawing(false);
      enqueueSnackbar('Polígono desenhado! Preencha as informações e confirme.', { 
        variant: 'success' 
      });
    }
  };

  const handleSaveDrawnPolygon = async () => {
    if (!drawnPolygon || !polygonName.trim()) {
      enqueueSnackbar('Por favor, preencha o nome do polígono', { variant: 'warning' });
      return;
    }

    try {
      // Convert coordinates to EPSG:3763 for storage
      const convertedCoords = convertToEPSG3763(drawnPolygon.coordinates);
      
      // Close the last coordinate to make a proper polygon
      const closedCoords = [...convertedCoords];
      if (closedCoords.length > 0) {
        closedCoords.push(closedCoords[0]);
      }

      const polygonData = {
        name: polygonName.trim(),
        description: polygonDescription.trim(),
        coordinates: [closedCoords], // GeoJSON format needs array of rings
        properties: {
          name: polygonName.trim(),
          description: polygonDescription.trim(),
          created_by_user: true,
          created_at: new Date().toISOString(),
        }
      };

      // Call the callback if provided (but don't expect API call)
      if (onPolygonCreated) {
        await onPolygonCreated(polygonData);
      }

      // Create a polygon object for selection
      const newPolygon = {
        id: `custom_${Date.now()}`,
        name: polygonName.trim(),
        coordinates: drawnPolygon.coordinates,
        properties: polygonData.properties,
        originalFeature: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [closedCoords]
          },
          properties: polygonData.properties
        }
      };

      // Pass the new polygon to the parent
      onSelect({
        ...newPolygon,
        type: 'custom'
      });

      enqueueSnackbar('Polígono personalizado criado!', { variant: 'success' });
      handleClose();

    } catch (error) {
      console.error('Error creating custom polygon:', error);
      enqueueSnackbar('Erro ao criar polígono personalizado', { variant: 'error' });
    }
  };

  const handleClearDrawing = () => {
    setDrawnPolygon(null);
    setPolygonName('');
    setPolygonDescription('');
    setIsDrawing(false);
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setDrawnPolygon(null);
    setSelectedPolygon(null);
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Carregando Polígonos</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {title}
        {selectedPolygon && activeTab === 0 && (
          <Chip
            label={`Selecionado: ${selectedPolygon.name}`}
            color="primary"
            size="small"
            sx={{ ml: 2 }}
          />
        )}
        {drawnPolygon && activeTab === 1 && (
          <Chip
            label="Polígono desenhado"
            color="success"
            size="small"
            sx={{ ml: 2 }}
          />
        )}
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {allowDrawing && (
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="Selecionar Existente" />
            <Tab label="Desenhar Novo" />
          </Tabs>
        )}

        {/* Selection Tab */}
        {(!allowDrawing || activeTab === 0) && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Total de polígonos: {polygons.length}
            </Typography>
          </Box>
        )}

        {/* Drawing Tab */}
        {allowDrawing && activeTab === 1 && (
          <Box sx={{ mb: 2 }}>
            {!drawnPolygon ? (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {isDrawing ? 'Clique no mapa para desenhar o polígono.' : 'Clique para começar a desenhar um novo polígono.'}
                </Typography>
                <Button 
                  onClick={handleStartDrawing} 
                  variant="contained"
                  startIcon={<EditIcon />}
                  disabled={isDrawing}
                >
                  {isDrawing ? 'Desenhando...' : 'Desenhar Polígono'}
                </Button>
              </Box>
            ) : (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Informações do Polígono
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nome do Polígono"
                      value={polygonName}
                      onChange={(e) => setPolygonName(e.target.value)}
                      required
                      placeholder="Ex: Área Norte"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Descrição (opcional)"
                      value={polygonDescription}
                      onChange={(e) => setPolygonDescription(e.target.value)}
                      placeholder="Ex: Área para operação de limpeza"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    onClick={handleClearDrawing}
                    startIcon={<ClearIcon />}
                    color="error"
                  >
                    Limpar
                  </Button>
                </Box>
              </Paper>
            )}
          </Box>
        )}

        <Box sx={{ height: '500px', position: 'relative' }}>
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapControls />

            {/* Existing Polygons */}
            {(!allowDrawing || activeTab === 0) && polygons.map((polygon) => (
              <Polygon
                key={polygon.id}
                positions={polygon.coordinates}
                pathOptions={{
                  color: getPolygonColor(polygon),
                  fillOpacity: selectedPolygon?.id === polygon.id ? 0.6 : 0.3,
                  weight: selectedPolygon?.id === polygon.id ? 3 : 2,
                }}
                eventHandlers={{ click: () => handlePolygonClick(polygon) }}
              >
                <Popup>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="h6">{polygon.name}</Typography>
                    <Typography variant="body2">
                      <strong>AIGP:</strong> {polygon.properties?.aigp || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Propriedade Rural:</strong> {polygon.properties?.rural_property_id || 'N/A'}
                    </Typography>
                    {polygon.properties?.UI_id && (
                      <Typography variant="body2">
                        <strong>UI:</strong> {polygon.properties.UI_id}
                      </Typography>
                    )}
                    <Box sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePolygonClick(polygon);
                        }}
                      >
                        Selecionar
                      </Button>
                    </Box>
                  </Box>
                </Popup>
              </Polygon>
            ))}

            {/* Drawing Controls */}
            {allowDrawing && activeTab === 1 && isDrawing && (
              <FeatureGroup>
                <EditControl
                  position="topright"
                  onCreated={handleCreated}
                  draw={{
                    rectangle: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polyline: false,
                    polygon: {
                      allowIntersection: false,
                      drawError: {
                        color: '#e1e100',
                        message: '<strong>Erro:</strong> As linhas não podem se cruzar!'
                      },
                      shapeOptions: {
                        color: '#2ecc71',
                        weight: 3,
                        fillOpacity: 0.4
                      }
                    },
                  }}
                  edit={{
                    edit: false,
                    remove: false
                  }}
                />
              </FeatureGroup>
            )}

            {/* Show drawn polygon */}
            {drawnPolygon && activeTab === 1 && (
              <Polygon
                positions={drawnPolygon.coordinates}
                pathOptions={{
                  color: '#2ecc71',
                  fillOpacity: 0.4,
                  weight: 3,
                }}
              >
                <Popup>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="h6">Polígono Personalizado</Typography>
                    <Typography variant="body2">
                      Nome: {polygonName || 'Não definido'}
                    </Typography>
                    {polygonDescription && (
                      <Typography variant="body2">
                        Descrição: {polygonDescription}
                      </Typography>
                    )}
                  </Box>
                </Popup>
              </Polygon>
            )}
          </MapContainer>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        
        {/* Selection mode buttons */}
        {(!allowDrawing || activeTab === 0) && (
          <Button
            onClick={handleConfirmSelection}
            variant="contained"
            disabled={!selectedPolygon}
            startIcon={<CheckIcon />}
          >
            Confirmar Seleção
          </Button>
        )}

        {/* Drawing mode buttons */}
        {allowDrawing && activeTab === 1 && drawnPolygon && (
          <Button
            onClick={handleSaveDrawnPolygon}
            variant="contained"
            disabled={!polygonName.trim()}
            startIcon={<AddIcon />}
          >
            Salvar Polígono
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PolygonSelector;