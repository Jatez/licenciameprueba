"""
ACRCloud audio fingerprinting integration.
Identifies audio tracks by sending audio samples to the ACRCloud API.
"""
import base64
import hashlib
import hmac
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.catalog import Track
from app.models.monitoring import AudioDetection, ExternalContent


def _build_signature(method: str, uri: str, access_key: str, access_secret: str, data_type: str, sig_version: str, timestamp: str) -> str:
    """Build HMAC-SHA1 signature for ACRCloud API."""
    string_to_sign = "\n".join([method, uri, access_key, data_type, sig_version, timestamp])
    sign = hmac.new(
        access_secret.encode("ascii"),
        string_to_sign.encode("ascii"),
        digestmod=hashlib.sha1,
    ).digest()
    return base64.b64encode(sign).decode("ascii")


async def identify_audio(audio_bytes: bytes, audio_format: str = "wav") -> dict:
    """
    Send audio bytes to ACRCloud and return the identification result.
    Returns the raw JSON response from ACRCloud.
    """
    settings = get_settings()

    if not settings.ACRCLOUD_HOST or not settings.ACRCLOUD_ACCESS_KEY:
        raise ValueError("ACRCloud credentials not configured")

    timestamp = str(int(time.time()))
    data_type = "audio"
    signature = _build_signature(
        "POST",
        "/v1/identify",
        settings.ACRCLOUD_ACCESS_KEY,
        settings.ACRCLOUD_ACCESS_SECRET,
        data_type,
        "1",
        timestamp,
    )

    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            f"https://{settings.ACRCLOUD_HOST}/v1/identify",
            data={
                "access_key": settings.ACRCLOUD_ACCESS_KEY,
                "sample_bytes": str(len(audio_bytes)),
                "timestamp": timestamp,
                "signature": signature,
                "data_type": data_type,
                "signature_version": "1",
            },
            files={"sample": ("sample." + audio_format, audio_bytes, "application/octet-stream")},
        )
        resp.raise_for_status()
        return resp.json()


async def identify_from_file(file_path: str) -> dict:
    """Identify audio from a local file path."""
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"Audio file not found: {file_path}")
    audio_bytes = path.read_bytes()
    suffix = path.suffix.lstrip(".")
    return await identify_audio(audio_bytes, audio_format=suffix or "wav")


def parse_acrcloud_result(result: dict) -> list[dict]:
    """
    Parse ACRCloud response into a list of matched tracks.
    Each item has: title, artist, isrc, spotify_id, score, album, label, release_date
    """
    matches = []
    status_code = result.get("status", {}).get("code", -1)

    if status_code != 0:
        return matches

    metadata = result.get("metadata", {})
    music_list = metadata.get("music", [])

    for music in music_list:
        match = {
            "title": music.get("title", ""),
            "artist": ", ".join(a.get("name", "") for a in music.get("artists", [])),
            "album": music.get("album", {}).get("name", ""),
            "label": music.get("label", ""),
            "release_date": music.get("release_date", ""),
            "score": music.get("score", 0),
            "duration_ms": music.get("duration_ms", 0),
            "acrid": music.get("acrid", ""),
            "isrc": "",
            "spotify_id": "",
        }

        # Extract ISRC from external_ids
        external_ids = music.get("external_ids", {})
        if "isrc" in external_ids:
            match["isrc"] = external_ids["isrc"]

        # Extract Spotify ID from external_metadata
        external_metadata = music.get("external_metadata", {})
        spotify = external_metadata.get("spotify", {})
        if "track" in spotify:
            track_info = spotify["track"]
            match["spotify_id"] = track_info.get("id", "")

        matches.append(match)

    return matches


async def identify_and_match(
    db: AsyncSession,
    company_id: uuid.UUID,
    external_content: ExternalContent,
    audio_bytes: bytes | None = None,
    audio_format: str = "wav",
    *,
    preloaded_result: dict | None = None,
) -> list["AudioDetection"]:
    """
    Full pipeline: identify audio via ACRCloud, match against local catalog,
    create one detection record PER song found.

    Returns a list of AudioDetection records (one per ACRCloud match).
    If no matches, returns a single "no_match" detection.
    
    Pass preloaded_result to reuse an existing ACRCloud response and avoid a duplicate API call.
    """
    # 1. Call ACRCloud (or use preloaded result)
    if preloaded_result is not None:
        raw_result = preloaded_result
    else:
        if audio_bytes is None:
            raise ValueError("Either audio_bytes or preloaded_result must be provided")
        raw_result = await identify_audio(audio_bytes, audio_format)
    matches = parse_acrcloud_result(raw_result)

    if not matches:
        # No match at all
        detection = AudioDetection(
            company_id=company_id,
            external_content_id=external_content.id,
            detector_provider="acrcloud",
            detection_status="no_match",
            matched_track_id=None,
            confidence_score=0.0,
            matched_title=None,
            matched_artist=None,
            raw_result_json=raw_result,
            created_at=datetime.now(timezone.utc),
        )
        db.add(detection)
        external_content.reconciliation_status = "unmatched"
        await db.flush()
        return [detection]

    # 2. Create one detection per match
    detections: list[AudioDetection] = []
    best_status = "unmatched"  # track the best status for content reconciliation

    for m in matches:
        matched_track: Track | None = None
        confidence = m["score"] / 100.0

        # Try ISRC match
        if m["isrc"]:
            result = await db.execute(
                select(Track).where(Track.isrc == m["isrc"], Track.active == True)
            )
            matched_track = result.scalar_one_or_none()

        # Try title match if no ISRC match
        if not matched_track and m["title"]:
            result = await db.execute(
                select(Track).where(
                    Track.title.ilike(m["title"]),
                    Track.active == True,
                )
            )
            matched_track = result.scalar_one_or_none()

        # Determine status for this detection
        if matched_track:
            detection_status = "matched" if confidence >= 0.80 else "uncertain"
        else:
            detection_status = "uncertain"

        detection = AudioDetection(
            company_id=company_id,
            external_content_id=external_content.id,
            detector_provider="acrcloud",
            detection_status=detection_status,
            matched_track_id=matched_track.id if matched_track else None,
            confidence_score=round(confidence, 4),
            matched_title=m["title"],
            matched_artist=m["artist"],
            raw_result_json=raw_result if len(detections) == 0 else None,  # store raw only on first
            created_at=datetime.now(timezone.utc),
        )
        db.add(detection)
        detections.append(detection)

        # Track best status: matched > uncertain > unmatched
        if detection_status == "matched":
            best_status = "matched_usage"
        elif detection_status == "uncertain" and best_status != "matched_usage":
            best_status = "manual_review"

    # 3. Update external content reconciliation status based on best detection
    external_content.reconciliation_status = best_status

    await db.flush()
    return detections
