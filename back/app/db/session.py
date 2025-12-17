from sqlmodel import create_engine, Session, SQLModel

DATABASE_URL = "sqlite:///./songs.db"
engine = create_engine(DATABASE_URL, echo=True)  # echo=True покажет SQL

def create_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
