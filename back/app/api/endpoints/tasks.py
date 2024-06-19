import base64
import os
from operator import itemgetter
import shutil
import uuid
from datetime import datetime
from typing import List
from loguru import logger
from app.core.minio_client import minio_client

import aiohttp
from fastapi import Depends, APIRouter, UploadFile, File, Form
from pydantic import BaseModel

from app.api import deps
from app.api.endpoints.add_json import upload_to_minio, generate_presigned_url
from app.core.config import settings
from app.core.error_config import error_dict, ErrorName
from app.core.postgres import DBWork, Sort
from app.models.models import User, Task, HistoryTask, Image, Remark
from app.schemas.task_schema import StudentTaskOut, DetailTaskUser, DetailTaskAdmin, HistoryTaskOut, TaskSendResult, \
    ReviewTask

router = APIRouter()


@router.get("/defects")
async def det_defects(
    # user: User = Depends(deps.get_current_user),
):
    return settings.features


@router.get("/global_rating")
async def global_rating(
    # user: User = Depends(deps.get_current_user),
    db_work: DBWork = Depends(deps.get_db_work)
):
    # if not user.admin:
    #     raise error_dict.get(ErrorName.Forbidden)
    users = await db_work.get_global_rating_users()
    for i in users:
        i['time'] = round(sum([j.seconds / 60 for j in i['time']]), 0)
        i['grade'] = sum([j for j in i['grade']])
        i['rating'] = round(i['grade']/i['time'], 2)
    user_list = sorted(users, key=itemgetter('rating'), reverse=True)
    result = []
    for n, i in enumerate(user_list, 1):
        i.update({'place': n})
        result.append(i)
    return result


@router.get("/global_rating_tasks")
async def global_rating_ts(
    user: User = Depends(deps.get_current_user),
    db_work: DBWork = Depends(deps.get_db_work)
):
    if not user.admin:
        raise error_dict.get(ErrorName.Forbidden)
    users = await db_work.get_global_rating_tasks()
    done_x = await db_work.get_global_rating_tasks_done()
    user = []
    for n, i in enumerate(users):
        user.append({'id' : i['id'],'title': i['title'], 'rating': (done_x[n]['all_done_users'] / i['all_users'])})
    user_list = sorted(user, key=itemgetter('rating'), reverse=True)
    result = []
    for n, i in enumerate(user_list, 1):
        i.update({'place': n})
        result.append(i)
    return result



@router.get("/my_statistic")
async def my_statistic(
    user: User = Depends(deps.get_current_user),
    db_work: DBWork = Depends(deps.get_db_work)
):
    data = await db_work.task_simple_rating_user(user_id=user.id)
    exist = []
    for i in range(2,6):
        for j in data:
            if not j['grade'] == i:
              exist.append(i)
    for i in exist:
         data.append({'grade': i, 'count': 0})
    sorted_data = sorted(data, key=lambda x: x['grade'])
    result = [i['count'] for i in sorted_data]
    return result


@router.get("/user/statistic/{user_id}")
async def user_statistic(
    user_id: uuid.UUID,
    user: User = Depends(deps.get_current_user),
    db_work: DBWork = Depends(deps.get_db_work)
):
    if not user.admin:
        raise error_dict.get(ErrorName.Forbidden)
    data = await db_work.task_simple_rating_user(user_id=user_id)
    exist = []
    for i in range(2, 6):
        for j in data:
            if not j['grade'] == i:
                exist.append(i)
    for i in exist:
        data.append({'grade': i, 'count': 0})
    sorted_data = sorted(data, key=lambda x: x['grade'])
    result = [i['count'] for i in sorted_data]
    return result


@router.get("/rating/{task_id}")
async def get_my_task_list(
        task_id: uuid.UUID,
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    if user.admin:
        users = await db_work.get_top_users(task_id)
        return [{'place': n, "user_id": i['user_id'], 'fullname': i['fullname'], 'grade': i['grade'], 'time': round(users[0]['time'].seconds / 60, 0)} for n, i in enumerate(users, 1)]
    else:
        raise error_dict.get(ErrorName.Forbidden)


@router.get("/all_users")
async def get_my_task_list(
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    users = await db_work.get_objects(User, {'admin': False})
    return [{'id': i.id, 'fullname': i.full_name} for i in users]


@router.get("/my_task_list")
async def get_my_task_list(
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    if user.admin:
        tasks = await db_work.get_my_tasks(user.id, True)
        result = {}
        user_list = []
        for n, i in enumerate(tasks):
            result[n] = StudentTaskOut(**i)
            user_list.append(i['user_id'])
        user_list = await db_work.select_only_fields(User, [{"field": User.id, 'value': user_list}], ['id', 'full_name'], scalars_option=False)
        user_list = {i['id']: i['full_name'] for i in user_list}
        for i in result:
            result[i].user_full_name = user_list[result[i].user_id]
        return list(result.values())
    else:
        tasks = await db_work.get_my_tasks(user.id)
        return [StudentTaskOut(**i) for i in tasks]


@router.get("/{task_id}")
async def get_task(
        task_id: uuid.UUID,
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    task = await db_work.get_one_obj(Task, {'id': task_id})
    if task is None:
        raise error_dict.get(ErrorName.DoesNotExist)
    lessons = await db_work.get_task_lessons(task_id)
    if user.admin:
        return DetailTaskAdmin(
            id=task.id,
            title=task.title,
            difficulty=task.difficulty,
            time=task.time,
            content=task.content,
            lessons=lessons
        )
    else:
        last_history = await db_work.get_my_last_history_task_id(task_id=task_id, user_id=user.id)
        return DetailTaskUser(
            id=task.id,
            title=task.title,
            difficulty=task.difficulty,
            time=task.time,
            content=task.content,
            start_date=last_history.created_at if last_history else None,
            status=last_history.status if last_history else None,
            grade=last_history.grade if last_history else None,
            history_id=last_history.id,
            lessons=lessons
        )


@router.get("/{task_id}/statistic")
async def get_task(
        task_id: uuid.UUID,
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    task = await db_work.get_one_obj(Task, {'id': task_id})
    if task is None:
        raise error_dict.get(ErrorName.DoesNotExist)
    if user.admin:
        tasks = await db_work.get_all_history_task_id(task_id, user.id, is_admin=True)
        result = {}
        user_list = []
        for n, i in enumerate(tasks):
            result[n] = HistoryTaskOut(**i)
            user_list.append(i['user_id'])
        user_list = await db_work.select_only_fields(User, [{"field": User.id, 'value': user_list}],
                                                     ['id', 'full_name'], scalars_option=False)
        user_list = {i['id']: i['full_name'] for i in user_list}
        for i in result:
            result[i].user_full_name = user_list[result[i].user_id]
        return list(result.values())
    else:
            tasks = await db_work.get_all_history_task_id(task_id, user.id)
            result = {}
            user_list = []
            for n, i in enumerate(tasks):
                result[n] = HistoryTaskOut(**i)
                user_list.append(i['user_id'])
            user_list = await db_work.select_only_fields(User, [{"field": User.id, 'value': user_list}],
                                                         ['id', 'full_name'], scalars_option=False)
            user_list = {i['id']: i['full_name'] for i in user_list}
            for i in result:
                result[i].user_full_name = user_list[result[i].user_id]
            return list(result.values())


@router.post("/{task_id}/activate")
async def activate_task(
        task_id: uuid.UUID,
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    task = await db_work.get_one_obj(Task, {'id': task_id})
    if task is None:
        raise error_dict.get(ErrorName.DoesNotExist)
    if user.admin:
        raise error_dict.get(ErrorName.Forbidden)
    else:
        await db_work.create(HistoryTask(
            task_id=task_id, user_id=user.id, status="progress"
        ))
    return


@router.patch("/{history_task_id}/review")
async def check_task(
        history_task_id: uuid.UUID,
        data_coordinates: ReviewTask,
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)):
    if not user.admin:
        raise error_dict.get(ErrorName.Forbidden)
    history_task = await db_work.get_one_obj(HistoryTask, {'id': history_task_id})
    if history_task is None:
        raise error_dict.get(ErrorName.DoesNotExist)
    if not user.admin:
        raise error_dict.get(ErrorName.Forbidden)
    await db_work.update_obj(HistoryTask, {'id': history_task_id}, {'grade': data_coordinates.grade,
                                                                    'comment': data_coordinates.main_comment,
                                                                    'status': 'done',
                                                                    'inspector': user.id})
    for n, i in enumerate(data_coordinates.images):
        await db_work.update_obj(Remark, {'history_id': data_coordinates.history_id, 'image_id': i['id']},
                                 {'inspector_comment': data_coordinates.comment[n],
                                  'ml_coordinates': data_coordinates.area[n]})


@router.get("/{history_task_id}/review")
async def get_review_task(
        history_task_id: uuid.UUID,
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    history_task = await db_work.get_one_obj(HistoryTask, {'id': history_task_id})
    if history_task is None:
        raise error_dict.get(ErrorName.DoesNotExist)
    task = await db_work.get_one_obj(Task, {'id': history_task.task_id})
    images = await db_work.get_user_images_curent_task(history_task.id)
    images_out = []
    comments = []
    area = []
    for i in images:
        minio_client.fget_object(settings.MINIO_BUCKET, i['image_path'], 'down_file/file.png')
        with open('down_file/file.png', "rb") as file:
            file_content = file.read()
            base64_encoded = base64.b64encode(file_content)
            base64_string = base64_encoded.decode('utf-8')
            link = base64_string
        os.remove('down_file/file.png')
        images_out.append({'id': i['remark_obj'].image_id, 'link': link})
        comments.append(i['remark_obj'].inspector_comment if i['remark_obj'].inspector_comment else "")
        area.append(i['remark_obj'].ml_coordinates if i['remark_obj'].ml_coordinates else [])
    result = ReviewTask(
        history_id=history_task.id,
        grade=history_task.grade,
        main_comment=history_task.comment,
        task_id=task.id if task else None,
        task_name=task.title if task else None,
        images=images_out,
        area=area,
        comment=comments
    )
    return result


@router.post("/{task_id}/send_result")
async def send_result(
        task_id: uuid.UUID,
        data: TaskSendResult = Depends(),
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    task = await db_work.get_one_obj(Task, {'id': task_id})
    task_difficulty = task.difficulty
    if task is None:
        raise error_dict.get(ErrorName.DoesNotExist)
    if user.admin:
        pass
    else:
        history_task = await db_work.get_objects(HistoryTask, {'task_id': task_id, 'user_id': user.id, 'status': 'progress'}, sort=[Sort(sort_value=HistoryTask.created_at, desc=True)])
        if not history_task:
            raise error_dict.get(ErrorName.Forbidden)
        history_task = history_task[0]
        if (datetime.utcnow() - history_task.created_at).seconds > task.time * 60:
            raise error_dict.get(ErrorName.TimeEnd)
        history_task.status = 'auto_review'
        await db_work.save_obj()
        id_dir = str(uuid.uuid4())
        path_dir = f'task_files/{id_dir}/'
        os.makedirs(os.path.dirname(path_dir), exist_ok=True)
        answers = []
        for n, file in enumerate(data.files):
            path_file = path_dir + file.filename
            with open(path_file, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            upload_to_minio(settings.MINIO_BUCKET, path_file, path_file)
            image_obj = Image(minio_path=path_file, title=file.filename)
            await db_work.create(image_obj)

            with open(path_file, 'rb') as f:
                async with aiohttp.ClientSession() as session:
                    async with session.post(settings.URL_ML, data={'file': f}) as response:
                        if response.status == 201:
                            ml_answer = await response.json()
                            for i in ml_answer:
                                answers += i['features']
                            ml_answer = [{'area': i['area'], 'comments': '.'.join(list(map(lambda x: settings.features.get(x), i['features'])))} for i in ml_answer]
                            content = '.'.join([i['comments'] for i in ml_answer])
                            area = [i['area'] for i in ml_answer]
                            await db_work.create(
                                Remark(history_id=history_task.id, image_id=image_obj.id, inspector_comment=content, ml_coordinates=area,))
                        else:
                            await db_work.create(
                                Remark(history_id=history_task.id, image_id=image_obj.id,
                                       inspector_comment=data.comments[n]))
        shutil.rmtree(path_dir)
        grade = round(5 - ((len(answers)/len(data.files)) * (3/task_difficulty)), 0)
        grade = 2 if grade < 2 else grade
        history_task.status = 'review'
        history_task.finish_date = datetime.utcnow()
        history_task.grade = grade
        await db_work.save_obj()