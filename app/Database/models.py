from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from .db import Base, engine

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

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "image": self.image,
            "civilization": self.civilization,
            "cardtype": self.cardtype,
            "manacost": self.manacost,
            "race": self.race,
            "power": self.power,
            "englishtext": self.englishtext,
            "subtype": self.subtype,
            "mananumber": self.mananumber,
            "link": self.link            
        }

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    categories = Column(String)
    link = Column(String, ForeignKey(Card.link))

    def to_dict(self):
        return self.categories

class DMSets(Base):
    __tablename__ = "sets"

    id = Column(Integer, primary_key=True, index=True)
    set = Column(String)
    set_link = Column(String)
    card_link = Column(String, ForeignKey(Card.link))

class CrawlerTask(Base):
    __tablename__ = "crawler_task"

    id = Column(Integer, primary_key=True, index=True)
    task_name = Column(String)
    status = Column(String)
    massage = Column(String)
    start_at = Column(DateTime)
    end_at = Column(DateTime)

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)

class Deck(Base):
    __tablename__ = "deck"

    id = Column(Integer, primary_key=True, index=True)
    deck_name = Column(String)
    deck_info = Column(String)
    user_id = Column(Integer, ForeignKey(User.id))
    is_private = Column(Boolean)
    is_complete = Column(Boolean)

    deck_details = relationship("DeckDetails", backref="deck", lazy="joined")
    user_details = relationship("User", backref="deck", lazy="joined")

class DeckDetails(Base):
    __tablename__ = "deck_details"

    id = Column(Integer, primary_key=True, index=True)
    deck_id = Column(Integer, ForeignKey(Deck.id))
    deck_card_id = Column(Integer, ForeignKey(Card.id))
    deck_card_count = Column(Integer)
    zone = Column(Integer)

    deck_card_details = relationship("Card", lazy="joined")

class Zones(Base):
    __tablename__ = "duel_master_zone"

    id = Column(Integer, primary_key=True, index=True)
    zone_name = Column(String)
    card_type_like = Column(Text)
    type_regex = Column(String)


class DmRules(Base):
    __tablename__ = 'duel_master_rule'

    id = Column(Integer, primary_key=True, index=True)
    head = Column(Text)
    section = Column(Text)
    content = Column(Text)
