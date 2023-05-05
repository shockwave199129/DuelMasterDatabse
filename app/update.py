import sys
import os

from app.Database.db import Session, Base, engine
from app.Database.models import Card, Category, CrawlerTask, DMSets
import sqlalchemy
from sqlalchemy import distinct


db = Session()
card_data = db.query(Card).filter(Card.link.like("('%")).all()
for sql in card_data:
    sql.link = sql.link[2:-3]
    db.commit()
print('card data updated')


cate = db.query(Category).filter(Category.link.like("('%")).all()
for cat in cate:
    cat.link = cat.link[2:-3]
    db.commit()

print('category data updated')