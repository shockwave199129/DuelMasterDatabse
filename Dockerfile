FROM python:3.9

# 
RUN mkdir /code
WORKDIR /code

# set env variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH "/code"

# 
COPY ./requirements.txt /code/requirements.txt

#
RUN apt-get update && apt-get install -y iputils-ping apt-utils

#
RUN python3 -m pip install --upgrade pip

# 
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 
COPY ./app /code/app

#
COPY ./entrypoint.sh /code/entrypoint.sh
RUN chmod +x /code/entrypoint.sh

ENTRYPOINT ["/bin/sh", "/code/entrypoint.sh"]

# 
#CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]