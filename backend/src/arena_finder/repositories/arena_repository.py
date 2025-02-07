from sqlalchemy.orm import Session
from ..models.database import ArenaDB
from ..schemas import ArenaCreate
from typing import List, Optional

class ArenaRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[ArenaDB]:
        return self.db.query(ArenaDB).all()

    def get_by_id(self, arena_id: int) -> Optional[ArenaDB]:
        return self.db.query(ArenaDB).filter(ArenaDB.id == arena_id).first()

    def create(self, arena: ArenaCreate) -> ArenaDB:
        db_arena = ArenaDB(**arena.dict())
        self.db.add(db_arena)
        self.db.commit()
        self.db.refresh(db_arena)
        return db_arena

    def get_by_state(self, state: str) -> List[ArenaDB]:
        return self.db.query(ArenaDB).filter(ArenaDB.state == state).all()

    def get_attendance_stats(self) -> List[dict]:
        return self.db.query(
            ArenaDB.name,
            ArenaDB.average_attendance,
            ArenaDB.capacity
        ).all() 