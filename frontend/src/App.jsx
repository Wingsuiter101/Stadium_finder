import React from 'react';
import { Container, Grid, Paper, Box, Typography, AppBar, Toolbar } from '@mui/material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import ErrorBoundary from './components/ErrorBoundary';
import ArenaMap from './components/ArenaMap';
import ArenaList from './components/ArenaList';
import DistanceCalculator from './components/DistanceCalculator';
import AttendanceChart from './components/AttendanceChart';
import StadiumSearch from './components/StadiumSearch';

function App() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'background.default',
    }}>
      <AppBar position="static" sx={{ 
        background: 'linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)',
        marginBottom: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      }}>
        <Toolbar>
          <SportsBasketballIcon sx={{ 
            fontSize: 40, 
            marginRight: 2,
            animation: 'bounce 2s ease-in-out infinite',
            '@keyframes bounce': {
              '0%, 100%': {
                transform: 'translateY(0)',
              },
              '50%': {
                transform: 'translateY(-10px)',
              },
            }
          }} />
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '0.5px'
              }}
            >
              Arena Explorer
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                opacity: 0.9,
                letterSpacing: '1px',
                marginTop: -0.5
              }}
            >
              Basketball Venue Analytics
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box mb={4} sx={{ 
              paddingTop: 2,
              visibility: 'visible',
              position: 'relative',
              zIndex: 1
            }}>
              <Typography 
                variant="h3" 
                component="h2" 
                align="center" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                  mb: 2,
                  display: 'block'
                }}
              >
                Explore Basketball Venues Across America
              </Typography>
              <Typography 
                variant="p" 
                align="center" 
                color="text.secondary"
                sx={{ 
                  maxWidth: '800px', 
                  mx: 'auto',
                  mb: 4,
                  opacity: 0.8,
                  display: 'block'
                }}
              >
                Discover detailed information about NBA and NCAA arenas, including capacity, attendance rates, and geographical distribution.
              </Typography>
            </Box>
            <Paper elevation={3} sx={{
              height: '500px',
              overflow: 'hidden',
              position: 'relative',
              borderRadius: 0,
              '& .leaflet-container': {
                height: '100%',
                borderRadius: 0
              }
            }}>
              <ArenaMap />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper>
              <ArenaList />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper>
              <DistanceCalculator />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <StadiumSearch />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <AttendanceChart />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App; 