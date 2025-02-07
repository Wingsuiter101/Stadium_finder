import React, { useState, useEffect } from 'react';
import { 
  Select, 
  MenuItem, 
  Button, 
  Typography,
  Box 
} from '@mui/material';

function DistanceCalculator() {
  const [arena1, setArena1] = useState('');
  const [arena2, setArena2] = useState('');
  const [distance, setDistance] = useState(null);
  const [arenas, setArenas] = useState([]);

  useEffect(() => {
    const fetchArenas = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/arenas');
        const data = await response.json();
        setArenas(data);
      } catch (error) {
        console.error('Error fetching arenas:', error);
      }
    };
    fetchArenas();
  }, []);

  const calculateDistance = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/arenas/distance/${arena1}/${arena2}`);
      const data = await response.json();
      setDistance(data.distance_miles);
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Calculate Distance</Typography>
      <Box mb={2}>
        <Select
          value={arena1}
          onChange={(e) => setArena1(e.target.value)}
          fullWidth
          displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem value="">Select First Arena</MenuItem>
          {arenas.map((arena) => (
            <MenuItem key={arena.id} value={arena.id}>
              {arena.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box mb={2}>
        <Select
          value={arena2}
          onChange={(e) => setArena2(e.target.value)}
          fullWidth
          displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem value="">Select Second Arena</MenuItem>
          {arenas.map((arena) => (
            <MenuItem key={arena.id} value={arena.id}>
              {arena.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Button 
        variant="contained" 
        onClick={calculateDistance}
        disabled={!arena1 || !arena2}
      >
        Calculate Distance
      </Button>
      {distance && (
        <Typography sx={{ mt: 2 }}>
          Distance: {distance} miles
        </Typography>
      )}
    </Box>
  );
}

export default DistanceCalculator; 