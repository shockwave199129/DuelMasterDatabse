from pydantic import BaseModel, EmailStr
from typing import Optional

# Properties to receive via API on creation
class UserCreate(BaseModel):
    user_name: str
    email: EmailStr
    password: str

class UserLoging(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    user_name: str
    email: str
    is_active: bool