import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.auth import User
from app.models.catalog import Track, TrackLicenseRule, TrackFavorite
from app.schemas.catalog import TrackResponse, TrackCreateRequest, TrackUpdateRequest, TrackLicenseRuleResponse, TrackLicenseRuleCreate

router = APIRouter(prefix="/tracks", tags=["tracks"])


@router.get("/favorites", response_model=list[str])
async def list_favorites(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return list of track IDs favorited by the current user."""
    result = await db.execute(
        select(TrackFavorite.track_id).where(TrackFavorite.user_id == current_user.id)
    )
    return [str(row[0]) for row in result.all()]


@router.get("/", response_model=list[TrackResponse])
async def list_tracks(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    result = await db.execute(select(Track).where(Track.active == True).order_by(Track.title))
    tracks = result.scalars().all()
    return [TrackResponse.model_validate(t, from_attributes=True) for t in tracks]


@router.get("/{track_id}", response_model=TrackResponse)
async def get_track(track_id: uuid.UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    track = await db.get(Track, track_id)
    if not track:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TRACK_NOT_FOUND")
    return TrackResponse.model_validate(track, from_attributes=True)


@router.post("/", response_model=TrackResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_roles("admin", "super_admin"))])
async def create_track(body: TrackCreateRequest, db: AsyncSession = Depends(get_db)):
    track = Track(**body.model_dump())
    db.add(track)
    await db.flush()
    return TrackResponse.model_validate(track, from_attributes=True)


@router.patch("/{track_id}", response_model=TrackResponse, dependencies=[Depends(require_roles("admin", "super_admin"))])
async def update_track(
    track_id: uuid.UUID,
    body: TrackUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    track = await db.get(Track, track_id)
    if not track:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TRACK_NOT_FOUND")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(track, field, value)
    await db.flush()
    return TrackResponse.model_validate(track, from_attributes=True)


@router.delete("/{track_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_roles("admin", "super_admin"))])
async def delete_track(
    track_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    track = await db.get(Track, track_id)
    if not track:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TRACK_NOT_FOUND")
    track.active = False
    await db.flush()


@router.get("/{track_id}/rules", response_model=list[TrackLicenseRuleResponse])
async def list_rules(track_id: uuid.UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(TrackLicenseRule).where(TrackLicenseRule.track_id == track_id))
    return [TrackLicenseRuleResponse.model_validate(r, from_attributes=True) for r in result.scalars().all()]


@router.post("/{track_id}/rules", response_model=TrackLicenseRuleResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_roles("admin", "super_admin"))])
async def create_rule(track_id: uuid.UUID, body: TrackLicenseRuleCreate, db: AsyncSession = Depends(get_db)):
    rule = TrackLicenseRule(track_id=track_id, **body.model_dump())
    db.add(rule)
    await db.flush()
    return TrackLicenseRuleResponse.model_validate(rule, from_attributes=True)


@router.delete("/{track_id}/rules/{rule_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_roles("admin", "super_admin"))])
async def delete_rule(
    track_id: uuid.UUID,
    rule_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    rule = await db.get(TrackLicenseRule, rule_id)
    if not rule or rule.track_id != track_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="RULE_NOT_FOUND")
    await db.delete(rule)
    await db.flush()


@router.post("/{track_id}/favorite", status_code=status.HTTP_200_OK)
async def toggle_favorite(
    track_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Toggle favorite status for a track. Returns {favorited: bool}."""
    existing = await db.execute(
        select(TrackFavorite).where(
            TrackFavorite.user_id == current_user.id,
            TrackFavorite.track_id == track_id,
        )
    )
    fav = existing.scalar_one_or_none()
    if fav:
        await db.delete(fav)
        await db.flush()
        return {"favorited": False, "track_id": str(track_id)}
    else:
        new_fav = TrackFavorite(user_id=current_user.id, track_id=track_id)
        db.add(new_fav)
        await db.flush()
        return {"favorited": True, "track_id": str(track_id)}
