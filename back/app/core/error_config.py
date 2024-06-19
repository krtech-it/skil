from enum import Enum

from fastapi.exceptions import HTTPException


class ErrorName(Enum):
    DoesNotExist = "DoesNotExist"
    Forbidden = "Forbidden"
    Conflict = "Conflict"
    AlreadyExist = "AlreadyExist"
    BadRequest = "BadRequest"
    TimeEnd = "TimeEnd"


error_dict = {
    ErrorName.DoesNotExist: HTTPException(status_code=404, detail="Элемент не найден"),
    ErrorName.Forbidden: HTTPException(status_code=403, detail="Нет доступа"),
    ErrorName.Conflict: HTTPException(status_code=409, detail="Ошибка записи в БД"),
    ErrorName.AlreadyExist: HTTPException(status_code=409, detail="Объект с таким названием уже существует"),
    ErrorName.BadRequest: HTTPException(status_code=400),
    ErrorName.TimeEnd: HTTPException(status_code=400, detail="Время закончилось")
}
