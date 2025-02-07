import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
});

export const useArenas = async () => {
  const { data } = await api.get('/arenas');
  return data;
};

export const getDistance = async (arena1Id, arena2Id) => {
  const { data } = await api.get(`/arenas/distance/${arena1Id}/${arena2Id}`);
  return data;
};

export const getAttendanceComparison = async (arenaIds) => {
  const { data } = await api.get('/analytics/attendance/comparison', {
    params: { arena_ids: arenaIds }
  });
  return data;
}; 