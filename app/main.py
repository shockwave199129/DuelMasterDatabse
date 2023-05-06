import uvicorn
from typing import Union, Optional
from fastapi import FastAPI, Depends, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utils.tasks import repeat_every
from .Database.db import Base, engine, Session
from .Database.models import Card, Category, DMSets
from .enumType import get_race_enum, get_manacost_enum, get_cardtype_enum, get_categories_enum
from .Crawler.setCrawler import run_set_crawler
from enum import Enum
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from threading import Thread
from sqlalchemy import distinct
from sqlalchemy.sql import func
import json


class CivilizationEnum(str, Enum):
    LIGHT = "Light"
    WATER = "Water"
    DARKNESS = "Darkness"
    FIRE = "Fire"
    NATURE = "Nature"
    ZERO = "Zero"
    COLORLESS = "Colorless"

app = FastAPI()
#background_task = BackgroundTasks()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# run crawler
scheduler = BackgroundScheduler()
scheduler.add_job(run_set_crawler, CronTrigger(day='1', hour='0', minute='0'))
scheduler.start()

# dependency to get db session
def get_db():
    db = None
    try:
        db = Session()
        yield db
    finally:
        db.close()

@app.get("/")
async def read_root():
    return {"Hello": "World"}


""" @app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q} """

@app.get("/cards/", tags=["for backend"])
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

@app.get("/run-task/", tags=["for backend"])
async def run_task(background_task: BackgroundTasks):
    def run_task_in_background():
        # Run the background task
        run_set_crawler()
    
    # Start the task in a new thread
    thread = Thread(target=run_task_in_background)
    thread.start()
    return {"message": "Background task added to the scheduler"}

@app.get("/get-civilization", tags=["for web"])
async def get_civilization_list():
    civi_dict = {c.name: c.value for c in CivilizationEnum.__members__.values()}
    return civi_dict

@app.get("/get-race", tags=["for web"])
async def get_race_list():
    race_dict = {c.name: c.value for c in get_race_enum().__members__.values()}
    return race_dict

@app.get("/get-manacost", tags=["for web"])
async def get_manacost_list():
    race_dict = {c.name: c.value for c in get_manacost_enum().__members__.values()}
    return race_dict

@app.get("/get-cardtype", tags=["for web"])
async def get_cardtype_list():
    race_dict = {c.name: c.value for c in get_cardtype_enum().__members__.values()}
    return race_dict

@app.get("/get-category", tags=["for web"])
async def get_category_list():
    race_dict = {c.name: c.value for c in get_categories_enum().__members__.values()}
    return race_dict

@app.get("/get-set", tags=["for web"])
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

@app.get("/card-search", tags=["for web"])
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

    # Apply sorting if specified
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

@app.get("/card-details/{card_id}", tags=["for web"])
async def get_one_card_details(card_id: int,
    db: Session = Depends(get_db)):

    query = db.query(Card, Category.categories, DMSets.set)\
            .join(Category, Card.link == Category.link)\
            .join(DMSets, DMSets.card_link == Card.link)
    
    query = query.filter(Card.id == card_id)

    return query.first()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
