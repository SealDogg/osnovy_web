from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.db.session import get_session
from app.models.song import Song

router = APIRouter()

@router.get("/songs", response_model=List[Song])
def get_songs(session: Session = Depends(get_session)):
    return session.exec(select(Song)).all()

@router.get("/songs/{song_id}", response_model=Song)
def get_song(song_id: int, session: Session = Depends(get_session)):
    song = session.get(Song, song_id)
    if not song: raise HTTPException(404, "Песня не найдена")
    return song


@router.post("/songs", response_model=Song)
def create_song(song: Song, session: Session = Depends(get_session)):
    session.add(song)
    session.commit()
    session.refresh(song)
    return song

@router.delete("/songs/{song_id}", status_code=204)
def delete_song(song_id: int, session: Session = Depends(get_session)):
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Песня не найдена")
    session.delete(song)
    session.commit()
    return