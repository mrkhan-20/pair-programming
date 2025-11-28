# app/models.py
from sqlalchemy import Column, String, Text
from .db import Base
import uuid

def generate_room_id():
    return uuid.uuid4().hex[:8]

class Room(Base):
    __tablename__ = "rooms"

    id = Column(String, primary_key=True, default=generate_room_id)
    code = Column(Text, nullable=False, default="")
