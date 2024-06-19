import asyncio
import datetime

from fastapi import FastAPI
from loguru import logger
from starlette.middleware.cors import CORSMiddleware

from app.api.api_router import b3_router
from app.core.config import settings
from app.core.postgres import async_session, DBWork
from app.models.models import User, HistoryTask, Task
from app.schemas.auth_schemas import UserSchema
from app.utils.utils_auth import get_hashed_password

# Будет подменяться на версию из тега при деплое.

logger.add(
    "./logs/requests_and_responses.log",
    rotation="10 MB",
    retention=5,
)

app = FastAPI(title=settings.PROJECT_NAME, debug=True)

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

async def timer_checker():
    while True:
        async with async_session() as session:
            db_work = DBWork(session)
            x = await db_work.get_objects(HistoryTask, {'status': 'progress'})
            task_ids = {}
            for i in x:
                if str(i.task_id) not in task_ids.keys():
                    task_ids[str(i.task_id)] = []
                task_ids[str(i.task_id)].append({'history': i.id, 'start': i.created_at})
            tasks = await db_work.select_only_fields(Task, {'id': list(task_ids.keys())}, ['id', 'time'], scalars_option=False)
            history_list = []
            for i in tasks:
                for j in task_ids[str(i['id'])]:
                    if (datetime.datetime.utcnow() - j['start']).seconds > i['time'] * 60:
                        history_list.append(j['history'])
            await db_work.update_objects(HistoryTask, {'id': history_list}, {'status': 'done', 'grade': 2, 'finish_date': datetime.datetime.utcnow()})
        await asyncio.sleep(30)


@app.on_event("startup")
async def on_startup(
):
    asyncio.create_task(timer_checker())
    async with async_session() as session:
        db_work = DBWork(session)
        users = [
            UserSchema(
                fullname='Администратор',
                username='admin',
                password='admin',
                admin=True
            ),
            UserSchema(
                fullname='Петров Петр Александрович',
                username='teacher',
                password='teacher',
                admin=False
            ),
            UserSchema(
                fullname='Николаев Матвей Иванович',
                username='student1',
                password='student1',
                admin=False
            ),
            UserSchema(
                fullname='Журавлев Дмитрий Андреевич',
                username='student2',
                password='student2',
                admin=False
            ),
            UserSchema(
                fullname='Касаткин Николай Максимович',
                username='student3',
                password='student3',
                admin=False
            )
        ]
        for i in users:
            await db_work.get_or_create(User,
                                        {'username': i.username},
                                        {'username': i.username, 'password': get_hashed_password(i.password),
                                         'full_name': i.fullname, 'admin': i.admin}
                                        )


app.include_router(b3_router)
