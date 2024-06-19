import uuid
from datetime import datetime
from typing import Union, List, Optional
from fastapi import File, UploadFile

from pydantic import BaseModel


class TaskSendResult(BaseModel):
    comments: List[str]
    files: List[UploadFile] = File(...)


class StudentTaskOut(BaseModel):
    id: uuid.UUID
    title: str
    difficulty: int
    time: int
    start_date: datetime
    status: str
    grade: int
    inspector_id: Optional[uuid.UUID]
    inspector_fullname: Optional[str]
    user_id: uuid.UUID
    user_full_name: Optional[str] = None
    history_id: Optional[uuid.UUID] = None


class DetailTaskUser(BaseModel):
    id: uuid.UUID
    title: str
    difficulty: int
    time: int
    content: Optional[str]

    start_date: Optional[datetime] # last time
    status: Optional[str]
    grade: Optional[int]
    history_id: uuid.UUID
    lessons: List[dict]


class DetailTaskAdmin(BaseModel):
    id: uuid.UUID
    title: str
    difficulty: int
    time: int
    content: str
    lessons: List[dict]


class HistoryTaskOut(BaseModel):
    history_task_id: uuid.UUID
    start_date: datetime
    status: str
    grade: int
    inspector_id: Optional[uuid.UUID]
    inspector_fullname: Optional[str]
    user_id: uuid.UUID
    user_full_name: Optional[str] = None


class ReviewTask(BaseModel):
    history_id: Optional[uuid.UUID] = None
    images: List[dict]
    area: List[List]
    task_id: uuid.UUID
    task_name: str
    comment: List[str]
    grade: Optional[int]
    main_comment: Optional[str]

