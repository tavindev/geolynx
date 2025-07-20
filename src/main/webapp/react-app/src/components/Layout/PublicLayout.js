import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
} from '@mui/material';
import {
  Map as MapIcon,
  Pets as PetsIcon,
  HistoryEdu as HistoryIcon,
  Description as WorksheetIcon,
  Assignment as ExecutionSheetIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid #e0e0e0' }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 600 }}
          >
            GeoLynx
          </Typography>
          {user ? (
            <Button color="primary" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          ) : (
            <Button color="primary" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            bgcolor: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
            background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
            color: 'white',
            py: 8,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 700, mb: 2 }}
                >
                  GeoLynx
                </Typography>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: 300, mb: 3, color: 'white' }}
                >
                  Advanced Geographic Information & Wildlife Management System
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    mb: 4,
                    opacity: 0.9,
                  }}
                >
                  Explore, analyze, and manage geographic data with our
                  comprehensive platform. Track wildlife populations, manage
                  conservation projects, and visualize spatial data with
                  powerful interactive maps and analytics tools.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                  <Chip
                    icon={<MapIcon />}
                    label="Interactive Maps"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    icon={<PetsIcon />}
                    label="Wildlife Tracking"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    icon={<LocationIcon />}
                    label="GIS Analytics"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Stack>
                {!user && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        bgcolor: 'white',
                        color: '#2e7d32',
                        '&:hover': { bgcolor: 'grey.100' },
                      }}
                    >
                      Get Started
                    </Button>
                  </Stack>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -20,
                      left: -20,
                      right: 20,
                      bottom: 20,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      transform: 'rotate(3deg)',
                    },
                  }}
                >
                  <Card sx={{ position: 'relative', zIndex: 1 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Platform Features
                      </Typography>
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <WorksheetIcon sx={{ color: '#2e7d32' }} />
                          <Typography>Worksheet Management</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <ExecutionSheetIcon sx={{ color: '#2e7d32' }} />
                          <Typography>Execution Sheet Tracking</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <PetsIcon sx={{ color: '#2e7d32' }} />
                          <Typography>Animal Population Monitoring</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <HistoryIcon sx={{ color: '#2e7d32' }} />
                          <Typography>Historical Data Analysis</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Interactive Map Section */}
        <Container maxWidth={false} sx={{ height: '100%', py: 6 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout;
