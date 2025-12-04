from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "NavRoutes API"

    DATABASE_URL: str = "postgresql+psycopg2://postgres:487755@localhost:5433/navroutes"

    SECRET_KEY: str = "supersecretkey-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

settings = Settings()







