from fastapi import Depends
from typing import Union, Any
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordBearer, HTTPBearer
from jose import jwt
from pydantic import ValidationError

from app.core.config import settings
from app.core.postgres import DBWork, get_session
from app.models.models import User

auth_scheme = HTTPBearer()


async def get_db_work(session: AsyncSession = Depends(get_session)):
    return DBWork(session)


reuseable_oauth = OAuth2PasswordBearer(
    tokenUrl="/login",
    scheme_name="JWT"
)


async def get_current_user(token: str = Depends(reuseable_oauth), db_work: DBWork = Depends(get_db_work)):
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = payload#TokenPayload(**payload)

        if datetime.fromtimestamp(token_data.get('exp', 0)) < datetime.now():
            raise HTTPException(
                status_code=401,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except(jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=403,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await db_work.get_one_obj(User, {'username': token_data.get('sub', None)})

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="Could not find user",
        )

    return user#SystemUser(**user)
