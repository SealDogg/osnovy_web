from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import create_tables, get_session
from app.api.v1.songs import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.on_event("startup")
def startup():
    create_tables()  # ← Создает таблицы!

@app.get("/")
def root(): return {"message": "OK"}
