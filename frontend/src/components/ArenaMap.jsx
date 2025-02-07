import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Typography } from '@mui/material';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ArenaMap = () => {
    const [arenas, setArenas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArenas = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/arenas');
                const data = await response.json();
                setArenas(data);
            } catch (error) {
                console.error('Error fetching arenas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArenas();
    }, []);

    if (loading) {
        return <Box p={3}>Loading map...</Box>;
    }

    return (
        <Box sx={{ height: '500px', width: '100%' }}>
            <MapContainer
                center={[39.8283, -98.5795]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                minZoom={3}
                maxBounds={[
                    [20, -140], // Southwest coordinates
                    [55, -50]   // Northeast coordinates
                ]}
                maxBoundsViscosity={1.0}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {arenas.map((arena) => (
                    <Marker
                        key={arena.id}
                        position={[arena.latitude, arena.longitude]}
                    >
                        <Popup>
                            <Typography variant="h6">{arena.name}</Typography>
                            <Typography variant="body1">
                                Location: {arena.city}, {arena.state}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                Latitude: {arena.latitude.toFixed(4)}°
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                Longitude: {arena.longitude.toFixed(4)}°
                            </Typography>
                            <Typography variant="body1">
                                Capacity: {arena.capacity ? Number(arena.capacity).toLocaleString() : 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                Avg. Attendance: {arena.average_attendance ? Number(arena.average_attendance).toLocaleString() : 'N/A'}
                            </Typography>
                            {arena.capacity > 0 && arena.average_attendance > 0 && (
                                <Typography variant="body1">
                                    Utilization: {((arena.average_attendance / arena.capacity) * 100).toFixed(1)}%
                                </Typography>
                            )}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </Box>
    );
};

export default ArenaMap; 