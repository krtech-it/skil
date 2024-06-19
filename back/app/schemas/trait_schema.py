import uuid
from datetime import datetime
from typing import Union, List

from pydantic import BaseModel


class TraitOut(BaseModel):
    id: uuid.UUID
    code: str
    name: str
    description: str
