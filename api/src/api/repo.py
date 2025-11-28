# app/crud.py
from sqlalchemy.orm import Session
from . import models

def create_room(db: Session) -> models.Room:
    room = models.Room()
    db.add(room)
    db.commit()
    db.refresh(room)
    return room

def get_room(db: Session, room_id: str) -> models.Room | None:
    return db.query(models.Room).filter(models.Room.id == room_id).first()

def update_room_code(db: Session, room_id: str, code: str) -> None:
    room = get_room(db, room_id)
    if not room:
        return
    room.code = code
    db.add(room)
    db.commit()
