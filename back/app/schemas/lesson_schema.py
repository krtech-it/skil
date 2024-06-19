import uuid
from datetime import datetime
from typing import Union, List, Optional

from pydantic import BaseModel


class DetailTrait(BaseModel):
    id: uuid.UUID
    code: str
    name: str
    description: str


class Supplement(BaseModel):
    title: str
    link: str


class DetailTask(BaseModel):
    id: uuid.UUID
    title: str


class DetailLessonOut(BaseModel):
    id: uuid.UUID
    title: str
    content: str
    author: str
    traits: Union[List[DetailTrait], list] = []
    supplements: Union[List[Supplement], list] = []
    tasks: Union[List[DetailTask], list] = []


