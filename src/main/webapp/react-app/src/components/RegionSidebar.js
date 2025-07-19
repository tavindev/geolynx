import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Pets as AnimalIcon,
  Museum as HistoryIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

const RegionSidebar = ({ regionData, loading, error, coordinates }) => {
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          height: '600px',
          border: '1px solid #e0e0e0',
          boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            Carregando dados da região...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          height: '600px',
          border: '1px solid #e0e0e0',
          boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Paper>
    );
  }

  if (!regionData) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          height: '600px',
          border: '1px solid #e0e0e0',
          boxShadow: '0px 8px 24px -10px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <LocationIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Dados da Região
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mova o mapa para ver informações da região
          </Typography>
        </Box>
      </Paper>
    );
  }

  const { animals = [], historicalCuriosities = [] } = regionData;

  return (
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
        Informações da Região
      </Typography>
      
      {coordinates && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Coordenadas: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Animals Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AnimalIcon color="primary" />
          <Typography variant="h6">
            Animais
          </Typography>
          <Chip 
            label={animals.length} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>
        
        {animals.length > 0 ? (
          <List dense>
            {animals.map((animal, index) => (
              <ListItem key={index} sx={{ pl: 0, alignItems: 'flex-start' }}>
                <ListItemAvatar>
                  <Avatar
                    src={animal.image}
                    alt={animal.name}
                    sx={{ width: 48, height: 48 }}
                  >
                    <AnimalIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={animal.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" component="span">
                        {animal.description}
                      </Typography>
                      {animal.userId && (
                        <Typography 
                          variant="caption" 
                          component="div" 
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Adicionado por usuário: {animal.userId}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
            Nenhum animal encontrado nesta região
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Historical Curiosities Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <HistoryIcon color="secondary" />
          <Typography variant="h6">
            Curiosidades Históricas
          </Typography>
          <Chip 
            label={historicalCuriosities.length} 
            size="small" 
            color="secondary" 
            variant="outlined"
          />
        </Box>
        
        {historicalCuriosities.length > 0 ? (
          <List dense>
            {historicalCuriosities.map((curiosity, index) => (
              <ListItem key={index} sx={{ pl: 0 }}>
                <ListItemIcon>
                  <HistoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={curiosity.title || 'Curiosidade Histórica'}
                  secondary={curiosity.description}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
            Nenhuma curiosidade histórica encontrada nesta região
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default RegionSidebar;