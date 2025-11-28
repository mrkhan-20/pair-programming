# app/routers/rooms.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import repo, schemas
from ..deps import get_db

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.post("", response_model=schemas.RoomCreateResponse)
def create_room(db: Session = Depends(get_db)):
    room = repo.create_room(db)
    return schemas.RoomCreateResponse(roomId=room.id)
