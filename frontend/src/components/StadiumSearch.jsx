import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Autocomplete
} from '@mui/material';

const StadiumSearch = () => {
  const [arenas, setArenas] = useState([]);
  const [selectedArena, setSelectedArena] = useState(null);

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

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Stadium Address Lookup
      </Typography>
      
      <Autocomplete
        options={arenas}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => setSelectedArena(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Stadium"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
        )}
        getOptionKey={(option) => option.id}
      />

      {selectedArena && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableBody>
              <TableRow key={`name-${selectedArena.id}`}>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell>{selectedArena.name}</TableCell>
              </TableRow>
              <TableRow key={`address-${selectedArena.id}`}>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Address</TableCell>
                <TableCell>{selectedArena.full_address}</TableCell>
              </TableRow>
              <TableRow key={`zip-${selectedArena.id}`}>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>ZIP Code</TableCell>
                <TableCell>{selectedArena.zip_code || 'N/A'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>City</TableCell>
                <TableCell>{selectedArena.city}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>State</TableCell>
                <TableCell>{selectedArena.state}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Latitude</TableCell>
                <TableCell>{selectedArena.latitude.toFixed(6)}°</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" sx={{ fontWeight: 'bold' }}>Longitude</TableCell>
                <TableCell>{selectedArena.longitude.toFixed(6)}°</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default StadiumSearch; 