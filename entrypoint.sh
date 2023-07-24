#!/bin/sh

# Wait for the database container to start
#while [! nc -z dm_db 3306]
#do
#  echo "Waiting for the database container to start..."
#  sleep 1
#done

# Wait for database to start
python /code/app/Database/db.py wait_for_db

# Change directory to the app folder
#cd app

# Run migrations
alembic -c /code/app/alembic.ini upgrade head

# Start the app
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload