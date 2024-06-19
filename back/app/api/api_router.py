from fastapi import APIRouter

from app.api.endpoints import auth, topics, tasks, lessons, trait, add_json

b3_router = APIRouter()
b3_router.include_router(auth.router, prefix="/auth", tags=["auth"])
b3_router.include_router(topics.router, prefix="/topic", tags=["topics"])
b3_router.include_router(tasks.router, prefix="/task", tags=["tasks"])
b3_router.include_router(lessons.router, prefix="/lesson", tags=["lessons"])
b3_router.include_router(trait.router, prefix="/trait", tags=["traits"])
b3_router.include_router(add_json.router, prefix="/add_file", tags=["add_file"])
