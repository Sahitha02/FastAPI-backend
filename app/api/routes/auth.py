from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi import Security

from app.core.config import settings
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
)
from app.db.deps import get_db
from app.schemas.auth import Token, LoginRequest, SignupRequest
from app.schemas.user import UserRead
from app.crud.user import get_user_by_email, create_user, get_user
from app.schemas.user import UserCreate

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


@router.post("/signup", response_model=UserRead)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    user_data = {
        "full_name": payload.full_name,
        "email": payload.email,
        "phone": payload.phone,
        "password_hash": get_password_hash(payload.password),  # <--- only raw password here
        "role":"user"
    }

    user = create_user(db, user_data)
    return user

@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token)


# Dependency to get current user from JWT
from fastapi import Security
from jose import JWTError, jwt
from app.schemas.auth import TokenData


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user(db, int(sub))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


@router.get(
    "/me",
    response_model=UserRead,
    summary="Get current user (requires authentication)",
    tags=["auth"],
    openapi_extra={
        "security": [{"BearerAuth": []}]
    }
)
def read_me(current_user = Security(get_current_user)):
    return current_user
