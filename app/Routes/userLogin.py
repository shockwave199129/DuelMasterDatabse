from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any, List
from datetime import timedelta

from ..Database.db import Base, engine, Session
from ..Database.models import User
from .cardSearch import get_db
from ..Database import schemas
from .Core import security

router = APIRouter()


@router.post("/register")
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    db_obj = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        user_name=user_in.user_name
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@router.post("/login")
def login_access_token(
    *,
    db: Session = Depends(get_db), user_login: schemas.UserLoging
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(User).filter(User.email == user_login.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    if not security.verify_password(user_login.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    access_token_expires = timedelta(
        minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
