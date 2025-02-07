from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...arena_finder.database import get_db
from ...arena_finder.repositories.arena_repository import ArenaRepository
from ...arena_finder.schemas import ArenaResponse, DistanceResponse
from geopy.distance import geodesic

router = APIRouter()

@router.get("/", response_model=List[ArenaResponse])
async def get_all_arenas(db: Session = Depends(get_db)):
    repo = ArenaRepository(db)
    return repo.get_all()

@router.get("/{arena_id}", response_model=ArenaResponse)
async def get_arena(arena_id: int, db: Session = Depends(get_db)):
    repo = ArenaRepository(db)
    arena = repo.get_by_id(arena_id)
    if arena is None:
        raise HTTPException(status_code=404, detail="Arena not found")
    return arena

@router.get("/state/{state_code}", response_model=List[ArenaResponse])
async def get_arenas_by_state(state_code: str, db: Session = Depends(get_db)):
    repo = ArenaRepository(db)
    return repo.get_by_state(state_code.upper())

@router.get("/distance/{arena1_id}/{arena2_id}", response_model=DistanceResponse)
async def get_distance_between_arenas(
    arena1_id: int, 
    arena2_id: int, 
    db: Session = Depends(get_db)
):
    repo = ArenaRepository(db)
    arena1 = repo.get_by_id(arena1_id)
    arena2 = repo.get_by_id(arena2_id)
    
    if not arena1 or not arena2:
        raise HTTPException(status_code=404, detail="One or both arenas not found")
    
    distance = geodesic(
        (arena1.latitude, arena1.longitude),
        (arena2.latitude, arena2.longitude)
    )
    
    return {
        "arena1_name": arena1.name,
        "arena2_name": arena2.name,
        "distance_miles": round(distance.miles, 2),
        "distance_km": round(distance.kilometers, 2)
    } 