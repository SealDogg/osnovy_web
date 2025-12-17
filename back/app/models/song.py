from sqlmodel import SQLModel, Field
from sqlalchemy import Text
from typing import Optional, Text

class Song(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    artist: Optional[str] = None
    key: Optional[str] = None
    content: str 
    strum: Optional[str] = None
