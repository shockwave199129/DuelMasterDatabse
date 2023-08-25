from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import create_database, database_exists
import os

env = os.environ.get("SESSIONNAME", 'docker')
# configure database settings
if env == 'Console':
    SQLALCHEMY_DATABASE_URL = "mysql://root:12345@127.0.0.1:3306/duel_masters"
else:
    SQLALCHEMY_DATABASE_URL = "mysql://root:12345@dm_db:3306/duel_masters"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

if not database_exists(engine.url):
    create_database(engine.url)

# create session factory
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# base class for declarative models
Base = declarative_base()

Base.metadata.bind = engine
