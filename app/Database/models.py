from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .db import Base, engine


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    categories = Column(String)
    link = Column(String, unique=True)

class Card(Base):
    __tablename__ = "cardDataBase"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    image = Column(String)
    civilization = Column(String)
    cardtype = Column(String)
    manacost = Column(String)
    race = Column(String)
    power = Column(String)
    englishtext = Column(String)
    subtype = Column(String)
    mananumber = Column(Integer, default=0)
    link = Column(String)

class DMSets(Base):
    __tablename__ = "sets"

    id = Column(Integer, primary_key=True, index=True)
    set = Column(String)
    set_link = Column(String)
    card_link = Column(String)

class CrawlerTask(Base):
    __tablename__ = "crawler_task"

    id = Column(Integer, primary_key=True, index=True)
    task_name = Column(String)
    status = Column(String)
    massage = Column(String)
    start_at = Column(DateTime)
    end_at = Column(DateTime)
