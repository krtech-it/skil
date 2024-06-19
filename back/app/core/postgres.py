from typing import List, Union, Any, Dict
import uuid
from sqlalchemy.dialects.postgresql import aggregate_order_by

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, selectinload, aliased
from sqlalchemy.sql import and_, func, select, delete, update, distinct, or_, not_
from sqlalchemy import insert, text
from pydantic import BaseModel

from app.core.config import settings
from app.core.error_config import ErrorName
from app.models.models import Topic, Lesson, topic_lesson, Trait, trait_topic, Task, HistoryTask, User, lesson_task, \
    trait_lesson, Remark, Image

engine = create_async_engine(url=settings.pg_conn, echo=True, future=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
SessionLocal = sessionmaker(autoflush=False, bind=engine, class_=AsyncSession)


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session


class Sort(BaseModel):
    desc: bool
    sort_value: Any  # from sqlalchemy.orm.attributes import InstrumentedAttribute


class BaseDBWork:
    def __init__(self, session):
        self.session = session

    @staticmethod
    async def create_filter(model, dict_filters: Union[dict, list]) -> list:
        filters = []
        if isinstance(dict_filters, list):
            for item in dict_filters:
                if isinstance(item['value'], list):
                    filters.append(item['field'].in_(item['value']))
                else:
                    filters.append(item['field'] == item['value'])
            return filters
        for column_name, column_value in dict_filters.items():
            if isinstance(column_value, list):
                filters.append(getattr(model, column_name).in_(column_value))
            else:
                filters.append(getattr(model, column_name) == column_value)
        return filters

    @staticmethod
    async def create_serach_filter(filters: List, dict_filters: List):
        for item in dict_filters:
            filters.append(item['field'].ilike(f'%{item["value"]}%'))
        return filters

    @staticmethod
    async def get_result_dict(result, fields_output: List):
        result_list = []
        for i in result:
            result_list.append(dict((fields_output[n], j) for n, j in enumerate(i, 0)))
        return result_list

    @staticmethod
    async def select_query(model=None, fields_output: list = None, scalars_option: bool = True):
        if scalars_option and model:
            query = select(model)
            return query
        elif fields_output:
            query = select(*fields_output)
            return query

    @staticmethod
    async def sort_query(query, sort_list: List[Sort]):
        for sort in sort_list:
            if sort.desc:
                query = query.order_by(sort.sort_value.desc())
            else:
                query = query.order_by(sort.sort_value)
        return query

    async def get_or_create(self, model, filter_dict: dict, data_for_create: dict):
        obj = await self.get_one_obj(model, filter_dict)
        created = False
        if obj is None:
            obj = model(**data_for_create)
            self.session.add(obj)
            await self.session.commit()
            created = True
        return obj, created

    async def create(self, model):
        self.session.add(model)
        await self.session.commit()

    async def create_bulk(self, models):
        self.session.add_all(models)
        await self.session.commit()

    async def create_bulk_table(self, model, values):
        """создание нескольких записей в таблице, отличается от create_bulk
        тем что там работа с объктами sqlalchemy а тут с таблицей"""
        insert_statement = insert(model).values(values)
        await self.session.execute(insert_statement)
        await self.session.commit()

    async def get_one_obj(self, model, filter_dict: dict, attr_for_load: Union[List, str] = None):
        query = select(model)
        filters = await self.create_filter(model, filter_dict)
        query = query.filter(and_(*filters))
        if attr_for_load:
            if isinstance(attr_for_load, list):
                query = query.options(*[selectinload(getattr(model, i)) for i in attr_for_load])
            else:
                query = query.options(selectinload(getattr(model, attr_for_load)))
        result = await self.session.execute(query)
        return result.scalar()

    async def get_objects(self, model, filter_dict: dict, search: List = None, sort: List[Sort] = None):
        query = select(model)

        filters = []
        if filter_dict:
            filters = await self.create_filter(model, filter_dict)
        if search:
            filters = await self.create_serach_filter(filters, search)
        query = query.filter(and_(*filters))
        if sort:
            query = await self.sort_query(query, sort)
        return (await self.session.execute(query)).scalars().all()

    async def select_only_fields(
        self,
        model,
        dict_filters: dict,
        fields_output: List,
        scalars_option: bool = True,
        sort: List[Sort] = None
    ):
        query = await self.select_query(
            fields_output=[getattr(model, i) for i in fields_output],
            scalars_option=scalars_option
        )
        filters = await self.create_filter(model, dict_filters)
        query = query.filter(and_(*filters))
        if sort:
            query = await self.sort_query(query, sort)
        result = await self.session.execute(query)

        if scalars_option:
            return result.scalars().all()
        else:
            return await self.get_result_dict(result, fields_output)

    async def get_count_by_filters(self, model, dict_filters: dict) -> int:
        query = select(func.count())
        filters = await self.create_filter(model, dict_filters)
        query = query.where(*filters)
        result = await self.session.execute(query)
        return result.scalar()

    async def delete_obj(self, model, filter_dict: dict) -> None:
        conditions = await self.create_filter(model=model, dict_filters=filter_dict)
        query = delete(model).where(and_(*conditions))
        await self.session.execute(query)
        await self.session.commit()

    async def update_obj(self, model, where: dict, for_set: dict) -> Union[None, ErrorName]:
        obj = await self.get_one_obj(model, where)
        if not obj:
            return ErrorName.DoesNotExist
        for attr, new_value in for_set.items():
            setattr(obj, attr, new_value)
        await self.session.commit()

    async def update_objects(self, model, filter_dict: dict, update_dict: dict) -> Union[None, ErrorName]:
        query = update(model)
        filters = await self.create_filter(model, filter_dict)
        query = query.filter(and_(*filters))
        query = query.values(**update_dict)
        await self.session.execute(query)
        await self.session.commit()

    async def save_obj(self):
        await self.session.commit()

    async def bulk_save_obj(self, data: list):
        """Массовое обновление записей в БД"""
        try:
            for item in data:
                await self.session.merge(item)
            await self.session.commit()
        except Exception as e:
            await self.session.rollback()
            raise Exception(f"Ошибка при массовом upsert в базу данных: {e}")


class DBWork(BaseDBWork):
    async def get_topics(self):
        query = select(Topic.id, Topic.title, Topic.description,
                       func.array_agg(aggregate_order_by(Lesson.id, Lesson.id)),
                       func.array_agg(aggregate_order_by(Lesson.title, Lesson.id)),
                       func.array_agg(aggregate_order_by(Lesson.content, Lesson.id))
                       )
        query = query.join(topic_lesson, topic_lesson.c.topic_id == Topic.id, isouter=True)
        query = query.join(Lesson, Lesson.id == topic_lesson.c.lesson_id, isouter=True)
        query = query.group_by(Topic.id)
        result = await self.session.execute(query)
        return await self.get_result_dict(result,
                                          ['id', 'title', 'description', 'lesson_ids', 'lesson_titles',
                                           'lesson_content'])

    async def get_topics_traits(self):
        query = select(Topic.id,
                       func.array_agg(aggregate_order_by(Trait.id, Trait.id)),
                       func.array_agg(aggregate_order_by(Trait.name, Trait.id))
                       )
        query = query.join(trait_topic, trait_topic.c.topic_id == Topic.id, isouter=True)
        query = query.join(Trait, Trait.id == trait_topic.c.trait_id, isouter=True)
        query = query.group_by(Topic.id)
        result = await self.session.execute(query)
        return await self.get_result_dict(result,
                                          ['id', 'trait_ids', 'trait_titles'])

    async def get_my_tasks(self, user_id, is_admin=False):
        query = select(Task.id, func.array_agg(aggregate_order_by(HistoryTask.id, HistoryTask.created_at.desc())))
        query = query.join(HistoryTask, HistoryTask.task_id == Task.id)
        query = query.join(User, User.id == HistoryTask.inspector, isouter=True)
        if is_admin:
            query = query.group_by(Task.id, HistoryTask.user_id)
        else:
            query = query.filter(HistoryTask.user_id == user_id)
            query = query.group_by(Task.id)
        result = await self.session.execute(query)
        history_ids = [i['history_id'].pop(0) for i in await self.get_result_dict(result,
                                          ['id', 'history_id']
                                          )]
        query = select(Task.id, Task.title, Task.difficulty,
                       Task.time, HistoryTask.created_at, HistoryTask.status,
                       HistoryTask.grade, HistoryTask.inspector, User.full_name, HistoryTask.user_id, HistoryTask.id)
        query = query.join(HistoryTask, HistoryTask.task_id == Task.id)
        query = query.join(User, User.id == HistoryTask.inspector, isouter=True)
        query = query.filter(HistoryTask.id.in_(history_ids))
        result = await self.session.execute(query)
        return await self.get_result_dict(result,
                                          ['id', 'title', 'difficulty', 'time', 'start_date',
                                           'status', 'grade', 'inspector_id', 'inspector_fullname', 'user_id', 'history_id']
                                          )

    async def get_lesson_task(self, lesson_id):
        query = (select(Task.id, Task.title).join(lesson_task, lesson_task.c.task_id == Task.id)
                 .filter(lesson_task.c.lesson_id == lesson_id))
        result = await self.session.execute(query)
        return await self.get_result_dict(result,
                                          ['id', 'title']
                                          )

    async def get_lesson_trait(self, lesson_id):
        query = (select(Trait.id, Trait.code, Trait.name, Trait.description).join(trait_lesson, trait_lesson.c.trait_id == Trait.id)
                 .filter(trait_lesson.c.lesson_id == lesson_id))
        result = await self.session.execute(query)
        return await self.get_result_dict(result,
                                          ['id', 'code','name','description' ]
                                          )

    async def get_my_last_history_task_id(self, user_id, task_id):
        query = select(HistoryTask)
        query = query.filter(HistoryTask.task_id == task_id, HistoryTask.user_id == user_id)
        query = query.order_by(HistoryTask.created_at.desc())
        result = await self.session.execute(query)
        return result.scalar()

    async def get_all_history_task_id(self, task_id, user_id, is_admin=False):
        query = select(HistoryTask.id, HistoryTask.created_at, HistoryTask.status, HistoryTask.grade, HistoryTask.inspector, HistoryTask.user_id, User.full_name)
        query = query.join(User, HistoryTask.inspector == User.id)
        if is_admin:
            query = query.filter(HistoryTask.task_id == task_id)
        else:
            query = query.filter(HistoryTask.task_id == task_id, HistoryTask.user_id == user_id)
        query = query.order_by(HistoryTask.created_at.desc())
        result = await self.session.execute(query)
        return await self.get_result_dict(result, ['history_task_id', 'start_date','status','grade','inspector_id','user_id', 'inspector_fullname'])

    async def get_all_lessons(self, topic_id):
        query = select(Lesson,
                       func.array_agg(aggregate_order_by(Trait.id, Trait.id)),
                       func.array_agg(aggregate_order_by(Trait.name, Trait.id)))
        query = query.join(topic_lesson, topic_lesson.c.lesson_id == Lesson.id)
        query = query.join(trait_lesson, trait_lesson.c.lesson_id == Lesson.id, isouter=True)
        query = query.join(Trait, trait_lesson.c.trait_id == Trait.id, isouter=True)
        query = query.filter(topic_lesson.c.topic_id == topic_id)
        query = query.order_by(Lesson.title)
        query = query.group_by(Lesson.id)
        result = await self.session.execute(query)
        return await self.get_result_dict(result, ['lesson_obj', 'trait_id', 'trait_name'])

    async def get_user_images_curent_task(self, history_id):
        query = select(Remark, Image.minio_path)
        query = query.join(Image, Image.id == Remark.image_id, isouter=True)
        query = query.filter(Remark.history_id == history_id)
        result = await self.session.execute(query)
        return await self.get_result_dict(result, ['remark_obj', 'image_path'])

    async def task_simple_rating_user(self, user_id):
        query = select(HistoryTask.grade, func.count(HistoryTask.task_id))
        query = query.filter(HistoryTask.user_id == user_id, HistoryTask.status == 'done',
                             HistoryTask.grade.in_([2,3,4,5]))
        query = query.group_by(HistoryTask.grade)
        query = query.order_by(HistoryTask.grade)
        result = await self.session.execute(query)
        return await self.get_result_dict(result, ['grade', 'count'])

    async def get_task_for_topik(self, topic_id):
        query = select(lesson_task.c.task_id)
        query = query.join(topic_lesson, topic_lesson.c.lesson_id == lesson_task.c.lesson_id)
        query = query.filter(topic_lesson.c.topic_id == topic_id)
        result = await self.session.execute(query)
        x = await self.get_result_dict(result, ['task_id'])
        return [i['task_id'] for i in x]

    async def get_user_task_done(self, task_ids, user_id):
        query = select(HistoryTask.task_id)
        query = query.filter(and_(HistoryTask.task_id.in_(task_ids), HistoryTask.status=='done',
                                  HistoryTask.user_id == user_id, HistoryTask.grade.in_([3,4,5])))
        result = await self.session.execute(query)
        result = await self.get_result_dict(result, ['task_id'])
        return [i['task_id'] for i in result]

    async def get_data_diplom_tasks(self, user_id, tasks):
        query = select(HistoryTask.task_id,
                       func.array_agg(aggregate_order_by(HistoryTask.grade, HistoryTask.grade.desc())),
                       func.array_agg(aggregate_order_by(HistoryTask.finish_date, HistoryTask.grade.desc())),
                       func.array_agg(aggregate_order_by(HistoryTask.created_at, HistoryTask.grade.desc())),
                       )
        query = query.filter(and_(HistoryTask.task_id.in_(tasks), HistoryTask.user_id == user_id, HistoryTask.status == 'done'))
        query = query.group_by(HistoryTask.task_id)
        result = await self.session.execute(query)
        return await self.get_result_dict(result, ['task_id', 'grade', 'finish_time', 'creat_time'])


    async def get_task_lessons(self, task_id):
        query = select(Lesson.id.distinct(), Lesson.title, func.array_agg(topic_lesson.c.topic_id))
        query = query.join(lesson_task, lesson_task.c.lesson_id == Lesson.id)
        query = query.join(topic_lesson, topic_lesson.c.lesson_id == Lesson.id, isouter=True)
        query = query.group_by(Lesson.id)
        result = await self.session.execute(query)
        return await self.get_result_dict(result, ['lesson_id', 'lesson_title', 'topic_id'])

    async def get_top_users(self, task_id):
        query = select(User.id.distinct(), User.full_name, HistoryTask.grade, HistoryTask.finish_date-HistoryTask.created_at)
        query = query.join(HistoryTask, HistoryTask.user_id == User.id)
        query = query.filter(and_(HistoryTask.task_id == task_id, User.admin == False))
        query = query.order_by(HistoryTask.grade.desc()).order_by(HistoryTask.finish_date-HistoryTask.created_at)
        result = await self.session.execute(query)
        return await self.get_result_dict(result, ['user_id', 'fullname', 'grade', 'time'])


    async def get_global_rating_users(self):
        query = select(User.id.distinct(), User.full_name,
                       func.array_agg(aggregate_order_by(HistoryTask.finish_date-HistoryTask.created_at, HistoryTask.id)),
                       func.array_agg(aggregate_order_by(HistoryTask.grade, HistoryTask.task_id)))
        query = query.join(HistoryTask, HistoryTask.user_id == User.id, isouter=True)
        query = query.join(Task, Task.id == HistoryTask.task_id, isouter=True)
        query = query.group_by(User.id, HistoryTask.status, HistoryTask.grade)
        query = query.having(and_(HistoryTask.status == 'done', HistoryTask.grade.in_([3,4,5])))
        result = await self.session.execute(query)
        return await self.get_result_dict(result, ['id', 'fullname', 'time', 'grade'])


    async def get_global_rating_tasks(self):
        query = select(Task.id.distinct(), Task.title, func.count(HistoryTask.task_id))
        query = query.join(Task, Task.id == HistoryTask.task_id)
        query = query.group_by(Task.id)
        query = query.order_by(Task.id)
        result = await self.session.execute(query)
        return await self.get_result_dict(result, ['id', 'title', 'all_users'])


    async def get_global_rating_tasks_done(self):
        query = select(Task.id.distinct(), Task.title, func.count(HistoryTask.task_id))
        query = query.join(Task, Task.id == HistoryTask.task_id)
        query = query.filter(and_(HistoryTask.status == 'done', HistoryTask.grade.in_([3,4,5])))
        query = query.group_by(Task.id)
        query = query.order_by(Task.id)
        result = await self.session.execute(query)
        return await self.get_result_dict(result, ['id', 'title', 'all_done_users'])