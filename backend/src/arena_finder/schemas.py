from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ArenaBase(BaseModel):
    name: str
    full_address: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    arena_type: str
    city: str
    state: str
    zip_code: Optional[str] = None
    capacity: Optional[int] = Field(None, ge=0)
    average_attendance: Optional[float] = Field(None, ge=0)

class ArenaCreate(ArenaBase):
    pass

class ArenaResponse(ArenaBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class DistanceResponse(BaseModel):
    arena1_name: str
    arena2_name: str
    distance_miles: float
    distance_km: float

class AttendanceStats(BaseModel):
    arena_name: str
    average_attendance: float
    capacity: int
    utilization_percentage: float 