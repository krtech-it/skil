import uuid

from fastapi import APIRouter, Depends, Body, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from app.core.postgres import DBWork, Sort
from app.api import deps
from app.models.models import User
from app.schemas.auth_schemas import UserSchema, UserLoginSchema, UserOutput
from app.utils.utils_auth import get_hashed_password, verify_password, create_access_token, create_refresh_token

router = APIRouter()


@router.post("/user/signup")
async def create_user(
        user: UserSchema,
        db_work: DBWork = Depends(deps.get_db_work)
):
    db_user = await db_work.get_one_obj(User, {'username': user.username})
    if db_user:
        raise HTTPException(400, detail="Такой username уже зарегистрирован")
    db_user = User(username=user.username, full_name=user.fullname, password=get_hashed_password(user.password))
    await db_work.create(db_user)


@router.post('/login', summary="Create access and refresh tokens for user")
async def login(
        form_data: UserLoginSchema,
        db_work: DBWork = Depends(deps.get_db_work)
):
    db_user = await db_work.get_one_obj(User, {'username': form_data.username})
    if db_user is None:
        raise HTTPException(
            status_code=400,
            detail="Неправильное имя пользователя"
        )
    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(
            status_code=400,
            detail="Неправильный пароль"
        )

    return {
        "access_token": create_access_token(db_user.username),
        "refresh_token": create_refresh_token(db_user.username),
    }


@router.get("/user/me/", response_model=UserOutput)
async def get_user(
    user: User = Depends(deps.get_current_user)
):
    return UserOutput(username=user.username, full_name=user.full_name, admin=user.admin)