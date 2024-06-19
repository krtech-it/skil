import uuid

from fastapi import Depends, APIRouter

from app.api import deps
from app.core.postgres import DBWork
from app.models.models import User, Topic, HistoryTask, Task
from app.schemas.topic_schema import TopicOut, LessonOut, DetailTopicOut

router = APIRouter()


@router.get("/topic/{topic_id}")
async def get_topic(
        topic_id: uuid.UUID,
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    tasks = await db_work.get_task_for_topik(topic_id)
    task_done_user = await db_work.get_user_task_done(tasks, user.id)
    tasks = set(tasks) - set(task_done_user)
    if tasks:
        status = "progress"
    else:
        status = "done"
    topic = await db_work.get_one_obj(Topic, {'id': topic_id})
    if topic:
        lessons = await db_work.get_all_lessons(topic_id)
        lessons = [LessonOut(id=i['lesson_obj'].id, code=i['lesson_obj'].code,
                             title=i['lesson_obj'].title, content=i['lesson_obj'].content,
                             author=i['lesson_obj'].author, traits=[{'id': x, 'name': y} for x, y in zip(i['trait_id'], i['trait_name']) if i['trait_id'][0] is not None])
                   for i in lessons]
        return DetailTopicOut(
            status=status,
            id=topic.id,
            title=topic.title,
            lessons=lessons,
        )


@router.get("/get_data_diplom/{topic_id}")
async def get_topic(
        topic_id: uuid.UUID,
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    tasks = await db_work.get_task_for_topik(topic_id)
    result_tasks = await db_work.get_data_diplom_tasks(tasks=tasks, user_id=user.id)
    task_name = await db_work.select_only_fields(Task, {'id': tasks}, ['id', 'title'], scalars_option=False)
    task_name = {str(i['id']): i['title'] for i in task_name}
    result = []
    for i in result_tasks:
        title = task_name[str(i['task_id'])]
        task_time = (i['finish_time'][0] - i['creat_time'][0]).seconds / 60
        result.append({'task_id': i['task_id'], 'title': title, 'grade': i['grade'][0], 'time': round(task_time, 1)})
    return result

@router.get("/topic_list")
async def topic_list(
        # user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    topic_list = await db_work.get_topics()
    topics_out = {}
    for topic in topic_list:
        lessons = [{'id': topic_id, 'title': title, 'content': content}
                   for topic_id, title, content in zip(topic['lesson_ids'], topic['lesson_titles'], topic['lesson_content']) if topic_id is not None]
        topics_out[topic['id']] = TopicOut(id=topic['id'], title=topic['title'], description=topic['description'],
                                           lessons=lessons)
    trait_list = await db_work.get_topics_traits()
    for topic in trait_list:
        traits = [{'id': trait_id, 'name': title}
                  for trait_id, title in zip(topic['trait_ids'], topic['trait_titles']) if trait_id is not None]
        topics_out[topic['id']].traits = traits
    return list(topics_out.values())