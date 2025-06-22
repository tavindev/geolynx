import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMap } from 'react-leaflet';
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
} from '@mui/material';
import {
  Layers as LayersIcon,
  MyLocation as MyLocationIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../contexts/AuthContext';

// Fix for default markers in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Mock data for AIGPs (Áreas Integradas de Gestão da Paisagem)
const mockAIGPs = [
  {
    id: 1,
    name: 'Cardigos',
    coordinates: [[39.6547, -8.0123], [39.6647, -8.0123], [39.6647, -8.0023], [39.6547, -8.0023]],
    area: 1250,
    status: 'active',
    operations: 3,
  },
  {
    id: 2,
    name: 'Amêndoa',
    coordinates: [[39.6347, -8.0323], [39.6447, -8.0323], [39.6447, -8.0223], [39.6347, -8.0223]],
    area: 980,
    status: 'planning',
    operations: 0,
  },
  {
    id: 3,
    name: 'Castelo',
    coordinates: [[39.6147, -8.0523], [39.6247, -8.0523], [39.6247, -8.0423], [39.6147, -8.0423]],
    area: 1500,
    status: 'completed',
    operations: 5,
  },
];

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
    map.locate().on("locationfound", function (e) {
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

const Map = () => {
  const { user } = useAuth();
  const [selectedAIGPs, setSelectedAIGPs] = useState([1, 2, 3]);
  const [showOperations, setShowOperations] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  // Center of Portugal (roughly Mação area)
  const mapCenter = [39.6347, -8.0323];

  const getPolygonColor = (status) => {
    switch (status) {
      case 'active': return '#2ecc71';
      case 'planning': return '#f39c12';
      case 'completed': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const handleToggleAIGP = (id) => {
    setSelectedAIGPs(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Mapa Interativo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {user ? 'Visualize e gerencie os pontos no mapa.' : 'Explore os pontos no mapa. Faça login para mais funcionalidades.'}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={user ? 9 : 12}>
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
                
                <MapControls />

                {mockAIGPs
                  .filter(aigp => selectedAIGPs.includes(aigp.id))
                  .map(aigp => (
                    <Polygon
                      key={aigp.id}
                      positions={aigp.coordinates}
                      pathOptions={{
                        color: getPolygonColor(aigp.status),
                        fillOpacity: 0.4,
                        weight: 2,
                      }}
                      eventHandlers={{
                        click: () => setSelectedArea(aigp),
                      }}
                    >
                      <Popup>
                        <Box sx={{ minWidth: 200 }}>
                          <Typography variant="h6">{aigp.name}</Typography>
                          <Typography variant="body2">Área: {aigp.area} ha</Typography>
                          <Typography variant="body2">Operações: {aigp.operations}</Typography>
                          <Chip 
                            label={aigp.status} 
                            size="small" 
                            sx={{ 
                              mt: 1,
                              backgroundColor: getPolygonColor(aigp.status),
                              color: 'white'
                            }} 
                          />
                        </Box>
                      </Popup>
                    </Polygon>
                  ))}

                {showOperations && (
                  <>
                    <Marker position={[39.6597, -8.0073]}>
                      <Popup>
                        <Typography variant="body2">Operação: Limpeza de Mato</Typography>
                        <Typography variant="caption">Operador: João Silva</Typography>
                      </Popup>
                    </Marker>
                    <Marker position={[39.6397, -8.0273]}>
                      <Popup>
                        <Typography variant="body2">Operação: Plantação</Typography>
                        <Typography variant="caption">Operador: Maria Santos</Typography>
                      </Popup>
                    </Marker>
                  </>
                )}
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
                    maxWidth: 300,
                    zIndex: 1000,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{selectedArea.name}</Typography>
                    <IconButton size="small" onClick={() => setSelectedArea(null)}>
                      ×
                    </IconButton>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">Área Total: {selectedArea.area} hectares</Typography>
                  <Typography variant="body2">Operações Ativas: {selectedArea.operations}</Typography>
                  <Typography variant="body2">Estado: {selectedArea.status}</Typography>
                </Paper>
              )}
            </Box>
          </Paper>
        </Grid>

        {user && (
          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Estatísticas
              </Typography>
              {/* Add statistics content here */}
              <Typography color="text.secondary">
                Estatísticas serão exibidas aqui
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Layers Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Camadas do Mapa
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Áreas de Intervenção (AIGPs)
          </Typography>
          <List>
            {mockAIGPs.map(aigp => (
              <ListItem key={aigp.id} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedAIGPs.includes(aigp.id)}
                    onChange={() => handleToggleAIGP(aigp.id)}
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={aigp.name}
                  secondary={`${aigp.area} ha - ${aigp.status}`}
                />
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <FormControlLabel
            control={
              <Switch
                checked={showOperations}
                onChange={(e) => setShowOperations(e.target.checked)}
              />
            }
            label="Mostrar Operações Ativas"
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Legenda
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: '#2ecc71' }} />
                <Typography variant="caption">Área Ativa</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: '#f39c12' }} />
                <Typography variant="caption">Em Planeamento</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: '#3498db' }} />
                <Typography variant="caption">Concluída</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Container>
  );
};

export default Map;
