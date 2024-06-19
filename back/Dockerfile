FROM python:3.9.16-slim-bullseye

ARG APP_FOLDER=/app


ENV PYTHONPATH="${APP_FOLDER}" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TZ=Europe/Moscow


WORKDIR /app

COPY requirements.txt requirements.txt

RUN apt update &&  apt clean && rm -rf /var/lib/apt/lists/*  && pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .
