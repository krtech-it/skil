from minio import Minio

from app.core.config import settings


minio_client = Minio(
    settings.MINIO_URL,
    access_key=settings.MINIO_ACCESS,
    secret_key=settings.MINIO_SECRET,
    secure=False  # или True, если используется HTTPS
)