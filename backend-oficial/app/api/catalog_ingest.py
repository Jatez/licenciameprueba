"""
POST /api/v1/catalog/ingest
Importa un lote de canciones desde un manifest JSON (body directo o S3).
Solo accesible para admin / super_admin.

Body (application/json):
  {
    "source": "body",           // "body" | "s3"
    "entries": [...],           // requerido si source="body"
    "s3_bucket": "...",         // requerido si source="s3"
    "s3_key": "batch/manifest.json"  // requerido si source="s3"
  }
"""

from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.catalog import Track, TrackLicenseRule

router = APIRouter(prefix="/catalog", tags=["catalog-ingest"])


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class LicenseRulesPayload(BaseModel):
    allowed_platforms: list[str] = []
    allowed_content_types: list[str] = []
    territories: list[str] | None = None
    valid_from: date | None = None
    valid_until: date | None = None
    terms_json: dict | None = None


class TrackEntry(BaseModel):
    isrc: str | None = None
    title: str
    artist: str
    duration_seconds: int = 0
    bpm: int | None = None
    genre: str | None = None
    rights_reference: str = ""
    s3_key_master: str = ""
    s3_key_preview: str | None = None
    license_rules: LicenseRulesPayload | None = None


class IngestRequest(BaseModel):
    source: str = Field(default="body", pattern="^(body|s3)$")
    entries: list[TrackEntry] | None = None
    s3_bucket: str | None = None
    s3_key: str | None = None
    dry_run: bool = False


class IngestResult(BaseModel):
    created: int
    updated: int
    errors: list[dict]
    dry_run: bool


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _load_from_s3(bucket: str, key: str) -> list[dict]:
    try:
        import boto3, json
        import asyncio
        loop = asyncio.get_event_loop()
        def _fetch():
            s3 = boto3.client("s3")
            obj = s3.get_object(Bucket=bucket, Key=key)
            return json.load(obj["Body"])
        return await loop.run_in_executor(None, _fetch)
    except ImportError:
        raise HTTPException(status_code=500, detail="boto3 no instalado en el servidor")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error leyendo S3: {e}")


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@router.post(
    "/ingest",
    response_model=IngestResult,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_roles("admin", "super_admin"))],
)
async def ingest_catalog(body: IngestRequest, db: AsyncSession = Depends(get_db)):
    # Obtener entradas
    if body.source == "s3":
        if not body.s3_bucket or not body.s3_key:
            raise HTTPException(400, "s3_bucket y s3_key son requeridos para source=s3")
        raw = await _load_from_s3(body.s3_bucket, body.s3_key)
        entries = [TrackEntry(**e) for e in raw]
    else:
        if not body.entries:
            raise HTTPException(400, "entries es requerido para source=body")
        entries = body.entries

    created_count = 0
    updated_count = 0
    errors: list[dict] = []

    for entry in entries:
        try:
            # Buscar existente por ISRC o title+artist
            track = None
            if entry.isrc:
                result = await db.execute(select(Track).where(Track.isrc == entry.isrc))
                track = result.scalar_one_or_none()

            if track is None:
                result = await db.execute(
                    select(Track).where(Track.title == entry.title, Track.artist == entry.artist)
                )
                track = result.scalar_one_or_none()

            is_new = track is None

            if is_new:
                track = Track(
                    title=entry.title,
                    artist=entry.artist,
                    isrc=entry.isrc,
                    s3_key_master=entry.s3_key_master,
                    s3_key_preview=entry.s3_key_preview,
                    duration_seconds=entry.duration_seconds,
                    bpm=entry.bpm,
                    genre=entry.genre,
                    rights_reference=entry.rights_reference,
                    active=True,
                )
            else:
                track.s3_key_master = entry.s3_key_master or track.s3_key_master
                track.s3_key_preview = entry.s3_key_preview or track.s3_key_preview
                track.bpm = entry.bpm if entry.bpm is not None else track.bpm
                track.genre = entry.genre or track.genre
                track.rights_reference = entry.rights_reference or track.rights_reference
                track.active = True

            if not body.dry_run:
                db.add(track)
                await db.flush()

                # License rule solo en tracks nuevos
                if is_new and entry.license_rules:
                    lr = entry.license_rules
                    rule = TrackLicenseRule(
                        track_id=track.id,
                        allowed_platforms=lr.allowed_platforms,
                        allowed_content_types=lr.allowed_content_types,
                        territories=lr.territories,
                        valid_from=lr.valid_from or date.today(),
                        valid_until=lr.valid_until,
                        terms_json=lr.terms_json,
                    )
                    db.add(rule)

            if is_new:
                created_count += 1
            else:
                updated_count += 1

        except Exception as e:
            errors.append({"isrc": entry.isrc, "title": entry.title, "error": str(e)})

    if not body.dry_run and not errors:
        await db.commit()

    return IngestResult(
        created=created_count,
        updated=updated_count,
        errors=errors,
        dry_run=body.dry_run,
    )
