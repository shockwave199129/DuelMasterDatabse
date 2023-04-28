import uvicorn
from typing import Union, Optional
from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi_utils.tasks import repeat_every
from .Database.db import Base, engine, Session
from .Database.models import Card, Category
from .enumType import get_race_enum, get_manacost_enum, get_cardtype_enum, get_categories_enum
from .Crawler.setCrawler import run_set_crawler
from enum import Enum
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from threading import Thread


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

@app.get("/cards/")
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

@app.get("/run-task/")
async def run_task(background_task: BackgroundTasks):
    def run_task_in_background():
        # Run the background task
        run_set_crawler()
    
    # Start the task in a new thread
    thread = Thread(target=run_task_in_background)
    thread.start()
    return {"message": "Background task added to the scheduler"}

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
