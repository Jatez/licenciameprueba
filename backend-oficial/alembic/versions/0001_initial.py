"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-03-24 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── companies ──
    op.create_table(
        "companies",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("country_code", sa.String(2), nullable=False),
        sa.Column("status", sa.String(32), nullable=False, server_default="active"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    # ── users ──
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("role", sa.String(32), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("status", sa.String(32), nullable=False, server_default="active"),
        sa.Column("failed_login_attempts", sa.Integer, server_default=sa.text("0"), nullable=False),
        sa.Column("locked_until", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    # ── refresh_tokens ──
    op.create_table(
        "refresh_tokens",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("token_hash", sa.String(255), nullable=False, index=True),
        sa.Column("family_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("replaced_by_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("refresh_tokens.id"), nullable=True),
        sa.Column("is_revoked", sa.Boolean, server_default=sa.text("false"), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    # ── tracks ──
    op.create_table(
        "tracks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("artist", sa.String(500), nullable=False),
        sa.Column("isrc", sa.String(20), nullable=True),
        sa.Column("s3_key_master", sa.String(1000), nullable=False),
        sa.Column("s3_key_preview", sa.String(1000), nullable=True),
        sa.Column("duration_seconds", sa.Integer, nullable=False),
        sa.Column("bpm", sa.Integer, nullable=True),
        sa.Column("genre", sa.String(100), nullable=True),
        sa.Column("rights_reference", sa.String(255), nullable=False),
        sa.Column("active", sa.Boolean, server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    # ── track_license_rules ──
    op.create_table(
        "track_license_rules",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("track_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("tracks.id"), nullable=False),
        sa.Column("allowed_platforms", postgresql.JSONB, nullable=False),
        sa.Column("allowed_content_types", postgresql.JSONB, nullable=False),
        sa.Column("territories", postgresql.JSONB, nullable=True),
        sa.Column("valid_from", sa.Date, nullable=False),
        sa.Column("valid_until", sa.Date, nullable=True),
        sa.Column("terms_json", postgresql.JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    # ── social_accounts ──
    op.create_table(
        "social_accounts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=False),
        sa.Column("platform", sa.String(32), nullable=False),
        sa.Column("external_account_id", sa.String(255), nullable=False),
        sa.Column("username", sa.String(255), nullable=True),
        sa.Column("access_token_encrypted", sa.Text, nullable=True),
        sa.Column("refresh_token_encrypted", sa.Text, nullable=True),
        sa.Column("token_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("status", sa.String(32), nullable=False, server_default="connected"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("company_id", "platform", "external_account_id", name="uq_social_account"),
    )

    # ── package_templates ──
    op.create_table(
        "package_templates",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("code", sa.String(100), unique=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("credits_total", sa.Integer, nullable=False),
        sa.Column("duration_days", sa.Integer, nullable=False),
        sa.Column("catalog_scope", sa.String(32), nullable=False, server_default="full_catalog"),
        sa.Column("active_track_limit", sa.Integer, nullable=True),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    # ── license_packages ──
    op.create_table(
        "license_packages",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=False),
        sa.Column("template_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("package_templates.id"), nullable=False),
        sa.Column("package_name", sa.String(255), nullable=False),
        sa.Column("credits_total", sa.Integer, nullable=False),
        sa.Column("credits_used", sa.Integer, server_default=sa.text("0"), nullable=False),
        sa.Column("credits_blocked", sa.Integer, server_default=sa.text("0"), nullable=False),
        sa.Column("start_date", sa.Date, nullable=False),
        sa.Column("end_date", sa.Date, nullable=False),
        sa.Column("status", sa.String(32), nullable=False, server_default="active"),
        sa.Column("idempotency_key", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("company_id", "idempotency_key", name="uq_package_purchase_idempotency"),
        sa.CheckConstraint("credits_used >= 0", name="ck_credits_used_positive"),
        sa.CheckConstraint("credits_blocked >= 0", name="ck_credits_blocked_positive"),
        sa.CheckConstraint("credits_used + credits_blocked <= credits_total", name="ck_credits_within_total"),
    )

    # ── package_track_entitlements ──
    op.create_table(
        "package_track_entitlements",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("package_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("license_packages.id"), nullable=False),
        sa.Column("track_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("tracks.id"), nullable=False),
        sa.Column("activated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("activated_by_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.UniqueConstraint("package_id", "track_id", name="uq_package_track"),
    )

    # ── publish_sessions ──
    op.create_table(
        "publish_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=False),
        sa.Column("created_by_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("track_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("tracks.id"), nullable=False),
        sa.Column("social_account_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("social_accounts.id"), nullable=False),
        sa.Column("content_type", sa.String(50), nullable=False),
        sa.Column("caption", sa.Text, nullable=True),
        sa.Column("input_video_key", sa.String(1000), nullable=True),
        sa.Column("rendered_video_key", sa.String(1000), nullable=True),
        sa.Column("music_start_sec", sa.Numeric(8, 3), server_default=sa.text("0"), nullable=False),
        sa.Column("music_end_sec", sa.Numeric(8, 3), server_default=sa.text("30"), nullable=False),
        sa.Column("music_volume", sa.Numeric(4, 2), server_default=sa.text("1.00"), nullable=False),
        sa.Column("fade_in_sec", sa.Numeric(5, 2), server_default=sa.text("0"), nullable=False),
        sa.Column("fade_out_sec", sa.Numeric(5, 2), server_default=sa.text("0"), nullable=False),
        sa.Column("status", sa.String(40), nullable=False, server_default="draft"),
        sa.Column("reservation_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("failure_reason", sa.Text, nullable=True),
        sa.Column("idempotency_key", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("company_id", "idempotency_key", name="uq_session_idempotency"),
    )

    # ── published_usages ──
    op.create_table(
        "published_usages",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=False),
        sa.Column("package_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("license_packages.id"), nullable=False),
        sa.Column("track_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("tracks.id"), nullable=True),
        sa.Column("publish_session_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("publish_sessions.id"), nullable=True),
        sa.Column("social_account_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("social_accounts.id"), nullable=False),
        sa.Column("platform", sa.String(32), nullable=False),
        sa.Column("content_type", sa.String(50), nullable=False),
        sa.Column("coverage_type", sa.String(24), nullable=False),
        sa.Column("status", sa.String(40), nullable=False, server_default="published"),
        sa.Column("external_media_id", sa.String(255), nullable=True),
        sa.Column("external_url", sa.Text, nullable=True),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("evidence_json", postgresql.JSONB, nullable=True),
        sa.Column("idempotency_key", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("company_id", "idempotency_key", name="uq_usage_idempotency"),
    )

    # ── external_contents (sin columnas views/likes/comments/shares — se agregan en la siguiente migración) ──
    op.create_table(
        "external_contents",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=False),
        sa.Column("social_account_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("social_accounts.id"), nullable=True),
        sa.Column("platform", sa.String(32), nullable=False),
        sa.Column("content_type", sa.String(50), nullable=False),
        sa.Column("external_media_id", sa.String(255), nullable=False),
        sa.Column("external_url", sa.Text, nullable=True),
        sa.Column("posted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("raw_payload_json", postgresql.JSONB, nullable=True),
        sa.Column("reconciliation_status", sa.String(32), nullable=False, server_default="unmatched"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("company_id", "platform", "external_media_id", name="uq_external_content"),
    )

    # ── audio_detections ──
    op.create_table(
        "audio_detections",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=False),
        sa.Column("publish_session_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("publish_sessions.id"), nullable=True),
        sa.Column("external_content_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("external_contents.id"), nullable=True),
        sa.Column("detector_provider", sa.String(50), nullable=False),
        sa.Column("detection_status", sa.String(32), nullable=False),
        sa.Column("matched_track_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("tracks.id"), nullable=True),
        sa.Column("confidence_score", sa.Numeric(5, 4), nullable=True),
        sa.Column("matched_title", sa.String(500), nullable=True),
        sa.Column("matched_artist", sa.String(500), nullable=True),
        sa.Column("raw_result_json", postgresql.JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    # ── usage_metrics_snapshots ──
    op.create_table(
        "usage_metrics_snapshots",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("usage_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("published_usages.id"), nullable=False),
        sa.Column("fetched_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("impressions", sa.Integer, server_default=sa.text("0"), nullable=False),
        sa.Column("reach", sa.Integer, server_default=sa.text("0"), nullable=False),
        sa.Column("views", sa.Integer, server_default=sa.text("0"), nullable=False),
        sa.Column("likes", sa.Integer, server_default=sa.text("0"), nullable=False),
        sa.Column("comments", sa.Integer, server_default=sa.text("0"), nullable=False),
        sa.Column("shares", sa.Integer, server_default=sa.text("0"), nullable=False),
        sa.Column("saves", sa.Integer, server_default=sa.text("0"), nullable=False),
        sa.Column("raw_payload_json", postgresql.JSONB, nullable=True),
    )

    # ── recommendation_snapshots ──
    op.create_table(
        "recommendation_snapshots",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=False),
        sa.Column("recommended_for_date", sa.Date, nullable=False),
        sa.Column("tracks_json", postgresql.JSONB, nullable=False),
        sa.Column("themes_json", postgresql.JSONB, nullable=False),
        sa.Column("rationale_json", postgresql.JSONB, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    # ── audit_logs ──
    op.create_table(
        "audit_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("actor_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=True),
        sa.Column("entity_type", sa.String(100), nullable=False),
        sa.Column("entity_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("action", sa.String(100), nullable=False),
        sa.Column("request_id", sa.String(100), nullable=True),
        sa.Column("metadata_json", postgresql.JSONB, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("recommendation_snapshots")
    op.drop_table("usage_metrics_snapshots")
    op.drop_table("audio_detections")
    op.drop_table("external_contents")
    op.drop_table("published_usages")
    op.drop_table("publish_sessions")
    op.drop_table("package_track_entitlements")
    op.drop_table("license_packages")
    op.drop_table("package_templates")
    op.drop_table("social_accounts")
    op.drop_table("track_license_rules")
    op.drop_table("tracks")
    op.drop_table("refresh_tokens")
    op.drop_table("users")
    op.drop_table("companies")
