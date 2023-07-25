from pydantic import BaseModel, EmailStr


# Properties to receive via API on creation
class UserCreate(BaseModel):
    user_name: str
    email: EmailStr
    password: str

class UserLoging(BaseModel):
    email: EmailStr
    password: str