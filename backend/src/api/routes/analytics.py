from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ...arena_finder.database import get_db
from ...arena_finder.models.database import ArenaDB
from ...arena_finder.schemas import AttendanceStats

router = APIRouter()

@router.get("/attendance/average")
async def get_average_attendance():
    # Implementation to calculate average attendance
    pass

@router.get("/attendance/comparison", response_model=List[AttendanceStats])
async def compare_arena_attendance(db: Session = Depends(get_db)):
    # Get all arenas with their attendance data
    arenas = db.query(ArenaDB).all()
    
    # Format the response
    stats = []
    for arena in arenas:
        if arena.capacity > 0:  # Only include arenas with valid capacity
            utilization = (arena.average_attendance / arena.capacity) if arena.capacity > 0 else 0
            stats.append(AttendanceStats(
                arena_name=arena.name,
                average_attendance=arena.average_attendance,
                capacity=arena.capacity,
                utilization_percentage=utilization
            ))
    
    # Sort by capacity for better visualization
    stats.sort(key=lambda x: x.capacity, reverse=True)
    
    return stats 