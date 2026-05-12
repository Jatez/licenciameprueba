import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.auth import User
from app.models.publishing import PublishSession, PublishedUsage
from app.schemas.publishing import CreateSessionRequest, MusicWindowUpdate, PublishSessionResponse, PublishedUsageResponse
from app.services import publish_service, audit_service

router = APIRouter(prefix="/publish", tags=["publish"])


@router.post("/sessions", response_model=PublishSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    body: CreateSessionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = await publish_service.create_session(
        db,
        company_id=current_user.company_id,
        user_id=current_user.id,
        track_id=body.track_id,
        social_account_id=body.social_account_id,
        content_type=body.content_type,
        caption=body.caption,
    )
    await audit_service.log_action(db, current_user.id, current_user.company_id, "publish_session", session.id, "create")
    return PublishSessionResponse.model_validate(session, from_attributes=True)


@router.get("/sessions", response_model=list[PublishSessionResponse])
async def list_sessions(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(
        select(PublishSession)
        .where(PublishSession.company_id == current_user.company_id)
        .order_by(PublishSession.created_at.desc())
    )
    return [PublishSessionResponse.model_validate(s, from_attributes=True) for s in result.scalars().all()]


@router.get("/sessions/{session_id}", response_model=PublishSessionResponse)
async def get_session(session_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = await db.get(PublishSession, session_id)
    if not session or session.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SESSION_NOT_FOUND")
    return PublishSessionResponse.model_validate(session, from_attributes=True)


@router.patch("/sessions/{session_id}/music", response_model=PublishSessionResponse)
async def update_music(
    session_id: uuid.UUID,
    body: MusicWindowUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = await db.get(PublishSession, session_id)
    if not session or session.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SESSION_NOT_FOUND")
    session = await publish_service.update_music_window(db, session, body.model_dump(exclude_unset=True))
    return PublishSessionResponse.model_validate(session, from_attributes=True)


@router.post("/sessions/{session_id}/upload", response_model=PublishSessionResponse)
async def upload(session_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = await db.get(PublishSession, session_id)
    if not session or session.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SESSION_NOT_FOUND")
    try:
        session = await publish_service.upload_media(db, session)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return PublishSessionResponse.model_validate(session, from_attributes=True)


@router.post("/sessions/{session_id}/render", response_model=PublishSessionResponse)
async def render(session_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = await db.get(PublishSession, session_id)
    if not session or session.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SESSION_NOT_FOUND")
    try:
        session = await publish_service.render_video(db, session)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return PublishSessionResponse.model_validate(session, from_attributes=True)


@router.post("/sessions/{session_id}/reserve", response_model=PublishSessionResponse)
async def reserve(session_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = await db.get(PublishSession, session_id)
    if not session or session.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SESSION_NOT_FOUND")
    try:
        session = await publish_service.reserve_credit(db, session)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    await audit_service.log_action(db, current_user.id, current_user.company_id, "publish_session", session.id, "reserve_credit")
    return PublishSessionResponse.model_validate(session, from_attributes=True)


@router.post("/sessions/{session_id}/publish", response_model=PublishSessionResponse)
async def do_publish(session_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = await db.get(PublishSession, session_id)
    if not session or session.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SESSION_NOT_FOUND")
    try:
        session, usage = await publish_service.publish(db, session)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    await audit_service.log_action(db, current_user.id, current_user.company_id, "publish_session", session.id, "publish")
    return PublishSessionResponse.model_validate(session, from_attributes=True)


@router.post("/sessions/{session_id}/cancel", response_model=PublishSessionResponse)
async def cancel(session_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = await db.get(PublishSession, session_id)
    if not session or session.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SESSION_NOT_FOUND")
    try:
        session = await publish_service.cancel_session(db, session)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return PublishSessionResponse.model_validate(session, from_attributes=True)


@router.get("/usages", response_model=list[PublishedUsageResponse])
async def list_usages(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(
        select(PublishedUsage)
        .where(PublishedUsage.company_id == current_user.company_id)
        .order_by(PublishedUsage.created_at.desc())
    )
    return [PublishedUsageResponse.model_validate(u, from_attributes=True) for u in result.scalars().all()]


@router.get("/usages/{usage_id}", response_model=PublishedUsageResponse)
async def get_usage(usage_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetch a single PublishedUsage by ID."""
    usage = await db.get(PublishedUsage, usage_id)
    if not usage or usage.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="USAGE_NOT_FOUND")
    return PublishedUsageResponse.model_validate(usage, from_attributes=True)
