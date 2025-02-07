import React from 'react';
import { render, screen } from '@testing-library/react';
import ArenaMap from '../ArenaMap';
import { arenaService } from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

describe('ArenaMap', () => {
    it('renders loading state initially', () => {
        render(<ArenaMap />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('renders markers when data is loaded', async () => {
        const mockArenas = [
            { id: 1, name: 'Test Arena', latitude: 40, longitude: -73 }
        ];
        
        arenaService.getAllArenas.mockResolvedValue(mockArenas);
        
        render(<ArenaMap />);
        // Add assertions for map rendering
    });
}); 