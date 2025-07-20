import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  Marker,
  useMap,
  LayerGroup,
  LayersControl,
} from 'react-leaflet';
import {
  Container,
  Paper,
  Box,
  Typography,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  Chip,
  Divider,
  FormControlLabel,
  Switch,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Layers as LayersIcon,
  MyLocation as MyLocationIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Add as AddIcon,
  Pets as PetsIcon,
  HistoryEdu as HistoryIcon,
  Description as WorksheetIcon,
  Engineering as OperationIcon,
  Assignment as ExecutionSheetIcon,
} from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../contexts/AuthContext';
import { regionService, worksheetService } from '../services/api';
import RegionSidebar from '../components/RegionSidebar';
import CreateAnimalModal from '../components/CreateAnimalModal';
import CreateCuriosityModal from '../components/CreateCuriosityModal';
import CreateExecutionSheetModal from '../components/CreateExecutionSheetModal';
import proj4 from 'proj4';

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

// Convert EPSG:3763 to EPSG:4326 (WGS84)
const convertCoordinates = (coordinates) => {
  return coordinates.map(ring => 
    ring.map(coord => {
      const [lng, lat] = proj4('EPSG:3763', 'EPSG:4326', [coord[0], coord[1]]);
      return [lat, lng]; // Leaflet expects [lat, lng]
    })
  );
};

// Custom animal marker icon
const animalIcon = L.divIcon({
  className: 'custom-animal-marker',
  html: '<div style="background-color: #4CAF50; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px;">🦁</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Custom historical curiosity marker icon
const historyIcon = L.divIcon({
  className: 'custom-history-marker',
  html: '<div style="background-color: #2196F3; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px;">🏛️</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Map event handler component
function MapEventHandler({ onMoveEnd }) {
  const map = useMap();

  useEffect(() => {
    const handleMoveEnd = () => {
      const center = map.getCenter();
      onMoveEnd(center.lat, center.lng);
    };

    map.on('moveend', handleMoveEnd);

    // Trigger initial load
    const center = map.getCenter();
    onMoveEnd(center.lat, center.lng);

    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onMoveEnd]);

  return null;
}

// Map controls component
function MapControls({ user, onCreateAnimal, onCreateCuriosity, onCreateExecutionSheet }) {
  const map = useMap();
  const { hasPermission } = useAuth();
  const canCreateExecutionSheet = hasPermission('create_execution_sheet');

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleLocate = () => {
    map.locate().on('locationfound', function (e) {
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

        {user && (
          <>
            <Divider sx={{ my: 1, bgcolor: 'white' }} />
            <Fab
              size="small"
              color="success"
              onClick={onCreateAnimal}
              title="Adicionar Animal"
            >
              <PetsIcon />
            </Fab>
            <Fab
              size="small"
              color="info"
              onClick={onCreateCuriosity}
              title="Adicionar Curiosidade Histórica"
            >
              <HistoryIcon />
            </Fab>
            {canCreateExecutionSheet && (
              <Fab
                size="small"
                color="warning"
                onClick={onCreateExecutionSheet}
                title="Criar Folha de Execução"
              >
                <ExecutionSheetIcon />
              </Fab>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

const Map = () => {
  const { user } = useAuth();
  const [worksheets, setWorksheets] = useState([]);
  const [worksheetsLoading, setWorksheetsLoading] = useState(true);
  const [selectedWorksheets, setSelectedWorksheets] = useState([]);
  const [showAnimals, setShowAnimals] = useState(true);
  const [showHistoricalCuriosities, setShowHistoricalCuriosities] = useState(true);
  const [showWorksheets, setShowWorksheets] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [regionLoading, setRegionLoading] = useState(false);
  const [regionError, setRegionError] = useState(null);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [createAnimalOpen, setCreateAnimalOpen] = useState(false);
  const [createCuriosityOpen, setCreateCuriosityOpen] = useState(false);
  const [createExecutionSheetOpen, setCreateExecutionSheetOpen] = useState(false);
  const [selectedPolygonForExecution, setSelectedPolygonForExecution] = useState(null);
  const [selectedWorksheetForExecution, setSelectedWorksheetForExecution] = useState(null);
  const mapRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Center of Portugal (roughly Mação area - converted from EPSG:3763 examples)
  const mapCenter = [39.6547, -8.0123];

  // Load worksheets on component mount
  useEffect(() => {
    loadWorksheets();
  }, []);

  const loadWorksheets = async () => {
    setWorksheetsLoading(true);
    try {
      const response = await worksheetService.getAll();
      console.log('Worksheets response:', response); // Debug log
      
      // Handle different response formats
      const worksheetData = response.data || response;
      
      // Ensure we have an array
      if (Array.isArray(worksheetData)) {
        setWorksheets(worksheetData);
        // Select all worksheets by default
        setSelectedWorksheets(worksheetData.map(ws => ws.id));
      } else {
        console.error('Worksheets response is not an array:', worksheetData);
        setWorksheets([]);
        setSelectedWorksheets([]);
      }
    } catch (error) {
      console.error('Error loading worksheets:', error);
      setWorksheets([]);
      setSelectedWorksheets([]);
    } finally {
      setWorksheetsLoading(false);
    }
  };

  const getPolygonColor = (aigp) => {
    // Generate color based on AIGP name for consistency
    const colors = ['#2ecc71', '#3498db', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'];
    let hash = 0;
    for (let i = 0; i < aigp.length; i++) {
      hash = aigp.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleToggleWorksheet = (id) => {
    setSelectedWorksheets((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMapMoveEnd = useCallback((lat, lng) => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new coordinates immediately for UI responsiveness
    setCurrentCoordinates({ lat, lng });

    // Debounce the API call by 1 second
    debounceTimeoutRef.current = setTimeout(async () => {
      setRegionLoading(true);
      setRegionError(null);

      try {
        const response = await regionService.getRegionData(lat, lng);
        
        // The backend already returns coordinates as Double values, not microdegrees
        setRegionData(response.data);
      } catch (error) {
        console.error('Error fetching region data:', error);
        setRegionError('Erro ao carregar dados da região');
      } finally {
        setRegionLoading(false);
      }
    }, 500);
  }, []);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleCreationSuccess = () => {
    // Refresh region data if coordinates are available
    if (currentCoordinates) {
      handleMapMoveEnd(currentCoordinates.lat, currentCoordinates.lng);
    }
    // Refresh worksheets to show any new execution sheets
    loadWorksheets();
  };

  const handleAreaClick = (areaData) => {
    if (areaData.createExecutionSheet) {
      // Open execution sheet modal with preselected data
      setSelectedPolygonForExecution(areaData.polygon);
      setSelectedWorksheetForExecution(areaData.worksheetInfo);
      setCreateExecutionSheetOpen(true);
    } else {
      // Regular area selection
      setSelectedArea(areaData);
    }
  };

  // Get detailed worksheet data
  const getDetailedWorksheet = async (worksheetId) => {
    try {
      const detailed = await worksheetService.get(worksheetId);
      return detailed;
    } catch (error) {
      console.error('Error fetching worksheet details:', error);
      return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Mapa Interativo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {user
            ? 'Visualize e gerencie os pontos no mapa.'
            : 'Explore os pontos no mapa. Faça login para mais funcionalidades.'}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '600px',
              border: '1px solid #e0e0e0',
              boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ height: '100%', position: 'relative' }}>
              <MapContainer
                center={mapCenter}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapEventHandler onMoveEnd={handleMapMoveEnd} />
                <MapControls
                  user={user}
                  onCreateAnimal={() => setCreateAnimalOpen(true)}
                  onCreateCuriosity={() => setCreateCuriosityOpen(true)}
                  onCreateExecutionSheet={() => setCreateExecutionSheetOpen(true)}
                />

                {/* Worksheets Layer */}
                {showWorksheets && !worksheetsLoading && worksheets && worksheets.length > 0 && worksheets
                  .filter((worksheet) => selectedWorksheets.includes(worksheet.id))
                  .map((worksheet) => (
                    <React.Fragment key={worksheet.id}>
                      {/* We need to fetch full worksheet data to get the geometry */}
                      <WorksheetPolygons 
                        worksheetId={worksheet.id} 
                        worksheetInfo={worksheet}
                        onAreaClick={handleAreaClick}
                      />
                    </React.Fragment>
                  ))}

                {/* Animals Layer */}
                {showAnimals && regionData?.animals?.map((animal, index) => (
                  <Marker
                    key={`animal-${index}`}
                    position={[animal.latitude, animal.longitude]}
                    icon={animalIcon}
                  >
                    <Popup>
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="h6">{animal.name}</Typography>
                        <Typography variant="body2">
                          {animal.description}
                        </Typography>
                        {animal.image && (
                          <img 
                            src={animal.image} 
                            alt={animal.name} 
                            style={{ width: '100%', marginTop: 8, borderRadius: 4 }}
                          />
                        )}
                      </Box>
                    </Popup>
                  </Marker>
                ))}

                {/* Historical Curiosities Layer */}
                {showHistoricalCuriosities && regionData?.historicalCuriosities?.map((curiosity, index) => (
                  <Marker
                    key={`history-${index}`}
                    position={[curiosity.latitude, curiosity.longitude]}
                    icon={historyIcon}
                  >
                    <Popup>
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="h6">{curiosity.title || 'Curiosidade Histórica'}</Typography>
                        <Typography variant="body2">
                          {curiosity.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Adicionado em: {new Date(curiosity.createdAt).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Floating Action Button for Layers */}
              <Fab
                color="primary"
                sx={{ position: 'absolute', bottom: 20, right: 20 }}
                onClick={toggleDrawer}
              >
                <LayersIcon />
              </Fab>

              {/* Area Info Card */}
              {selectedArea && (
                <Paper
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    p: 2,
                    maxWidth: 400,
                    zIndex: 1000,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6">Folha de Obra</Typography>
                    <IconButton
                      size="small"
                      onClick={() => setSelectedArea(null)}
                    >
                      ×
                    </IconButton>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>ID:</strong> {selectedArea.worksheetId}
                  </Typography>
                  <Typography variant="body2">
                    <strong>AIGP:</strong> {selectedArea.aigp.join(', ')}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Período:</strong> {selectedArea.startingDate} até {selectedArea.finishingDate}
                  </Typography>
                  {selectedArea.operations && selectedArea.operations.length > 0 && (
                    <>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Operações:</strong>
                      </Typography>
                      {selectedArea.operations.map((op, idx) => (
                        <Typography key={idx} variant="caption" component="div" sx={{ ml: 1 }}>
                          • {op.operationDescription} ({op.areaHa} ha)
                        </Typography>
                      ))}
                    </>
                  )}
                </Paper>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <RegionSidebar
            regionData={regionData}
            loading={regionLoading}
            error={regionError}
            coordinates={currentCoordinates}
          />
        </Grid>
      </Grid>

      {/* Layers Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Camadas do Mapa
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Folhas de Obra
          </Typography>
          {worksheetsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : worksheets && worksheets.length > 0 ? (
            <List>
              {worksheets.map((worksheet) => (
                <ListItem key={worksheet.id} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedWorksheets.includes(worksheet.id)}
                      onChange={() => handleToggleWorksheet(worksheet.id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={`ID: ${worksheet.id}`}
                    secondary={
                      <Box>
                        <Typography variant="caption" component="div">
                          AIGP: {worksheet.aigp ? worksheet.aigp.join(', ') : 'N/A'}
                        </Typography>
                        <Typography variant="caption" component="div">
                          {worksheet.operations ? worksheet.operations.length : 0} operações
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              Nenhuma folha de obra encontrada
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <FormControlLabel
            control={
              <Switch
                checked={showWorksheets}
                onChange={(e) => setShowWorksheets(e.target.checked)}
              />
            }
            label="Mostrar Folhas de Obra"
          />

          <FormControlLabel
            control={
              <Switch
                checked={showAnimals}
                onChange={(e) => setShowAnimals(e.target.checked)}
              />
            }
            label="Mostrar Animais"
          />

          <FormControlLabel
            control={
              <Switch
                checked={showHistoricalCuriosities}
                onChange={(e) => setShowHistoricalCuriosities(e.target.checked)}
              />
            }
            label="Mostrar Curiosidades Históricas"
          />

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Legenda
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorksheetIcon fontSize="small" color="primary" />
                <Typography variant="caption">Folhas de Obra</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ExecutionSheetIcon fontSize="small" color="warning" />
                <Typography variant="caption">Folhas de Execução</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PetsIcon fontSize="small" color="success" />
                <Typography variant="caption">Animais</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon fontSize="small" color="info" />
                <Typography variant="caption">Curiosidades Históricas</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Create Animal Modal */}
      <CreateAnimalModal
        open={createAnimalOpen}
        onClose={() => setCreateAnimalOpen(false)}
        coordinates={currentCoordinates}
        user={user}
        onSuccess={handleCreationSuccess}
      />

      {/* Create Historical Curiosity Modal */}
      <CreateCuriosityModal
        open={createCuriosityOpen}
        onClose={() => setCreateCuriosityOpen(false)}
        coordinates={currentCoordinates}
        user={user}
        onSuccess={handleCreationSuccess}
      />

      {/* Create Execution Sheet Modal */}
      <CreateExecutionSheetModal
        open={createExecutionSheetOpen}
        onClose={() => {
          setCreateExecutionSheetOpen(false);
          setSelectedPolygonForExecution(null);
          setSelectedWorksheetForExecution(null);
        }}
        coordinates={currentCoordinates}
        user={user}
        onSuccess={handleCreationSuccess}
        preselectedPolygon={selectedPolygonForExecution}
        preselectedWorksheet={selectedWorksheetForExecution}
      />
    </Container>
  );
};

// Component to render worksheet polygons
const WorksheetPolygons = ({ worksheetId, worksheetInfo, onAreaClick }) => {
  const [worksheet, setWorksheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadWorksheet = async () => {
      try {
        const data = await worksheetService.get(worksheetId);
        setWorksheet(data);
      } catch (error) {
        console.error('Error loading worksheet details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorksheet();
  }, [worksheetId]);

  if (loading || !worksheet || !worksheet.features) {
    return null;
  }

  const color = getPolygonColor(worksheetInfo.aigp[0] || 'default');

  return (
    <>
      {worksheet.features.map((feature, index) => {
        if (feature.geometry.type !== 'Polygon') return null;

        const convertedCoords = convertCoordinates(feature.geometry.coordinates);

        return (
          <Polygon
            key={`${worksheetId}-${index}`}
            positions={convertedCoords[0]}
            pathOptions={{
              color: color,
              fillOpacity: 0.4,
              weight: 2,
            }}
            eventHandlers={{
              click: () => onAreaClick({
                worksheetId: worksheetId,
                worksheetInfo: worksheetInfo,
                worksheet: worksheet,
                feature: feature.properties,
                polygon: feature,
              }),
            }}
          >
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="h6">Polígono {feature.properties.polygon_id}</Typography>
                <Typography variant="body2">
                  <strong>AIGP:</strong> {feature.properties.aigp}
                </Typography>
                <Typography variant="body2">
                  <strong>Propriedade Rural:</strong> {feature.properties.rural_property_id}
                </Typography>
                {feature.properties.UI_id && (
                  <Typography variant="body2">
                    <strong>UI:</strong> {feature.properties.UI_id}
                  </Typography>
                )}
                {user && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      startIcon={<ExecutionSheetIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAreaClick({
                          worksheetId: worksheetId,
                          worksheetInfo: worksheetInfo,
                          worksheet: worksheet,
                          feature: feature.properties,
                          polygon: feature,
                          createExecutionSheet: true,
                        });
                      }}
                      fullWidth
                    >
                      Criar Folha de Execução
                    </Button>
                  </Box>
                )}
              </Box>
            </Popup>
          </Polygon>
        );
      })}
    </>
  );
};

// Helper function for color generation
const getPolygonColor = (aigp) => {
  const colors = ['#2ecc71', '#3498db', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'];
  let hash = 0;
  for (let i = 0; i < aigp.length; i++) {
    hash = aigp.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default Map;
