import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
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
} from '@mui/material';
import {
  MyLocation as MyLocationIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { worksheetService } from '../services/api';
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

// Convert coordinates to EPSG:4326 (WGS84)
const convertCoordinates = (coordinates) => {
  // Check if coordinates are already in WGS84 (values between -180 to 180 for lng, -90 to 90 for lat)
  const isWGS84 = (coord) => {
    return Math.abs(coord[0]) <= 180 && Math.abs(coord[1]) <= 90;
  };

  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return [];
  }

  return coordinates.map(coord => {
    if (!Array.isArray(coord) || coord.length < 2) return [0, 0];

    // If already in WGS84, just swap to [lat, lng] for Leaflet
    if (isWGS84(coord)) {
      return [coord[1], coord[0]]; // GeoJSON is [lng, lat], Leaflet expects [lat, lng]
    }
    // Otherwise convert from EPSG:3763
    try {
      const [lng, lat] = proj4('EPSG:3763', 'EPSG:4326', [coord[0], coord[1]]);
      return [lat, lng]; // Leaflet expects [lat, lng]
    } catch (error) {
      console.error('Coordinate conversion error:', error);
      return [0, 0];
    }
  });
};

// Map controls component
function MapControls() {
  const map = useMap();

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
      </Box>
    </Box>
  );
}

const PolygonSelector = ({ open, onClose, onSelect, worksheetId }) => {
  const [polygons, setPolygons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([39.6547, -8.0123]); // Default center

  useEffect(() => {
    if (open && worksheetId) {
      fetchWorksheetPolygons();
    }
  }, [open, worksheetId]);

  const fetchWorksheetPolygons = async () => {
    try {
      setLoading(true);
      const response = await worksheetService.get(worksheetId);
      const worksheet = response.data || response;

      if (worksheet.features && worksheet.features.length > 0) {
        const extractedPolygons = [];
        let allCoords = [];

        worksheet.features.forEach((feature, index) => {
          if (feature.geometry && feature.geometry.type === 'Polygon' && feature.geometry.coordinates) {
            // Get the polygon ID from properties
            const polygonId = feature.properties?.polygon_id ||
                            feature.properties?.polygonId ||
                            feature.properties?.id ||
                            (index + 1);

            // Convert coordinates
            const coords = feature.geometry.coordinates[0]; // Get the outer ring
            const convertedCoords = convertCoordinates(coords);

            if (convertedCoords.length >= 3) { // Valid polygon needs at least 3 points
              extractedPolygons.push({
                id: polygonId,
                name: `Polígono ${polygonId}`,
                coordinates: convertedCoords,
                properties: feature.properties,
                originalFeature: feature,
              });

              // Collect all coordinates for centering
              allCoords = allCoords.concat(convertedCoords);
            }
          }
        });

        setPolygons(extractedPolygons);

        // Calculate center from all coordinates if we have polygons
        if (allCoords.length > 0) {
          const latSum = allCoords.reduce((sum, coord) => sum + coord[0], 0);
          const lngSum = allCoords.reduce((sum, coord) => sum + coord[1], 0);
          const centerLat = latSum / allCoords.length;
          const centerLng = lngSum / allCoords.length;
          setMapCenter([centerLat, centerLng]);
        }
      } else {
        setError('Nenhum polígono encontrado nesta folha de obra');
      }
    } catch (error) {
      console.error('Error fetching worksheet polygons:', error);
      setError('Erro ao carregar polígonos da folha de obra');
    } finally {
      setLoading(false);
    }
  };

  const handlePolygonClick = (polygon) => {
    setSelectedPolygon(polygon);
  };

  const handleConfirmSelection = () => {
    if (selectedPolygon) {
      onSelect({
        id: selectedPolygon.id,
        name: selectedPolygon.name,
        properties: selectedPolygon.properties,
        feature: selectedPolygon.originalFeature,
      });
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedPolygon(null);
    onClose();
  };

  const getPolygonColor = (polygon) => {
    return selectedPolygon?.id === polygon.id ? '#e74c3c' : '#3498db';
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Selecionar Polígono</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Selecionar Polígono
        {selectedPolygon && (
          <Chip
            label={`Selecionado: ${selectedPolygon.name}`}
            color="primary"
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

        {polygons.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Nenhum polígono disponível para seleção nesta folha de obra.
          </Alert>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Clique num polígono no mapa para selecioná-lo. Total de polígonos: {polygons.length}
            </Typography>

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

                {polygons.map((polygon) => (
                  <Polygon
                    key={polygon.id}
                    positions={polygon.coordinates}
                    pathOptions={{
                      color: getPolygonColor(polygon),
                      fillOpacity: selectedPolygon?.id === polygon.id ? 0.6 : 0.3,
                      weight: selectedPolygon?.id === polygon.id ? 3 : 2,
                    }}
                    eventHandlers={{
                      click: () => handlePolygonClick(polygon),
                    }}
                  >
                    <Popup>
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="h6">{polygon.name}</Typography>
                        <Typography variant="body2">ID: {polygon.id}</Typography>
                        {polygon.properties?.rural_property_id && (
                          <Typography variant="body2">
                            Propriedade: {polygon.properties.rural_property_id}
                          </Typography>
                        )}
                        {polygon.properties?.aigp && (
                          <Typography variant="body2">
                            AIGP: {polygon.properties.aigp}
                          </Typography>
                        )}
                        {polygon.properties?.UI_id && (
                          <Typography variant="body2">
                            UI: {polygon.properties.UI_id}
                          </Typography>
                        )}
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<CheckIcon />}
                          onClick={() => handlePolygonClick(polygon)}
                          sx={{ mt: 1 }}
                        >
                          Selecionar
                        </Button>
                      </Box>
                    </Popup>
                  </Polygon>
                ))}
              </MapContainer>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleConfirmSelection}
          variant="contained"
          disabled={!selectedPolygon}
        >
          Confirmar Seleção
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PolygonSelector;