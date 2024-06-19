import uuid

from fastapi import Depends, APIRouter

from app.api import deps
from app.core.postgres import DBWork
from app.models.models import User, Lesson, Task
from app.schemas.lesson_schema import DetailLessonOut, DetailTask, DetailTrait
from app.schemas.task_schema import StudentTaskOut
from app.core.error_config import ErrorName, error_dict

router = APIRouter()


@router.get("/{lesson_id}")
async def get_lesson(
        lesson_id: uuid.UUID,
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    lesson = await db_work.get_one_obj(Lesson, {'id': lesson_id})
    if lesson is None:
        raise error_dict.get(ErrorName.DoesNotExist)
    tasks = await db_work.get_lesson_task(lesson_id)
    traits = await db_work.get_lesson_trait(lesson_id)
    lesson_result = DetailLessonOut(id=lesson.id, title=lesson.title, content=lesson.content, author=lesson.author)
    lesson_result.tasks = [DetailTask(**i) for i in tasks]
    lesson_result.traits = [DetailTrait(**i) for i in traits]
    return lesson_result
