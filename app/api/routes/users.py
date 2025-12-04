from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.crud.user import (
    create_user,
    get_users,
    get_user,
    delete_user,
    update_user,
    get_user_by_email,
)
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.core.roles import require_admin

router = APIRouter()


# -------------------------
# ✅ ADMIN ROUTE FIRST!
# -------------------------
@router.get(
    "/admin-list",
    response_model=list[UserRead],
    summary="Admin only: list all users",
    tags=["admin"],
    openapi_extra={
        "security": [{"BearerAuth": []}]
    }
)
def admin_list_users(
    db: Session = Depends(get_db),
    current_user = Security(require_admin)
):
    return get_users(db)



# -------------------------
# Standard CRUD routes
# -------------------------

@router.post("/", response_model=UserRead)
def create(user: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db, user)


@router.get("/", response_model=list[UserRead])
def read_users(db: Session = Depends(get_db)):
    return get_users(db)


@router.get("/by-email", response_model=UserRead)
def read_user_by_email(email: str, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ❗ THIS MUST COME AFTER ADMIN ROUTE
@router.get("/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.put("/{user_id}", response_model=UserRead)
def update(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    data = user.dict(exclude_unset=True)
    updated = update_user(db, user_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated


@router.delete("/{user_id}")
def delete(user_id: int, db: Session = Depends(get_db)):
    deleted = delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
