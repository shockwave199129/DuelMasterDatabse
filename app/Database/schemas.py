from pydantic import BaseModel, EmailStr
from typing import Optional, List

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

class DeckDetailsBuild(BaseModel):
    deck_card_id: int
    deck_card_count: int

class DeckBuild(BaseModel):
    deck_name: str
    deck_info: str
    deck_data: List[DeckDetailsBuild]
    is_private: bool
    is_complete: bool

class SimplifiedDeckDetails(BaseModel):
    deck_card_count: int
    deck_card_id: int

class SimplifiedDeckResponse(BaseModel):
    deck_name: str
    deck_info: str
    user_id: int
    user_info: str
    is_editable: bool
    is_complete: bool
    id: int
    is_private: bool
    deck_details: List[SimplifiedDeckDetails]