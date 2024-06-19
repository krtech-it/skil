from fastapi import Depends, APIRouter

from app.api import deps
from app.core.postgres import DBWork
from app.models.models import User, Trait
from app.schemas.trait_schema import TraitOut

router = APIRouter()


@router.get("/trait_list")
async def get_trait_list(
        user: User = Depends(deps.get_current_user),
        db_work: DBWork = Depends(deps.get_db_work)
):
    traits = await db_work.get_objects(Trait, {})
    return [TraitOut(id=trait.id, code=trait.code, name=trait.name, description=trait.description) for trait in traits]