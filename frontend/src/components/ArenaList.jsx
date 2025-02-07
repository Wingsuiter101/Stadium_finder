import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Box,
    Typography,
    tableCellClasses,
    TablePagination
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
        fontWeight: 600,
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
        }
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: alpha(theme.palette.action.hover, 0.05),
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.action.selected, 0.2),
        cursor: 'pointer',
        transform: 'translateX(6px)',
        transition: 'all 0.2s ease',
        '& td, & th': {
            color: theme.palette.primary.light,
        }
    },
    transition: 'all 0.2s ease',
}));

const ArenaList = () => {
    const [arenas, setArenas] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredArenas = arenas.filter(arena =>
        arena.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        arena.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        arena.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get current page of arenas
    const currentArenas = filteredArenas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ 
            p: 2,
            maxWidth: '100%',  // Constrain to parent width
            margin: '0 auto'   // Center in container
        }}>
            <Typography variant="h6" gutterBottom>
                Arena List
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search Arenas"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Box sx={{ 
                width: '100%',
                overflow: 'hidden',
                borderRadius: 1,
                bgcolor: 'background.paper'
            }}>
                <TableContainer sx={{ 
                    maxHeight: 440,
                    width: '100%',      // Force full width
                    overflowX: 'auto',  // Enable horizontal scroll
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px'
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(255, 255, 255, 0.05)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: theme => theme.palette.primary.main,
                        borderRadius: '4px',
                    },
                }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>City</StyledTableCell>
                                <StyledTableCell>State</StyledTableCell>
                                <StyledTableCell>ZIP Code</StyledTableCell>
                                <StyledTableCell align="right">Capacity</StyledTableCell>
                                <StyledTableCell align="right">Avg. Attendance</StyledTableCell>
                                <StyledTableCell align="right">Utilization</StyledTableCell>
                                <StyledTableCell align="right">Latitude</StyledTableCell>
                                <StyledTableCell align="right">Longitude</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentArenas.map((arena) => (
                                <TableRow key={arena.id}>
                                    <TableCell>{arena.name}</TableCell>
                                    <TableCell>{arena.city}</TableCell>
                                    <TableCell>{arena.state}</TableCell>
                                    <TableCell>{arena.zip_code || 'N/A'}</TableCell>
                                    <TableCell align="right">{arena.capacity ? Number(arena.capacity).toLocaleString() : 'N/A'}</TableCell>
                                    <TableCell align="right">{arena.average_attendance ? Number(arena.average_attendance).toLocaleString() : 'N/A'}</TableCell>
                                    <TableCell align="right">
                                        {arena.capacity > 0 && arena.average_attendance > 0
                                            ? `${((arena.average_attendance / arena.capacity) * 100).toFixed(1)}%`
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell align="right">{arena.latitude.toFixed(4)}°</TableCell>
                                    <TableCell align="right">{arena.longitude.toFixed(4)}°</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={filteredArenas.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </Box>
    );
};

export default ArenaList; 