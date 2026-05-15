"""
Payments API — Wompi sandbox integration.

Endpoints:
  POST /api/v2/payments/initiate          → creates pending package, returns Wompi checkout URL
  POST /api/v2/payments/webhook           → Wompi event handler, activates package on APPROVED
  GET  /api/v2/payments/{reference}/invoice → download PDF invoice
"""
import uuid
import logging
from datetime import date, datetime

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from fastapi.responses import Response
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.config import get_settings
from app.models.auth import User, Company
from app.models.packages import LicensePackage, PackageTemplate
from app.services import payment_service, audit_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/payments", tags=["payments"])


# ─── Schemas ──────────────────────────────────────────────────────────────────

class InitiatePaymentRequest(BaseModel):
    package_template_id: str


class InitiatePaymentResponse(BaseModel):
    checkout_url: str
    reference: str


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/initiate", response_model=InitiatePaymentResponse, status_code=status.HTTP_201_CREATED)
async def initiate_payment(
    body: InitiatePaymentRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Crea una referencia de pago única y devuelve la URL de checkout de Wompi.
    El paquete queda en estado 'pending_payment' hasta que el webhook lo active.
    """
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="NO_COMPANY")

    settings = get_settings()

    # Validate template
    try:
        template_id = uuid.UUID(body.package_template_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="INVALID_TEMPLATE_ID")

    tmpl_result = await db.execute(select(PackageTemplate).where(PackageTemplate.id == template_id))
    tmpl = tmpl_result.scalar_one_or_none()
    if not tmpl or not tmpl.is_active:
        raise HTTPException(status_code=404, detail="TEMPLATE_NOT_FOUND")

    # Generate unique reference
    reference = f"LIC-{uuid.uuid4().hex[:12].upper()}"

    # Create package in pending state — no credits active yet
    start_date = date.today()
    from datetime import timedelta
    end_date = start_date + timedelta(days=tmpl.duration_days)

    pkg = LicensePackage(
        company_id=current_user.company_id,
        template_id=template_id,
        package_name=tmpl.name,
        credits_total=tmpl.credits_total,
        credits_used=0,
        credits_blocked=0,
        start_date=start_date,
        end_date=end_date,
        status="pending_payment",
        idempotency_key=reference,
    )
    db.add(pkg)
    await db.flush()
    await db.commit()

    await audit_service.log_action(
        db, current_user.id, current_user.company_id,
        "license_package", pkg.id, "payment_initiated"
    )

    # Build Wompi URL
    redirect_url = f"{settings.FRONTEND_URL}/payment/result?reference={reference}"
    checkout_url = payment_service.create_wompi_transaction(
        amount_cents=tmpl.price_cop * 100,
        currency="COP",
        reference=reference,
        redirect_url=redirect_url,
    )

    return InitiatePaymentResponse(checkout_url=checkout_url, reference=reference)


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def wompi_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
    x_event_checksum: str = Header(default=""),
):
    """
    Recibe eventos de Wompi. Valida la firma y activa el paquete si el pago fue aprobado.
    """
    body = await request.json()

    # Validate signature
    if x_event_checksum:
        if not payment_service.verify_wompi_webhook(x_event_checksum, body):
            logger.warning("Wompi webhook signature mismatch")
            raise HTTPException(status_code=400, detail="INVALID_SIGNATURE")

    event_type = body.get("event", "")
    if event_type != "transaction.updated":
        return {"status": "ignored"}

    transaction = body.get("data", {}).get("transaction", {})
    tx_status = transaction.get("status", "")
    reference = transaction.get("reference", "")

    if tx_status != "APPROVED" or not reference:
        return {"status": "not_approved"}

    # Find the pending package by idempotency_key (= reference)
    result = await db.execute(
        select(LicensePackage).where(LicensePackage.idempotency_key == reference)
    )
    pkg = result.scalar_one_or_none()

    if not pkg:
        logger.warning("Wompi webhook: no package found for reference %s", reference)
        return {"status": "package_not_found"}

    if pkg.status == "active":
        return {"status": "already_active"}

    pkg.status = "active"
    await db.commit()
    logger.info("Package %s activated via Wompi webhook (ref=%s)", pkg.id, reference)

    return {"status": "activated"}


@router.get("/{reference}/invoice")
async def download_invoice(
    reference: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Genera y descarga la factura PDF de la compra."""
    result = await db.execute(
        select(LicensePackage).where(LicensePackage.idempotency_key == reference)
    )
    pkg = result.scalar_one_or_none()
    if not pkg:
        raise HTTPException(status_code=404, detail="PURCHASE_NOT_FOUND")

    # Only owner company can download
    if pkg.company_id != current_user.company_id:
        raise HTTPException(status_code=403, detail="FORBIDDEN")

    # Get company name
    company_result = await db.execute(select(Company).where(Company.id == pkg.company_id))
    company = company_result.scalar_one_or_none()

    tmpl_result = await db.execute(select(PackageTemplate).where(PackageTemplate.id == pkg.template_id))
    tmpl = tmpl_result.scalar_one_or_none()

    purchase_data = {
        "reference": reference,
        "package_name": pkg.package_name,
        "company_name": company.name if company else "",
        "amount_cop": tmpl.price_cop if tmpl else 0,
        "date": str(pkg.start_date),
        "status": "APROBADO" if pkg.status == "active" else pkg.status.upper(),
    }

    pdf_bytes = payment_service.generate_invoice_pdf(purchase_data)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="factura-{reference}.pdf"',
        },
    )
