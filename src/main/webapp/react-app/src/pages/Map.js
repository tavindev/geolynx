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
  Card,
  CardContent,
  CardActions,
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
proj4.defs(
  'EPSG:3763',
  '+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);

// Convert coordinates to EPSG:4326 (WGS84) - handles both old and new formats
const convertCoordinates = (coordinates) => {
  const isWGS84 = (coord) => {
    return Math.abs(coord[0]) <= 180 && Math.abs(coord[1]) <= 90;
  };

  // Handle the new format where each coordinate is wrapped in its own array
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

      // If already in WGS84, just swap to [lat, lng] for Leaflet
      if (isWGS84(coord)) {
        return [coord[1], coord[0]]; // GeoJSON is [lng, lat], Leaflet expects [lat, lng]
      }
      // Otherwise convert from EPSG:3763
      try {
        const [lng, lat] = proj4('EPSG:3763', 'EPSG:4326', [
          coord[0],
          coord[1],
        ]);
        return [lat, lng]; // Leaflet expects [lat, lng]
      } catch (error) {
        console.error('Coordinate conversion error:', error);
        return [0, 0];
      }
    });
  });
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

// Map updater component for programmatic map updates
function MapUpdater({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] !== undefined && center[1] !== undefined) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [map, center, zoom]);

  return null;
}

// Map controls component
function MapControls({
  user,
  onCreateAnimal,
  onCreateCuriosity,
  onCreateExecutionSheet,
}) {
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
          </>
        )}
      </Box>
    </Box>
  );
}

// Component to render polygons from all worksheets
const AllWorksheetPolygons = ({ onPolygonClick, onPolygonsLoad }) => {
  const [polygons, setPolygons] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadPolygons = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await worksheetService.getPolygons();
      const polygonData = response.data || response;
      const polygonsArray = Array.isArray(polygonData) ? polygonData : [];
      setPolygons(polygonsArray);
      
      if (onPolygonsLoad) {
        onPolygonsLoad(polygonsArray);
      }
    } catch (error) {
      console.error('Error loading polygons:', error);
      setPolygons([]);
    } finally {
      setLoading(false);
    }
  }, [user, onPolygonsLoad]);

  useEffect(() => {
    if (user) {
      loadPolygons();
    } else {
      setPolygons([]);
    }
  }, [user, loadPolygons]);
  
  if (loading || !polygons || polygons.length === 0) {
    return null;
  }

  return (
    <>
      {polygons.map((polygonWithWorksheet, index) => {
        // Handle both old format (raw GeoFeature) and new format (PolygonWithWorksheetDTO)
        const isOldFormat = polygonWithWorksheet.type === 'Feature';
        const feature = isOldFormat ? polygonWithWorksheet : polygonWithWorksheet.polygon;
        const worksheetMetadata = isOldFormat ? null : polygonWithWorksheet.worksheetMetadata;
        
        if (!feature?.geometry || feature.geometry.type !== 'Polygon') {
          return null;
        }

        const convertedCoords = convertCoordinates(feature.geometry.coordinates);

        // Use the same validation as WorksheetDetail.js
        if (!convertedCoords || convertedCoords.length < 3) {
          return null;
        }

        const color = getPolygonColor(feature.properties?.aigp || worksheetMetadata?.worksheetId?.toString() || feature.properties?.id?.toString() || 'default');

        return (
          <Polygon
            key={`polygon-${worksheetMetadata?.worksheetId || feature.properties?.id}-${index}`}
            positions={convertedCoords}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.3,
              weight: 2,
            }}
            eventHandlers={{
              click: () => onPolygonClick && onPolygonClick(isOldFormat ? { polygon: feature, worksheetMetadata: null } : polygonWithWorksheet),
            }}
          >
            <Popup>
              <Box sx={{ minWidth: 250 }}>
                <Typography variant="h6">
                  Polígono{' '}
                  {feature.properties?.polygonId ||
                    feature.properties?.id ||
                    index + 1}
                </Typography>
                {worksheetMetadata && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                      Folha de Obra #{worksheetMetadata.worksheetId}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Início:</strong> {worksheetMetadata.startingDate || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Fim:</strong> {worksheetMetadata.finishingDate || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Fornecedor:</strong> {worksheetMetadata.serviceProviderId || 'N/A'}
                    </Typography>
                    {worksheetMetadata.posaCode && (
                      <Typography variant="body2">
                        <strong>POSA:</strong> {worksheetMetadata.posaCode}
                      </Typography>
                    )}
                    <Divider sx={{ my: 1 }} />
                  </>
                )}
                {feature.properties?.aigp && (
                  <Typography variant="body2">
                    <strong>AIGP:</strong> {feature.properties.aigp}
                  </Typography>
                )}
                {feature.properties?.ruralPropertyId && (
                  <Typography variant="body2">
                    <strong>Propriedade Rural:</strong> {feature.properties.ruralPropertyId}
                  </Typography>
                )}
                {feature.properties?.uiId && (
                  <Typography variant="body2">
                    <strong>UI:</strong> {feature.properties.uiId}
                  </Typography>
                )}
                {feature.properties?.area && (
                  <Typography variant="body2">
                    <strong>Área:</strong> {feature.properties.area} ha
                  </Typography>
                )}
              </Box>
            </Popup>
          </Polygon>
        );
      })}
    </>
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
        const response = await worksheetService.get(worksheetId);
        setWorksheet(response.data || response);
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

  const color = getPolygonColor(worksheetInfo.aigp?.[0] || 'default');

  return (
    <>
      {worksheet.features.map((feature, index) => {
        if (!feature.geometry || feature.geometry.type !== 'Polygon')
          return null;

        const convertedCoords = convertCoordinates(
          feature.geometry.coordinates
        );

        // Skip if no valid coordinates
        if (!convertedCoords[0] || convertedCoords[0].length < 3) return null;

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
              click: () =>
                onAreaClick({
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
                <Typography variant="h6">
                  Polígono {feature.properties?.polygon_id || index + 1}
                </Typography>
                <Typography variant="body2">
                  <strong>AIGP:</strong>{' '}
                  {feature.properties?.aigp ||
                    worksheetInfo.aigp?.join(', ') ||
                    'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Propriedade Rural:</strong>{' '}
                  {feature.properties?.rural_property_id || 'N/A'}
                </Typography>
                {feature.properties?.UI_id && (
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
  const colors = [
    '#2ecc71',
    '#3498db',
    '#f39c12',
    '#e74c3c',
    '#9b59b6',
    '#1abc9c',
  ];
  let hash = 0;
  const str = aigp || 'default';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Map = () => {
  const { user } = useAuth();
  const [worksheets, setWorksheets] = useState([]);
  const [worksheetsLoading, setWorksheetsLoading] = useState(true);
  const [selectedWorksheets, setSelectedWorksheets] = useState([]);
  const [showAnimals, setShowAnimals] = useState(true);
  const [showHistoricalCuriosities, setShowHistoricalCuriosities] =
    useState(true);
  const [showWorksheets, setShowWorksheets] = useState(true);
  const [showAllWorksheetPolygons, setShowAllWorksheetPolygons] =
    useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [regionLoading, setRegionLoading] = useState(false);
  const [regionError, setRegionError] = useState(null);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [createAnimalOpen, setCreateAnimalOpen] = useState(false);
  const [createCuriosityOpen, setCreateCuriosityOpen] = useState(false);
  const [targetMapCenter, setTargetMapCenter] = useState(null);
  const mapRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Center of Portugal (roughly Mação area - converted from EPSG:3763 examples)
  const [mapCenter, setMapCenter] = useState([39.6547, -8.0123]);

  // Load worksheets on component mount
  useEffect(() => {
    if (user) {
      loadWorksheets();
    }
  }, [user]);

  const loadWorksheets = useCallback(async () => {
    setWorksheetsLoading(true);
    try {
      // For PO operators, don't load worksheets since they should only see their execution sheets
      if (user?.role === 'PO') {
        setWorksheets([]);
        setSelectedWorksheets([]);
        setWorksheetsLoading(false);
        return;
      }

      const response = await worksheetService.getAll();
      
      // Handle different response formats
      const worksheetData = response.data || response;

      // Ensure we have an array
      if (Array.isArray(worksheetData)) {
        setWorksheets(worksheetData);
        // Select all worksheets by default
        setSelectedWorksheets(worksheetData.map((ws) => ws.id));
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
  }, [user]);

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
    setSelectedArea(areaData);
  };

  const handlePolygonsLoad = useCallback((loadedPolygons) => {
    if (!loadedPolygons || loadedPolygons.length === 0) {
      return;
    }
    
    // Center map on first polygon if available
    const firstPolygon = loadedPolygons[0].polygon;
    if (firstPolygon?.geometry?.coordinates) {
      const convertedCoords = convertCoordinates(firstPolygon.geometry.coordinates);
      if (convertedCoords && convertedCoords.length > 0) {
        // Get center of first polygon
        const latSum = convertedCoords.reduce((sum, coord) => sum + coord[0], 0);
        const lngSum = convertedCoords.reduce((sum, coord) => sum + coord[1], 0);
        const centerLat = latSum / convertedCoords.length;
        const centerLng = lngSum / convertedCoords.length;
        setMapCenter([centerLat, centerLng]);
        setTargetMapCenter([centerLat, centerLng]);
      }
    }
  }, []);

  const handleWorksheetClick = useCallback(async (worksheetId) => {
    try {
      // Load the specific worksheet to get its polygon data
      const response = await worksheetService.get(worksheetId);
      const worksheet = response.data || response;
      
      if (worksheet && worksheet.features && worksheet.features.length > 0) {
        // Calculate bounds of all polygons in this worksheet
        let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
        
        worksheet.features.forEach(feature => {
          if (feature.geometry && feature.geometry.coordinates) {
            const convertedCoords = convertCoordinates(feature.geometry.coordinates);
            convertedCoords.forEach(coord => {
              minLat = Math.min(minLat, coord[0]);
              maxLat = Math.max(maxLat, coord[0]);
              minLng = Math.min(minLng, coord[1]);
              maxLng = Math.max(maxLng, coord[1]);
            });
          }
        });
        
        if (minLat !== Infinity && maxLat !== -Infinity) {
          // Calculate center
          const centerLat = (minLat + maxLat) / 2;
          const centerLng = (minLng + maxLng) / 2;
          
          // Update target center for MapUpdater component
          setTargetMapCenter([centerLat, centerLng]);
        }
      }
    } catch (error) {
      console.error('Error loading worksheet for navigation:', error);
    }
  }, []);

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
        <Grid item xs={12} md={3}>
          {/* Worksheet List Sidebar */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '600px',
              border: '1px solid #e0e0e0',
              boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
              overflow: 'auto',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Folhas de Obra
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {!user ? (
              <Typography variant="body2" color="text.secondary">
                Faça login para ver as folhas de obra
              </Typography>
            ) : worksheetsLoading ? (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Carregando folhas de obra...
                </Typography>
                <CircularProgress size={20} sx={{ mt: 1 }} />
              </Box>
            ) : worksheets.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nenhuma folha de obra encontrada
              </Typography>
            ) : (
              <List>
                {worksheets.map((worksheet) => (
                  <ListItem 
                    key={worksheet.id}
                    sx={{ 
                      mb: 1, 
                      p: 0,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      }
                    }}
                    onClick={() => handleWorksheetClick(worksheet.id)}
                  >
                    <Card sx={{ width: '100%' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="subtitle2" color="primary">
                          Folha #{worksheet.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {worksheet.operations?.length || 0} operações
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {worksheet.startingDate || 'Data não definida'}
                        </Typography>
                        {worksheet.posaCode && (
                          <>
                            <br />
                            <Chip 
                              label={worksheet.posaCode} 
                              size="small" 
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
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
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapEventHandler onMoveEnd={handleMapMoveEnd} />
                <MapUpdater center={targetMapCenter} zoom={13} />
                <MapControls
                  user={user}
                  onCreateAnimal={() => setCreateAnimalOpen(true)}
                  onCreateCuriosity={() => setCreateCuriosityOpen(true)}
                  onCreateExecutionSheet={() => {}}
                />

                {/* All Worksheet Polygons Layer */}
                {showAllWorksheetPolygons && user && (
                  <AllWorksheetPolygons
                    onPolygonClick={(polygonWithWorksheet) => {
                      setSelectedArea({
                        polygon: polygonWithWorksheet.polygon,
                        feature: polygonWithWorksheet.polygon.properties,
                        worksheetMetadata: polygonWithWorksheet.worksheetMetadata,
                        type: 'allWorksheets',
                      });
                    }}
                    onPolygonsLoad={handlePolygonsLoad}
                  />
                )}

                {/* Worksheets Layer */}
                {showWorksheets &&
                  !worksheetsLoading &&
                  worksheets &&
                  worksheets.length > 0 &&
                  worksheets
                    .filter((worksheet) =>
                      selectedWorksheets.includes(worksheet.id)
                    )
                    .map((worksheet) => (
                      <React.Fragment key={worksheet.id}>
                        <WorksheetPolygons
                          worksheetId={worksheet.id}
                          worksheetInfo={worksheet}
                          onAreaClick={handleAreaClick}
                        />
                      </React.Fragment>
                    ))}

                {/* Animals Layer */}
                {showAnimals &&
                  regionData?.animals?.map((animal, index) => (
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
                              style={{
                                width: '100%',
                                marginTop: 8,
                                borderRadius: 4,
                              }}
                            />
                          )}
                        </Box>
                      </Popup>
                    </Marker>
                  ))}

                {/* Historical Curiosities Layer */}
                {showHistoricalCuriosities &&
                  regionData?.historicalCuriosities?.map((curiosity, index) => (
                    <Marker
                      key={`history-${index}`}
                      position={[curiosity.latitude, curiosity.longitude]}
                      icon={historyIcon}
                    >
                      <Popup>
                        <Box sx={{ minWidth: 200 }}>
                          <Typography variant="h6">
                            {curiosity.title || 'Curiosidade Histórica'}
                          </Typography>
                          <Typography variant="body2">
                            {curiosity.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Adicionado em:{' '}
                            {new Date(curiosity.createdAt).toLocaleDateString(
                              'pt-BR'
                            )}
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
                    <Typography variant="h6">
                      {selectedArea.type === 'allWorksheets'
                        ? 'Polígono'
                        : 'Folha de Obra'}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setSelectedArea(null)}
                    >
                      ×
                    </IconButton>
                  </Box>
                  <Divider sx={{ my: 1 }} />

                  {selectedArea.type === 'allWorksheets' ? (
                    // Display polygon information with worksheet metadata
                    <>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                        Folha de Obra #{selectedArea.worksheetMetadata?.worksheetId}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Início:</strong> {selectedArea.worksheetMetadata?.startingDate || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Fim:</strong> {selectedArea.worksheetMetadata?.finishingDate || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Fornecedor:</strong> {selectedArea.worksheetMetadata?.serviceProviderId || 'N/A'}
                      </Typography>
                      {selectedArea.worksheetMetadata?.posaCode && (
                        <Typography variant="body2">
                          <strong>POSA:</strong> {selectedArea.worksheetMetadata.posaCode}
                        </Typography>
                      )}
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2">
                        <strong>Polígono ID:</strong>{' '}
                        {selectedArea.feature?.id ||
                          selectedArea.feature?.polygonId ||
                          'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>AIGP:</strong>{' '}
                        {selectedArea.feature?.aigp || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Propriedade Rural:</strong>{' '}
                        {selectedArea.feature?.ruralPropertyId || 'N/A'}
                      </Typography>
                      {selectedArea.feature?.uiId && (
                        <Typography variant="body2">
                          <strong>UI:</strong> {selectedArea.feature.uiId}
                        </Typography>
                      )}
                      {selectedArea.feature?.area && (
                        <Typography variant="body2">
                          <strong>Área:</strong> {selectedArea.feature.area} ha
                        </Typography>
                      )}
                    </>
                  ) : (
                    // Display worksheet information
                    <>
                      <Typography variant="body2">
                        <strong>ID:</strong> {selectedArea.worksheetId}
                      </Typography>
                      <Typography variant="body2">
                        <strong>AIGP:</strong>{' '}
                        {selectedArea.aigp?.join(', ') ||
                          selectedArea.feature?.aigp ||
                          'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Período:</strong>{' '}
                        {selectedArea.worksheet?.metadata?.startingDate ||
                          'N/A'}{' '}
                        até{' '}
                        {selectedArea.worksheet?.metadata?.finishingDate ||
                          'N/A'}
                      </Typography>
                      {selectedArea.worksheet?.metadata?.operations &&
                        selectedArea.worksheet.metadata.operations.length >
                          0 && (
                          <>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <strong>Operações:</strong>
                            </Typography>
                            {selectedArea.worksheet.metadata.operations.map(
                              (op, idx) => (
                                <Typography
                                  key={idx}
                                  variant="caption"
                                  component="div"
                                  sx={{ ml: 1 }}
                                >
                                  • {op.operationDescription} ({op.areaHa} ha)
                                </Typography>
                              )
                            )}
                          </>
                        )}
                    </>
                  )}
                </Paper>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
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
          {user?.role === 'PO' ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              Como operador, suas operações são visualizadas através das folhas
              de execução atribuídas.
            </Typography>
          ) : worksheetsLoading ? (
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
                          AIGP:{' '}
                          {worksheet.aigp ? worksheet.aigp.join(', ') : 'N/A'}
                        </Typography>
                        <Typography variant="caption" component="div">
                          {worksheet.operations
                            ? worksheet.operations.length
                            : 0}{' '}
                          operações
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
                checked={showAllWorksheetPolygons}
                onChange={(e) =>
                  setShowAllWorksheetPolygons(e.target.checked)
                }
              />
            }
            label="Mostrar Todos os Polígonos"
          />

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
                <Typography variant="caption">
                  Curiosidades Históricas
                </Typography>
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
    </Container>
  );
};

export default Map;
