#!/usr/bin/env bash

# Wait for database to start
python /code/app/Database/db.py wait_for_db

#
cd app

# Run migrations
alembic upgrade head

# Start the app
exec "$@"