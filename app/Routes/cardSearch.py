from fastapi import APIRouter, Depends
from typing import Optional

from ..Database.db import Session
from ..Database.models import Card, Category
from ..enumType import get_race_enum, get_manacost_enum, get_cardtype_enum, get_categories_enum, CivilizationEnum

router = APIRouter()


def get_db():
    db = None
    try:
        db = Session()
        yield db
    finally:
        db.close()

@router.get("/cards/")
async def get_cards(db: Session = Depends(get_db),
    name: Optional[str] = None,
    civilization: Optional[CivilizationEnum] = None,
    race: Optional[get_race_enum()] = None,
    cost: Optional[get_manacost_enum()] = None,
    text: Optional[str] = None,
    cardtype: Optional[get_cardtype_enum()] = None,
    category: Optional[get_categories_enum()] = None
    ):

    query = db.query(Card,Category.categories).join(Category, Card.link == Category.link)

    if name:
        query = query.filter(Card.name.like(f"%{name}%"))
    if civilization:
        query = query.filter(Card.civilization.like(f"%{civilization.value}%"))
    if race:
        query = query.filter(Card.race.like(f"%\"{race.value}\"%"))
    if cost:
        query = query.filter(Card.manacost.like(f"%{cost.value}%"))
    if text:
        query = query.filter(Card.englishtext.like(f"%{text}%"))
    if cardtype:
        query = query.filter(Card.cardtype.like(f"%{cardtype.value}%"))
    if category:
        query = query.filter(Category.categories.like(f"%{category.value}%"))

    # Convert the result to a list of dictionaries
    result = [row._asdict() for row in query.all()]
    return result