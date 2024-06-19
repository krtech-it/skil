import uuid
from datetime import datetime
from typing import Union, List

from pydantic import BaseModel


class TopicOut(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    lessons: Union[List[dict]] = None
    traits: Union[List[dict]] = None


class LessonOut(BaseModel):
    id: uuid.UUID
    code: str
    title: str
    content: str
    author: str
    traits: Union[List[dict]] = []


class DetailTopicOut(BaseModel):
    status: str
    id: uuid.UUID
    title: str
    lessons: Union[List[LessonOut], List[dict]] = None
