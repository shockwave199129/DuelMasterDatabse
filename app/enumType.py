from .Database.db import Base, engine, Session
from .Database.models import Card, Category
from sqlalchemy import distinct
from enum import Enum
import json


# Dynamically create Enum based on distinct values in the 'race' column of 'cardDataBase' table
def get_race_enum(db = Session()):
    race_enum_values = []
    temp_data = set()
    races = db.query(distinct(Card.race)).all()

    for race in races:
        if race[0] is not None:
            for r in json.loads(race[0]):
                if len(r.strip()) > 0:
                    temp_data.add(r.strip())
    race_enum_values = list(temp_data)
    race_enum_values.sort()
    dict_ = {i.upper(): i for i in race_enum_values}

    return Enum('RaceEnum',dict_)

# Dynamically create Enum based on distinct values in the 'cost' column of 'cardDataBase' table
def get_manacost_enum(db = Session()):
    temp_data = set()
    manacost = db.query(distinct(Card.manacost)).all()
    for mana in manacost:
        for r in mana[0].split('/'):
            if len(r.strip()) > 0:
                temp_data.add(r.strip())
    cost_enum_values = list(temp_data)
    cost_enum_values.sort()
    dict_ = {i.upper(): i for i in cost_enum_values}

    return Enum('ManaCostEnum',dict_)

# Dynamically create Enum based on distinct values in the 'cardtype' column of 'cardDataBase' table
def get_cardtype_enum(db = Session()):
    cardtype_enum_values = []
    temp_data = set()
    card_types = db.query(distinct(Card.cardtype)).all()
    for card_type in card_types:
        for r in card_type[0].split('/'):
            if len(r.strip()) > 0:
                temp_data.add(r.strip())
    cardtype_enum_values = list(temp_data)
    cardtype_enum_values.sort()
    dict_ = {i.upper(): i for i in cardtype_enum_values}

    return Enum('CardTypeEnum',dict_)

# Dynamically create Enum based on distinct values in the 'categories' column of 'categories' table
def get_categories_enum(db = Session()):
    cat_enum_values = []
    temp_data = set()
    categories = db.query(distinct(Category.categories)).all()
    for cat in categories:
        if cat[0] is not None:
            for r in json.loads(cat[0]):
                if len(r.strip()) > 0:
                    temp_data.add(r.strip())
    cat_enum_values = list(temp_data)
    cat_enum_values.sort()
    dict_ = {i.upper(): i for i in cat_enum_values}

    return Enum('CategoryEnum',dict_)

class CivilizationEnum(str, Enum):
    LIGHT = "Light"
    WATER = "Water"
    DARKNESS = "Darkness"
    FIRE = "Fire"
    NATURE = "Nature"
    ZERO = "Zero"
    COLORLESS = "Colorless"
