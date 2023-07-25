from fastapi import APIRouter, Body, Depends, HTTPException
from typing import Union, Optional
from sqlalchemy import distinct
from sqlalchemy.sql import func

from ..Database.db import Base, engine, Session
from ..Database.models import Card, Category, DMSets
from ..enumType import get_race_enum, get_manacost_enum, get_cardtype_enum, get_categories_enum, CivilizationEnum
from .cardSearch import get_db

router = APIRouter()

@router.get("/get-civilization")
async def get_civilization_list():
    civi_dict = {c.name: c.value for c in CivilizationEnum.__members__.values()}
    return civi_dict

@router.get("/get-race")
async def get_race_list():
    race_dict = {c.name: c.value for c in get_race_enum().__members__.values()}
    return race_dict

@router.get("/get-manacost")
async def get_manacost_list():
    race_dict = {c.name: c.value for c in get_manacost_enum().__members__.values()}
    return race_dict

@router.get("/get-cardtype")
async def get_cardtype_list():
    race_dict = {c.name: c.value for c in get_cardtype_enum().__members__.values()}
    return race_dict

@router.get("/get-category")
async def get_category_list():
    race_dict = {c.name: c.value for c in get_categories_enum().__members__.values()}
    return race_dict

@router.get("/get-set")
async def get_sets_list(db: Session = Depends(get_db)):
    cat_enum_values = []
    temp_data = set()
    categories = db.query(distinct(DMSets.set)).all()
    for cat in categories:
        temp_data.add(''.join(cat))
    cat_enum_values = list(temp_data)
    cat_enum_values.sort()
    dict_ = {i.upper(): i for i in cat_enum_values}
    return dict_

@router.get("/card-search")
async def get_search_card(db: Session = Depends(get_db),
    name: Optional[str] = None,
    civilization: Optional[str] = None,
    race: Optional[str] = None,
    cost: Optional[str] = None,
    text: Optional[str] = None,
    cardtype: Optional[str] = None,
    category: Optional[str] = None,
    ocg_set: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = "asc"
    ):

    query = db.query(Card, Category.categories, func.group_concat(DMSets.set, ',').label('sets'))\
            .join(Category, Card.link == Category.link)\
            .join(DMSets, DMSets.card_link == Card.link)\
            .group_by(Card.link,Card.id,Category.categories)

    if name:
        query = query.filter(Card.name.like(f"%{name}%"))
    if civilization:
        query = query.filter(Card.civilization.like(f"%{civilization}%"))
    if race:
        query = query.filter(Card.race.like(f"%\"{race}\"%"))
    if cost:
        query = query.filter(Card.manacost.like(f"%{cost}%"))
    if text:
        query = query.filter(Card.englishtext.like(f"%{text}%"))
    if cardtype:
        query = query.filter(Card.cardtype.like(f"%{cardtype}%"))
    if category:
        query = query.filter(Category.categories.like(f"%{category}%"))
    if ocg_set:
        query = query.filter(DMSets.set.like(f"%{ocg_set}%"))

    # routerly sorting if specified
    if sort_by:
        sort_column = getattr(Card, sort_by, None)
        if sort_column:
            sort_order_attr = getattr(sort_column, sort_order, None)
            if sort_order_attr:
                sort_func = sort_column.asc() if sort_order == "asc" else sort_column.desc()
                query = query.order_by(sort_func)
            else:
                raise HTTPException(status_code=400, detail=f"Invalid sort order: {sort_order}")
        else:
            raise HTTPException(status_code=400, detail=f"Invalid sort column: {sort_by}")

    # Convert the result to a list of dictionaries
    result = [row._asdict() for row in query.all()]
    return result

@router.get("/card-details/{card_id}")
async def get_one_card_details(card_id: int,
    db: Session = Depends(get_db)):

    query = db.query(Card, Category.categories, DMSets.set)\
            .join(Category, Card.link == Category.link)\
            .join(DMSets, DMSets.card_link == Card.link)
    
    query = query.filter(Card.id == card_id)

    return query.first()