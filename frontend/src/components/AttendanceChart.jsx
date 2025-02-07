import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from './LoadingSpinner';
import { getAttendanceComparison } from '../services/api';

const AttendanceChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArena, setSelectedArena] = useState('all');
    const [allArenas, setAllArenas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/analytics/attendance/comparison');
                const responseData = await response.json();
                
                // Store all arenas data
                setAllArenas(responseData);
                
                // Format data for the chart
                const formattedData = responseData.map(arena => ({
                    name: arena.arena_name.length > 20 
                        ? arena.arena_name.substring(0, 20) + '...' 
                        : arena.arena_name,
                    attendance: Math.round(arena.average_attendance),
                    capacity: arena.capacity,
                    utilization: Math.round(arena.utilization_percentage * 100)
                }));
                
                // Take top 15 arenas by capacity for better visualization
                setData(formattedData.slice(0, 15));
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleArenaChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedArena(selectedValue);

        if (selectedValue === 'all') {
            // Show top 15 arenas when 'All' is selected
            const formattedData = allArenas.map(arena => ({
                name: arena.arena_name.length > 20 
                    ? arena.arena_name.substring(0, 20) + '...' 
                    : arena.arena_name,
                attendance: Math.round(arena.average_attendance),
                capacity: arena.capacity,
                utilization: Math.round(arena.utilization_percentage * 100)
            }));
            setData(formattedData.slice(0, 15));
        } else {
            // Show only selected arena
            const selectedData = allArenas.find(arena => arena.arena_name === selectedValue);
            if (selectedData) {
                setData([{
                    name: selectedData.arena_name,
                    attendance: Math.round(selectedData.average_attendance),
                    capacity: selectedData.capacity,
                    utilization: Math.round(selectedData.utilization_percentage * 100)
                }]);
            }
        }
    };

    if (loading) return <Box p={2}><Typography>Loading...</Typography></Box>;

    return (
        <Box sx={{ p: 2, height: '500px' }}>
            <Typography variant="h6" gutterBottom>
                Arena Attendance Statistics
            </Typography>
            <FormControl sx={{ mb: 2, minWidth: 200 }}>
                <InputLabel>Select Arena</InputLabel>
                <Select
                    value={selectedArena}
                    onChange={handleArenaChange}
                    label="Select Arena"
                >
                    <MenuItem value="all">All Arenas (Top 15)</MenuItem>
                    {allArenas.map(arena => (
                        <MenuItem key={arena.arena_name} value={arena.arena_name}>
                            {arena.arena_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            
            <ResponsiveContainer width="100%" height="80%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 100  // Increased bottom margin for labels
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        interval={0}
                        tick={({ x, y, payload }) => (
                            <g transform={`translate(${x},${y})`}>
                                <text
                                    x={0}
                                    y={20}
                                    dy={0}
                                    textAnchor="end"
                                    fill="#666"
                                    transform="rotate(-45)"
                                    style={{ fontSize: '12px' }}
                                >
                                    {payload.value}
                                </text>
                            </g>
                        )}
                    />
                    <YAxis
                        tickFormatter={(value) => new Intl.NumberFormat().format(value)}
                    />
                    <Tooltip
                        formatter={(value) => new Intl.NumberFormat().format(value)}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        wrapperStyle={{
                            paddingTop: "20px"
                        }}
                    />
                    <Bar
                        name="Average Attendance"
                        dataKey="attendance"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        name="Capacity"
                        dataKey="capacity"
                        fill="#82ca9d"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default AttendanceChart; 