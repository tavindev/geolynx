import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  useMap,
  FeatureGroup,
} from 'react-leaflet';
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
proj4.defs(
  'EPSG:3763',
  '+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);

// Convert coordinates to EPSG:4326 (WGS84)
const convertCoordinates = (coordinates) => {
  const isWGS84 = (coord) => {
    return Math.abs(coord[0]) <= 180 && Math.abs(coord[1]) <= 90;
  };

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

// Convert coordinates from WGS84 to EPSG:3763
const convertToEPSG3763 = (coordinates) => {
  return coordinates.map((coord) => {
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

// Map component to automatically fit bounds to show all polygons
function MapFitBounds({ polygons, showAvailablePolygons, open }) {
  const map = useMap();

  useEffect(() => {
    // Only fit bounds when modal opens and we're showing available polygons
    if (open && showAvailablePolygons && polygons && polygons.length > 0) {
      // Add multiple attempts with increasing delays to ensure map is ready
      const attempts = [100, 300, 500, 1000];
      let timers = [];

      attempts.forEach((delay, index) => {
        const timer = setTimeout(() => {
          try {
            // Check if map is ready
            if (!map || !map.getSize().x || !map.getSize().y) {
              console.log(`Map not ready yet, attempt ${index + 1}`);
              return;
            }

            const bounds = L.latLngBounds();
            let hasValidBounds = false;

            polygons.forEach((polygon) => {
              if (polygon.geometry && polygon.geometry.type === 'Polygon') {
                const convertedCoords = convertCoordinates(
                  polygon.geometry.coordinates
                );
                if (convertedCoords && convertedCoords.length > 0) {
                  convertedCoords[0].forEach((coord) => {
                    if (Array.isArray(coord) && coord.length >= 2) {
                      const [lat, lng] = coord;
                      if (
                        !isNaN(lat) &&
                        !isNaN(lng) &&
                        Math.abs(lat) <= 90 &&
                        Math.abs(lng) <= 180 &&
                        lat !== 0 &&
                        lng !== 0
                      ) {
                        bounds.extend([lat, lng]);
                        hasValidBounds = true;
                      }
                    }
                  });
                }
              }
            });

            if (hasValidBounds && bounds.isValid()) {
              // Force map to invalidate size first
              map.invalidateSize();

              // Then fit bounds with animation disabled for immediate effect
              map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 15,
                animate: false,
                duration: 0,
              });

              // Clear remaining timers if successful
              timers.forEach((t, i) => {
                if (i > index) clearTimeout(t);
              });

              console.log('Map bounds fitted successfully');
            }
          } catch (error) {
            console.error('Error fitting map bounds:', error);
          }
        }, delay);

        timers.push(timer);
      });

      return () => {
        // Clear all timers on cleanup
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [map, polygons, showAvailablePolygons, open]);

  // Also listen for map ready events
  useEffect(() => {
    if (open && showAvailablePolygons && polygons && polygons.length > 0) {
      const handleMapReady = () => {
        // Give it a moment then fit bounds
        setTimeout(() => {
          try {
            const bounds = L.latLngBounds();
            let hasValidBounds = false;

            polygons.forEach((polygon) => {
              if (polygon.geometry && polygon.geometry.type === 'Polygon') {
                const convertedCoords = convertCoordinates(
                  polygon.geometry.coordinates
                );
                if (convertedCoords && convertedCoords.length > 0) {
                  convertedCoords[0].forEach((coord) => {
                    if (Array.isArray(coord) && coord.length >= 2) {
                      const [lat, lng] = coord;
                      if (
                        !isNaN(lat) &&
                        !isNaN(lng) &&
                        Math.abs(lat) <= 90 &&
                        Math.abs(lng) <= 180 &&
                        lat !== 0 &&
                        lng !== 0
                      ) {
                        bounds.extend([lat, lng]);
                        hasValidBounds = true;
                      }
                    }
                  });
                }
              }
            });

            if (hasValidBounds && bounds.isValid()) {
              map.invalidateSize();
              map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 15,
                animate: false,
              });
            }
          } catch (error) {
            console.error('Error in map ready handler:', error);
          }
        }, 200);
      };

      // Listen for various map ready events
      map.on('load', handleMapReady);
      map.whenReady(handleMapReady);

      return () => {
        map.off('load', handleMapReady);
      };
    }
  }, [map, polygons, showAvailablePolygons, open]);

  return null;
}

const PolygonSelector = ({
  open,
  onClose,
  onSelect,
  worksheetId,
  onPolygonCreated,
  allowDrawing = true,
  title = 'Selecionar Polígono',
  availablePolygons = [],
  selectedPolygonIds = [],
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([39.6547, -8.0123]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPolygon, setDrawnPolygon] = useState(null);
  const [polygonName, setPolygonName] = useState('');
  const [polygonDescription, setPolygonDescription] = useState('');
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [showAvailablePolygons, setShowAvailablePolygons] = useState(true);

  useEffect(() => {
    // Set map center based on available polygons
    if (open && availablePolygons.length > 0) {
      try {
        // Calculate bounds of all polygons
        let minLat = Infinity,
          maxLat = -Infinity;
        let minLng = Infinity,
          maxLng = -Infinity;
        let validPolygonsFound = false;

        availablePolygons.forEach((polygon) => {
          if (polygon.geometry && polygon.geometry.type === 'Polygon') {
            const convertedCoords = convertCoordinates(
              polygon.geometry.coordinates
            );
            if (convertedCoords && convertedCoords.length > 0) {
              convertedCoords[0].forEach((coord) => {
                if (Array.isArray(coord) && coord.length >= 2) {
                  const [lat, lng] = coord;
                  if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                    minLat = Math.min(minLat, lat);
                    maxLat = Math.max(maxLat, lat);
                    minLng = Math.min(minLng, lng);
                    maxLng = Math.max(maxLng, lng);
                    validPolygonsFound = true;
                  }
                }
              });
            }
          }
        });

        if (
          validPolygonsFound &&
          minLat !== Infinity &&
          maxLat !== -Infinity &&
          minLng !== Infinity &&
          maxLng !== -Infinity
        ) {
          // Calculate center of all polygons
          const centerLat = (minLat + maxLat) / 2;
          const centerLng = (minLng + maxLng) / 2;
          setMapCenter([centerLat, centerLng]);
        } else {
          // Fallback to first polygon if bounds calculation fails
          const firstPolygon = availablePolygons[0];
          if (
            firstPolygon.geometry &&
            firstPolygon.geometry.type === 'Polygon'
          ) {
            const convertedCoords = convertCoordinates(
              firstPolygon.geometry.coordinates
            );
            if (
              convertedCoords &&
              convertedCoords.length > 0 &&
              convertedCoords[0].length > 0
            ) {
              setMapCenter([
                convertedCoords[0][0][0],
                convertedCoords[0][0][1],
              ]);
            }
          }
        }
      } catch (error) {
        console.error('Error calculating polygon bounds:', error);
        // Keep default center if calculation fails
      }
    }
  }, [open, availablePolygons]);

  const handleClose = () => {
    setSelectedPolygon(null);
    setIsDrawing(false);
    setDrawnPolygon(null);
    setPolygonName('');
    setPolygonDescription('');
    onClose();
  };

  const handleCreated = (e) => {
    const { layerType, layer } = e;
    if (layerType === 'polygon') {
      const latlngs = layer.getLatLngs()[0];
      const coordinates = latlngs.map((latlng) => [latlng.lat, latlng.lng]);

      setDrawnPolygon({
        coordinates: coordinates,
        leafletLayer: layer,
      });
      setIsDrawing(false);
      enqueueSnackbar(
        'Polígono desenhado! Preencha as informações e confirme.',
        {
          variant: 'success',
        }
      );
    }
  };

  const handleSaveDrawnPolygon = async () => {
    if (!drawnPolygon || !polygonName.trim()) {
      enqueueSnackbar('Por favor, preencha o nome do polígono', {
        variant: 'warning',
      });
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
        },
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
            coordinates: [closedCoords],
          },
          properties: polygonData.properties,
        },
      };

      // Pass the new polygon to the parent
      onSelect({
        ...newPolygon,
        type: 'custom',
      });

      enqueueSnackbar('Polígono personalizado criado!', { variant: 'success' });
      handleClose();
    } catch (error) {
      console.error('Error creating custom polygon:', error);
      enqueueSnackbar('Erro ao criar polígono personalizado', {
        variant: 'error',
      });
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
    setShowAvailablePolygons(false);
  };

  const handlePolygonClick = (polygon) => {
    setSelectedPolygon(polygon);
    setIsDrawing(false);
    setDrawnPolygon(null);
  };

  const handleConfirmSelection = () => {
    if (selectedPolygon) {
      onSelect({
        id:
          selectedPolygon.properties?.id ||
          selectedPolygon.properties?.polygonId,
        name: `Polígono ${
          selectedPolygon.properties?.id ||
          selectedPolygon.properties?.polygonId
        }`,
        properties: selectedPolygon.properties,
        feature: selectedPolygon,
        type: 'existing',
      });
      handleClose();
    }
  };

  const getPolygonColor = (polygon) => {
    const polygonId = polygon.properties?.id || polygon.properties?.polygonId;

    // Check if polygon is already selected in the execution sheet
    if (selectedPolygonIds.includes(polygonId)) {
      return '#e74c3c'; // Red for already selected
    }

    // Check if this is the currently selected polygon
    if (
      selectedPolygon &&
      (selectedPolygon.properties?.id === polygonId ||
        selectedPolygon.properties?.polygonId === polygonId)
    ) {
      return '#27ae60'; // Green for current selection
    }

    return '#3498db'; // Blue for available
  };

  const isPolygonSelectable = (polygon) => {
    const polygonId = polygon.properties?.id || polygon.properties?.polygonId;
    return !selectedPolygonIds.includes(polygonId);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {title}
        {selectedPolygon && (
          <Chip
            label={`Selecionado: Polígono ${
              selectedPolygon.properties?.id ||
              selectedPolygon.properties?.polygonId
            }`}
            color="success"
            size="small"
            sx={{ ml: 2 }}
          />
        )}
        {drawnPolygon && (
          <Chip
            label="Polígono desenhado"
            color="success"
            size="small"
            sx={{ ml: 2 }}
          />
        )}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tabs for selection mode */}
        {allowDrawing && (
          <Tabs
            value={showAvailablePolygons ? 0 : 1}
            onChange={(e, newValue) => {
              setShowAvailablePolygons(newValue === 0);
              setIsDrawing(false);
              setSelectedPolygon(null);
              setDrawnPolygon(null);
            }}
            sx={{ mb: 2 }}
          >
            <Tab label="Selecionar Existente" />
            <Tab label="Desenhar Novo" />
          </Tabs>
        )}

        {/* Available Polygons Info */}
        {showAvailablePolygons && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {availablePolygons.length > 0
                ? `${
                    availablePolygons.filter((p) => isPolygonSelectable(p))
                      .length
                  } polígono(s) disponível(is) para seleção`
                : 'Nenhum polígono disponível'}
            </Typography>
            {selectedPolygonIds.length > 0 && (
              <Typography variant="caption" color="error">
                {selectedPolygonIds.length} polígono(s) já atribuído(s) (em
                vermelho)
              </Typography>
            )}
          </Box>
        )}

        {/* Drawing Section */}
        {!showAvailablePolygons && (
          <Box sx={{ mb: 2 }}>
            {!drawnPolygon ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {isDrawing
                    ? 'Clique no mapa para desenhar o polígono.'
                    : 'Clique para começar a desenhar um novo polígono.'}
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
            <MapFitBounds
              polygons={availablePolygons}
              showAvailablePolygons={showAvailablePolygons}
              open={open}
            />
            <MapControls />

            {/* Available Polygons */}
            {showAvailablePolygons &&
              availablePolygons.map((polygon, index) => {
                if (polygon.geometry && polygon.geometry.type === 'Polygon') {
                  const convertedCoords = convertCoordinates(
                    polygon.geometry.coordinates
                  );
                  const polygonId =
                    polygon.properties?.id || polygon.properties?.polygonId;
                  const isSelectable = isPolygonSelectable(polygon);

                  if (convertedCoords && convertedCoords.length >= 3) {
                    return (
                      <Polygon
                        key={polygonId || index}
                        positions={convertedCoords}
                        pathOptions={{
                          color: getPolygonColor(polygon),
                          fillColor: getPolygonColor(polygon),
                          fillOpacity:
                            selectedPolygon &&
                            (selectedPolygon.properties?.id === polygonId ||
                              selectedPolygon.properties?.polygonId ===
                                polygonId)
                              ? 0.6
                              : 0.3,
                          weight:
                            selectedPolygon &&
                            (selectedPolygon.properties?.id === polygonId ||
                              selectedPolygon.properties?.polygonId ===
                                polygonId)
                              ? 3
                              : 2,
                          dashArray: isSelectable ? null : '5, 5',
                        }}
                        eventHandlers={{
                          click: () =>
                            isSelectable ? handlePolygonClick(polygon) : null,
                        }}
                      >
                        <Popup>
                          <Box sx={{ minWidth: 200 }}>
                            <Typography variant="h6">
                              Polígono {polygonId}
                            </Typography>
                            {polygon.properties?.aigp && (
                              <Typography variant="body2">
                                <strong>AIGP:</strong> {polygon.properties.aigp}
                              </Typography>
                            )}
                            {polygon.properties?.ruralPropertyId && (
                              <Typography variant="body2">
                                <strong>Propriedade Rural:</strong>{' '}
                                {polygon.properties.ruralPropertyId}
                              </Typography>
                            )}
                            {polygon.properties?.uiId && (
                              <Typography variant="body2">
                                <strong>UI:</strong> {polygon.properties.uiId}
                              </Typography>
                            )}
                            {!isSelectable && (
                              <Alert severity="warning" sx={{ mt: 1 }}>
                                Polígono já atribuído
                              </Alert>
                            )}
                            {isSelectable && (
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
                            )}
                          </Box>
                        </Popup>
                      </Polygon>
                    );
                  }
                }
                return null;
              })}

            {/* Drawing Controls */}
            {!showAvailablePolygons && isDrawing && (
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
                        message:
                          '<strong>Erro:</strong> As linhas não podem se cruzar!',
                      },
                      shapeOptions: {
                        color: '#2ecc71',
                        weight: 3,
                        fillOpacity: 0.4,
                      },
                    },
                  }}
                  edit={{
                    edit: false,
                    remove: false,
                  }}
                />
              </FeatureGroup>
            )}

            {/* Show drawn polygon */}
            {drawnPolygon && (
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

        {/* Selection mode button */}
        {showAvailablePolygons && selectedPolygon && (
          <Button
            onClick={handleConfirmSelection}
            variant="contained"
            startIcon={<CheckIcon />}
          >
            Confirmar Seleção
          </Button>
        )}

        {/* Drawing mode buttons */}
        {!showAvailablePolygons && drawnPolygon && (
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
