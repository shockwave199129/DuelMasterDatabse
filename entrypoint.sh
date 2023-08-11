# entrypoint.sh
#!/bin/sh

# Wait for the database container to start
while ! nc -z '127.0.0.1' 3306; do
    sleep 1
done

# Wait for database to start
#until python -c "import socket; sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM); result = sock.connect_ex(('127.0.0.1', 3306)); exit(result)"

# Change directory to the app folder
#cd app

# Run migrations
alembic -c app/alembic.ini upgrade head

# Start the app
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload