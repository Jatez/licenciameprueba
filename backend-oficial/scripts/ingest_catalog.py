#!/usr/bin/env python3
"""
ingest_catalog.py — Importa canciones desde un manifest S3 a Licenciame.

Uso:
  # Desde S3 (requiere AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY en env o ~/.aws/credentials)
  python scripts/ingest_catalog.py --bucket licenciame-catalog-ingest --manifest batch_2025_05/manifest.json

  # Desde archivo local (para pruebas)
  python scripts/ingest_catalog.py --local /ruta/al/manifest.json

  # Dry-run (muestra qué haría sin escribir en DB)
  python scripts/ingest_catalog.py --bucket ... --manifest ... --dry-run

Variables de entorno necesarias (o en .env):
  DATABASE_URL_SYNC  — postgresql://user:pass@host/db
  AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_DEFAULT_REGION  (si usas S3)
"""

import argparse
import json
import sys
import os
from datetime import date, datetime, timezone
from pathlib import Path

# Permite correr desde backend/ sin instalar el paquete
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / ".env")

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.catalog import Track, TrackLicenseRule


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_manifest_local(path: str) -> list[dict]:
    with open(path) as f:
        return json.load(f)


def load_manifest_s3(bucket: str, key: str) -> list[dict]:
    try:
        import boto3
    except ImportError:
        print("ERROR: boto3 no instalado. Corre: pip install boto3")
        sys.exit(1)

    s3 = boto3.client("s3")
    obj = s3.get_object(Bucket=bucket, Key=key)
    return json.load(obj["Body"])


def parse_date(val) -> date | None:
    if val is None:
        return None
    if isinstance(val, date):
        return val
    return date.fromisoformat(val)


def ingest(entries: list[dict], engine, dry_run: bool = False):
    created = []
    updated = []
    skipped = []
    errors = []

    with Session(engine) as session:
        for entry in entries:
            isrc = entry.get("isrc")
            title = entry.get("title", "").strip()

            if not title:
                errors.append({"isrc": isrc, "error": "title vacío"})
                continue

            # Buscar por ISRC si existe, sino por title+artist (upsert)
            track = None
            if isrc:
                track = session.execute(
                    select(Track).where(Track.isrc == isrc)
                ).scalar_one_or_none()

            if track is None:
                track = session.execute(
                    select(Track).where(
                        Track.title == title,
                        Track.artist == entry.get("artist", "")
                    )
                ).scalar_one_or_none()

            is_new = track is None

            if is_new:
                track = Track(
                    title=title,
                    artist=entry.get("artist", ""),
                    isrc=isrc,
                    s3_key_master=entry.get("s3_key_master", ""),
                    s3_key_preview=entry.get("s3_key_preview"),
                    duration_seconds=int(entry.get("duration_seconds", 0)),
                    bpm=entry.get("bpm"),
                    genre=entry.get("genre"),
                    rights_reference=entry.get("rights_reference", ""),
                    active=True,
                )
            else:
                # Actualizar campos que pueden cambiar
                track.s3_key_master = entry.get("s3_key_master", track.s3_key_master)
                track.s3_key_preview = entry.get("s3_key_preview", track.s3_key_preview)
                track.bpm = entry.get("bpm", track.bpm)
                track.genre = entry.get("genre", track.genre)
                track.rights_reference = entry.get("rights_reference", track.rights_reference)
                track.active = True

            if not dry_run:
                session.add(track)
                session.flush()  # genera el ID si es nuevo

            # License rules
            rules_data = entry.get("license_rules")
            if rules_data and not dry_run and is_new:
                rule = TrackLicenseRule(
                    track_id=track.id,
                    allowed_platforms=rules_data.get("allowed_platforms", []),
                    allowed_content_types=rules_data.get("allowed_content_types", []),
                    territories=rules_data.get("territories"),
                    valid_from=parse_date(rules_data.get("valid_from")) or date.today(),
                    valid_until=parse_date(rules_data.get("valid_until")),
                    terms_json=rules_data.get("terms_json"),
                )
                session.add(rule)

            if is_new:
                created.append(isrc or title)
            else:
                updated.append(isrc or title)

        if not dry_run:
            session.commit()

    return created, updated, skipped, errors


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Ingest catalog from S3 manifest into Licenciame")
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--local", metavar="PATH", help="Ruta local al manifest.json")
    source.add_argument("--bucket", metavar="BUCKET", help="S3 bucket name")
    parser.add_argument("--manifest", metavar="KEY", help="S3 key del manifest.json (requerido con --bucket)")
    parser.add_argument("--dry-run", action="store_true", help="Simula sin escribir en DB")
    args = parser.parse_args()

    if args.bucket and not args.manifest:
        parser.error("--manifest es requerido cuando usas --bucket")

    # Cargar manifest
    if args.local:
        print(f"Cargando manifest local: {args.local}")
        entries = load_manifest_local(args.local)
    else:
        print(f"Cargando manifest desde s3://{args.bucket}/{args.manifest}")
        entries = load_manifest_s3(args.bucket, args.manifest)

    print(f"Entradas encontradas: {len(entries)}")

    if args.dry_run:
        print("--- DRY RUN (sin cambios en DB) ---")

    # Conectar DB
    settings = get_settings()
    engine = create_engine(settings.DATABASE_URL_SYNC, echo=False)

    created, updated, skipped, errors = ingest(entries, engine, dry_run=args.dry_run)

    print(f"\nResultado:")
    print(f"  Creadas:     {len(created)}")
    print(f"  Actualizadas:{len(updated)}")
    print(f"  Errores:     {len(errors)}")

    if errors:
        print("\nErrores:")
        for e in errors:
            print(f"  - {e}")

    if args.dry_run:
        print("\n(Dry-run: nada fue guardado)")
    else:
        print("\nImportación completada.")


if __name__ == "__main__":
    main()
