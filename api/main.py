# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.db import Base, engine
from src.api.routers import rooms, autocomplete, ws

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Real-time Pair Programming")

origins = [
    "http://localhost:3000",  # React dev server
    # add prod origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(rooms.router)
app.include_router(autocomplete.router)
app.include_router(ws.router)
