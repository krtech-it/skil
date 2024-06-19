import base64
import json
import os
import shutil
import time
import uuid
import zipfile
from datetime import timedelta
from http.client import HTTPException
from sqlalchemy import text
from app.core.postgres import async_session

from fastapi import Depends, APIRouter, UploadFile, File
from minio.error import S3Error, MinioException

from app.api import deps
from app.core.config import settings
from app.core.postgres import DBWork
from app.core.minio_client import minio_client
from app.models.models import User, Trait, Task, Lesson, Topic, topic_lesson, trait_topic, trait_lesson, lesson_task

router = APIRouter()


def get_all_files(directory):
    file_paths = []
    for root, _, files in os.walk(directory):
        for file in files:
            file_paths.append(os.path.join(root, file))
    return file_paths

def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def upload_to_minio(bucket_name, file_path, object_name):
    try:
        if not minio_client.bucket_exists(bucket_name):
            minio_client.make_bucket(bucket_name)
        minio_client.fput_object(bucket_name, object_name, file_path)
    except S3Error as e:
        pass


def generate_presigned_url(bucket_name, object_name, expiry_days):
    try:
        return minio_client.presigned_get_object(bucket_name, object_name, expires=timedelta(hours=10))
    except MinioException as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/add_data")
async def get_lesson(
        file: UploadFile = File(...),
        # user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    id_dir = str(uuid.uuid4())
    path_dir = f'files/{id_dir}/'
    path_file = path_dir + file.filename
    os.makedirs(os.path.dirname(path_dir), exist_ok=True)
    with open(path_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    with zipfile.ZipFile(path_file, 'r') as zip_ref:
        zip_ref.extractall(path_dir+'rar/')

    file_paths = get_all_files(path_dir+'rar/')
    file_name = file.filename.replace('.zip', '')
    topics = []
    traits = []
    tasks = []
    lessons = []
    for i in file_paths:
        if i.startswith(path_dir+'rar/'+file_name+'/topic') and i.endswith('.json'):
            topics.append(i)
        elif i.startswith(path_dir+'rar/'+file_name+'/trait') and i.endswith('.json'):
            traits.append(i)
        elif i.startswith(path_dir + 'rar/' + file_name + '/tasks') and i.endswith('.json'):
            tasks.append(i)
        elif i.startswith(path_dir + 'rar/' + file_name + '/lessons') and i.endswith('.json'):
            lessons.append(i)

    for i in traits:
        trait_data = read_json_file(i)
        for trait in trait_data:
            try:
                await db_work.get_or_create(Trait, {'code': trait['code']},
                                      {'code': trait['code'], 'name': trait['name'], 'description': trait['description']})
            except:
                pass
#-------------------------------------------
    for i in tasks:
        task_data = read_json_file(i)
        content = task_data['content']
        path_json = '/'.join(i.split('/')[:-1])
        supplement = task_data['supplement']
        for image in supplement:
            with open(path_json + '/' + image['file'], "rb") as file:
                file_content = file.read()
                base64_encoded = base64.b64encode(file_content)
                base64_string = base64_encoded.decode('utf-8')
                link = base64_string
            content = content.replace(image['file'], 'data:image/jpeg;base64,'+link)
        await db_work.get_or_create(Task, {'code': task_data['code']},
                                    {'code': task_data['code'], 'title': task_data['title'], 'content': content,
                                     'difficulty': task_data['difficulty'], 'time': task_data['time']})

    #----------------------------------------------------------
    for i in lessons:
        lesson_data = read_json_file(i)
        content = lesson_data['content']
        path_json = '/'.join(i.split('/')[:-1])
        supplement = lesson_data['supplement']
        for image in supplement:
            with open(path_json + '/' + image['file'], "rb") as file:
                file_content = file.read()
                base64_encoded = base64.b64encode(file_content)
                base64_string = base64_encoded.decode('utf-8')
                link = base64_string
            content = content.replace(image['file'], 'data:image/jpeg;base64,'+link)
        lesson_obj = await db_work.get_one_obj(Lesson, {'code': lesson_data['code']})
        if not lesson_obj:
            lesson_obj = Lesson(**{'code': lesson_data['code'], 'title': lesson_data['title'],
                                     'content': content, 'author': lesson_data['author']})
            await db_work.create(lesson_obj)
        tasks = await db_work.get_objects(Task, {'code': lesson_data['tasks']})
        traits = await db_work.get_objects(Trait, {'code': lesson_data['traits']})
        for j in tasks:
            try:
                sql_query = text(
                    "INSERT INTO lesson_task (task_id, lesson_id) "
                    "VALUES (:task_id, :lesson_id)"
                )

                # Выполняем запрос с передачей параметров
                await db_work.session.execute(sql_query, {"task_id": j.id, "lesson_id": lesson_obj.id})

                # Коммитим транзакцию
                await db_work.session.commit()
            except:
                await db_work.session.rollback()

        for j in traits:
            try:
                sql_query = text(
                    "INSERT INTO trait_lesson (trait_id, lesson_id) "
                    "VALUES (:trait_id, :lesson_id)"
                )

                # Выполняем запрос с передачей параметров
                await db_work.session.execute(sql_query, {"trait_id": j.id, "lesson_id": lesson_obj.id})

                # Коммитим транзакцию
                await db_work.session.commit()
            except:
                await db_work.session.rollback()

    for i in topics:
        topic_data = read_json_file(i)
        topic_obj, created = await db_work.get_or_create(Topic, {'code': topic_data['code']},
                                        {'code': topic_data['code'], 'title': topic_data['title'],
                                         'description': topic_data['description']})
        traits = await db_work.get_objects(Trait, {'code': topic_data['traits']})
        lessons = await db_work.get_objects(Lesson, {'code': topic_data['lessons']})
        for j in traits:
            try:
                sql_query = text(
                    "INSERT INTO trait_topic (trait_id, topic_id) "
                    "VALUES (:trait_id, :topic_id)"
                )

                # Выполняем запрос с передачей параметров
                await db_work.session.execute(sql_query, {"trait_id": j.id, "topic_id": topic_obj.id})

                # Коммитим транзакцию
                await db_work.session.commit()
            except:
                await db_work.session.rollback()
        for j in lessons:
            try:
                sql_query = text(
                    "INSERT INTO topic_lesson (lesson_id, topic_id) "
                    "VALUES (:lesson_id, :topic_id)"
                )

                # Выполняем запрос с передачей параметров
                await db_work.session.execute(sql_query, {"lesson_id": j.id, "topic_id": topic_obj.id})

                # Коммитим транзакцию
                await db_work.session.commit()
            except:
                await db_work.session.rollback()

