import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Chip,
  Fab,
} from '@mui/material';
import {
  Check as CheckIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  MyLocation as MyLocationIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
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

// Convert coordinates to EPSG:4326 (WGS84) - same as WorksheetDetail
const convertCoordinates = (coordinates) => {
  const isWGS84 = (coord) => {
    return Math.abs(coord[0]) <= 180 && Math.abs(coord[1]) <= 90;
  };

  // Handle the case where each coordinate is wrapped in its own array
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

// Map controls component
function MapControls() {
  const handleZoomIn = () => {
    // Access map instance through window
    if (window.mapInstance) {
      window.mapInstance.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (window.mapInstance) {
      window.mapInstance.zoomOut();
    }
  };

  const handleLocate = () => {
    if (window.mapInstance) {
      window.mapInstance.locate().on('locationfound', (e) => {
        window.mapInstance.flyTo(e.latlng, window.mapInstance.getZoom());
      });
    }
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

const PolygonSelectionMap = ({
  open,
  onClose,
  onSelect,
  availablePolygons = [],
  selectedPolygonIds = [],
  title = "Selecionar Polígono"
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [mapCenter, setMapCenter] = useState([39.6547, -8.0123]);

  useEffect(() => {
    // Set map center based on first available polygon
    if (open && availablePolygons.length > 0) {
      const firstPolygon = availablePolygons[0];
      if (firstPolygon.geometry && firstPolygon.geometry.type === 'Polygon') {
        const convertedCoords = convertCoordinates(firstPolygon.geometry.coordinates);
        if (convertedCoords && convertedCoords.length > 0) {
          setMapCenter([convertedCoords[0][0], convertedCoords[0][1]]);
        }
      }
    }
  }, [open, availablePolygons]);

  const handleClose = () => {
    setSelectedPolygon(null);
    onClose();
  };

  const handlePolygonClick = (polygon) => {
    const polygonId = polygon.properties?.id || polygon.properties?.polygonId;
    if (!selectedPolygonIds.includes(polygonId)) {
      setSelectedPolygon(polygon);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedPolygon) {
      const polygonId = selectedPolygon.properties?.id || selectedPolygon.properties?.polygonId;
      onSelect({
        id: polygonId,
        name: `Polígono ${polygonId}`,
        properties: selectedPolygon.properties,
        feature: selectedPolygon,
        type: 'existing'
      });
      enqueueSnackbar(`Polígono ${polygonId} selecionado`, { variant: 'success' });
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
    if (selectedPolygon && 
        (selectedPolygon.properties?.id === polygonId || 
         selectedPolygon.properties?.polygonId === polygonId)) {
      return '#27ae60'; // Green for current selection
    }
    
    return '#3498db'; // Blue for available
  };

  const isPolygonSelectable = (polygon) => {
    const polygonId = polygon.properties?.id || polygon.properties?.polygonId;
    return !selectedPolygonIds.includes(polygonId);
  };

  const availableCount = availablePolygons.filter(p => isPolygonSelectable(p)).length;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MapIcon sx={{ mr: 1 }} />
          {title}
          {selectedPolygon && (
            <Chip
              label={`Selecionado: Polígono ${selectedPolygon.properties?.id || selectedPolygon.properties?.polygonId}`}
              color="success"
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* Info section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {availablePolygons.length > 0 
              ? `${availableCount} polígono(s) disponível(is) para seleção`
              : 'Nenhum polígono disponível'}
          </Typography>
          {selectedPolygonIds.length > 0 && (
            <Typography variant="caption" color="error">
              {selectedPolygonIds.length} polígono(s) já atribuído(s) (em vermelho)
            </Typography>
          )}
        </Box>

        {availablePolygons.length === 0 ? (
          <Alert severity="info">
            Nenhum polígono encontrado na folha de obra selecionada.
          </Alert>
        ) : (
          <Box sx={{ height: '500px', position: 'relative' }}>
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              whenCreated={(mapInstance) => {
                window.mapInstance = mapInstance;
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapControls />

              {availablePolygons.map((polygon, index) => {
                if (polygon.geometry && polygon.geometry.type === 'Polygon') {
                  const convertedCoords = convertCoordinates(polygon.geometry.coordinates);
                  const polygonId = polygon.properties?.id || polygon.properties?.polygonId;
                  const isSelectable = isPolygonSelectable(polygon);
                  
                  if (convertedCoords && convertedCoords.length >= 3) {
                    return (
                      <Polygon
                        key={polygonId || index}
                        positions={convertedCoords}
                        pathOptions={{
                          color: getPolygonColor(polygon),
                          fillColor: getPolygonColor(polygon),
                          fillOpacity: selectedPolygon && 
                            (selectedPolygon.properties?.id === polygonId || 
                             selectedPolygon.properties?.polygonId === polygonId) ? 0.6 : 0.3,
                          weight: selectedPolygon && 
                            (selectedPolygon.properties?.id === polygonId || 
                             selectedPolygon.properties?.polygonId === polygonId) ? 3 : 2,
                          dashArray: isSelectable ? null : '5, 5',
                          cursor: isSelectable ? 'pointer' : 'not-allowed',
                        }}
                        eventHandlers={{ 
                          click: () => isSelectable ? handlePolygonClick(polygon) : null 
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
                                <strong>Propriedade Rural:</strong> {polygon.properties.ruralPropertyId}
                              </Typography>
                            )}
                            {polygon.properties?.uiId && (
                              <Typography variant="body2">
                                <strong>UI:</strong> {polygon.properties.uiId}
                              </Typography>
                            )}
                            {polygon.properties?.area && (
                              <Typography variant="body2">
                                <strong>Área:</strong> {polygon.properties.area} ha
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
            </MapContainer>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        {selectedPolygon && availableCount > 0 && (
          <Button
            onClick={handleConfirmSelection}
            variant="contained"
            startIcon={<CheckIcon />}
          >
            Confirmar Seleção
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PolygonSelectionMap;