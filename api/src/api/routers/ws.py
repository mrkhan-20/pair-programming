# app/routers/ws.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, List

from ..deps import get_db
from .. import repo

router = APIRouter(tags=["ws"])

class ConnectionManager:
    def __init__(self):
        # room_id -> list of websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.room_code_cache: Dict[str, str] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]

    async def broadcast(self, room_id: str, message: dict, exclude: WebSocket | None = None):
        for conn in self.active_connections.get(room_id, []):
            if conn is exclude:
                continue
            await conn.send_json(message)

manager = ConnectionManager()

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, db: Session = Depends(get_db)):
    room = repo.get_room(db, room_id)
    if not room:
        await websocket.close(code=4001)
        return

    await manager.connect(room_id, websocket)
    # After manager.connect(...)
    await manager.broadcast(room_id, {"type": "members", "count": len(manager.active_connections[room_id])})


    # Send current code state to newly connected client
    code = manager.room_code_cache.get(room_id, room.code or "")
    await websocket.send_json({"type": "init", "code": code})

    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "code_update":
                code = data.get("code", "")
                # Update in-memory cache
                manager.room_code_cache[room_id] = code
                # Persist to DB (simplest: on every change)
                repo.update_room_code(db, room_id, code)
                # Broadcast to others
                await manager.broadcast(
                    room_id,
                    {"type": "code_update", "code": code},
                    exclude=websocket,
                )
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
        await manager.broadcast(room_id, {"type": "members", "count": len(manager.active_connections.get(room_id, []))})

