import uuid
from datetime import datetime
from typing import Annotated

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey, JSON, CheckConstraint, Table, Column, UUID, UniqueConstraint

Base = declarative_base()

pk_uuid = Annotated[uuid.UUID, mapped_column(primary_key=True, default=uuid.uuid4)]
code_default = Annotated[str, mapped_column(unique=True)]
created_at = Annotated[datetime, mapped_column(default=func.now())]
updated_at = Annotated[datetime, mapped_column(default=func.now(), onupdate=func.now())]


trait_topic = Table(
    "trait_topic",
    Base.metadata,
    Column("trait_id", UUID, ForeignKey("traits.id", ondelete="CASCADE"), nullable=False),
    Column("topic_id", UUID, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False),
    UniqueConstraint("trait_id", "topic_id", name="uq_trait_topic")
)


trait_lesson = Table(
    "trait_lesson",
    Base.metadata,
    Column("trait_id", UUID, ForeignKey("traits.id", ondelete="CASCADE"), nullable=False),
    Column("lesson_id", UUID, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False),
    UniqueConstraint("trait_id", "lesson_id", name="uq_trait_lesson")
)


topic_lesson = Table(
    "topic_lesson",
    Base.metadata,
    Column("topic_id", UUID, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False),
    Column("lesson_id", UUID, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False),
    UniqueConstraint("topic_id", "lesson_id", name="uq_topic_lesson")
)


lesson_task = Table(
    "lesson_task",
    Base.metadata,
    Column("task_id", UUID, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False),
    Column("lesson_id", UUID, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False),
    UniqueConstraint("task_id", "lesson_id", name="uq_lesson_task")
)


lesson_image = Table(
    "lesson_image",
    Base.metadata,
    Column("image_id", UUID, ForeignKey("images.id", ondelete="CASCADE"), nullable=False),
    Column("lesson_id", UUID, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False),
    UniqueConstraint("image_id", "lesson_id", name="uq_lesson_image")
)


task_image = Table(
    "task_image",
    Base.metadata,
    Column("image_id", UUID, ForeignKey("images.id", ondelete="CASCADE"), nullable=False),
    Column("task_id", UUID, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False),
    UniqueConstraint("image_id", "task_id", name="uq_task_image")
)


class Trait(Base):
    __tablename__ = "traits"
    id: Mapped[pk_uuid]
    code: Mapped[str] = mapped_column(unique=True, nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class Topic(Base):
    __tablename__ = "topics"
    id: Mapped[pk_uuid]
    code: Mapped[code_default]
    title: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class Lesson(Base):
    __tablename__ = "lessons"
    id: Mapped[pk_uuid]
    code: Mapped[code_default]
    title: Mapped[str] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    author: Mapped[str] = mapped_column(nullable=True)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[pk_uuid]
    code: Mapped[code_default]
    title: Mapped[str] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    difficulty: Mapped[int] = mapped_column(nullable=False)
    time: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class User(Base):
    __tablename__ = "users"
    id: Mapped[pk_uuid]
    full_name: Mapped[str] = mapped_column(nullable=False)
    username: Mapped[str] = mapped_column(nullable=False, unique=True)
    admin: Mapped[bool] = mapped_column(server_default="false")
    password: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class Image(Base):
    __tablename__ = "images"
    id: Mapped[pk_uuid]
    minio_path: Mapped[str] = mapped_column(nullable=False)
    title: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[created_at]


class HistoryTask(Base):
    __tablename__ = "history"
    id: Mapped[pk_uuid]
    task_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[str] = mapped_column(nullable=False)
    inspector: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    comment: Mapped[str] = mapped_column(nullable=True)
    grade: Mapped[int] = mapped_column(CheckConstraint('grade >= 0 AND grade <= 5'), nullable=False, server_default="0")
    finish_date: Mapped[datetime] = mapped_column(nullable=True)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class Remark(Base):
    __tablename__ = "remarks"
    id: Mapped[pk_uuid]
    history_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("history.id", ondelete="CASCADE"), nullable=False
    )
    image_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("images.id", ondelete="CASCADE"), nullable=False
    )
    inspector_coordinates: Mapped[dict] = mapped_column(JSON, nullable=True)
    student_coordinates: Mapped[dict] = mapped_column(JSON, nullable=True)
    ml_coordinates: Mapped[dict] = mapped_column(JSON, nullable=True)
    inspector_comment: Mapped[str] = mapped_column(nullable=True)
    student_comment: Mapped[str] = mapped_column(nullable=True)
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
