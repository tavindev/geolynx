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

  // Center of Portugal (roughly Mação area)
  const mapCenter = [39.6347, -8.0323];

  useEffect(() => {
    if (open && worksheetId) {
      fetchWorksheetPolygons();
    }
  }, [open, worksheetId]);

  const fetchWorksheetPolygons = async () => {
    try {
      setLoading(true);
      const response = await worksheetService.get(worksheetId);
      const worksheet = response.data;

      if (worksheet.features && worksheet.features.length > 0) {
        const extractedPolygons = worksheet.features.map((feature, index) => ({
          id: feature.properties?.polygonId || index + 1,
          name: `Polígono ${feature.properties?.polygonId || index + 1}`,
          coordinates: feature.geometry?.coordinates?.[0] || [],
          properties: feature.properties,
        }));
        setPolygons(extractedPolygons);
      } else {
        // Fallback to mock data if no features found
        setPolygons([
          {
            id: 1,
            name: 'Polígono 1',
            coordinates: [
              [39.6547, -8.0123],
              [39.6647, -8.0123],
              [39.6647, -8.0023],
              [39.6547, -8.0023],
            ],
          },
          {
            id: 2,
            name: 'Polígono 2',
            coordinates: [
              [39.6347, -8.0323],
              [39.6447, -8.0323],
              [39.6447, -8.0223],
              [39.6347, -8.0223],
            ],
          },
        ]);
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
      onSelect(selectedPolygon);
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

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Clique num polígono no mapa para selecioná-lo
        </Typography>

        <Box sx={{ height: '500px', position: 'relative' }}>
          <MapContainer
            center={mapCenter}
            zoom={11}
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
                    {polygon.properties?.ruralPropertyId && (
                      <Typography variant="body2">
                        Propriedade: {polygon.properties.ruralPropertyId}
                      </Typography>
                    )}
                    {polygon.properties?.aigp && (
                      <Typography variant="body2">
                        AIGP: {polygon.properties.aigp}
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
