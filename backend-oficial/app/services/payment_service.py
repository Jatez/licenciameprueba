"""
Wompi payment service — sandbox integration.
"""
import hashlib
import hmac
import io
import uuid
from datetime import datetime
from typing import Any

from app.core.config import get_settings

WOMPI_SANDBOX_BASE = "https://checkout.wompi.co/p/"


def create_wompi_transaction(
    amount_cents: int,
    currency: str,
    reference: str,
    redirect_url: str,
) -> str:
    """
    Build the Wompi sandbox checkout URL.
    Returns the full URL the user should be redirected to.
    """
    settings = get_settings()
    public_key = settings.WOMPI_PUBLIC_KEY

    params = (
        f"?public-key={public_key}"
        f"&currency={currency}"
        f"&amount-in-cents={amount_cents}"
        f"&reference={reference}"
        f"&redirect-url={redirect_url}"
    )
    return WOMPI_SANDBOX_BASE + params


def verify_wompi_webhook(signature: str, data: dict[str, Any]) -> bool:
    """
    Validate Wompi webhook signature.
    Wompi sends: properties concatenated + timestamp + events_secret, SHA-256.
    Signature header format: "checksum=<hex>"
    """
    settings = get_settings()
    secret = settings.WOMPI_EVENTS_SECRET

    # Wompi signature: sha256 of (transaction.id + transaction.status + transaction.amount_in_cents + timestamp + secret)
    transaction = data.get("data", {}).get("transaction", {})
    ts = data.get("timestamp", "")
    raw = (
        str(transaction.get("id", ""))
        + str(transaction.get("status", ""))
        + str(transaction.get("amount_in_cents", ""))
        + str(ts)
        + secret
    )
    expected = hmac.new(secret.encode(), raw.encode(), hashlib.sha256).hexdigest()  # noqa
    # Strip "checksum=" prefix if present
    received = signature.removeprefix("checksum=")
    return hmac.compare_digest(expected, received)


def generate_invoice_pdf(purchase_data: dict[str, Any]) -> bytes:
    """
    Generate a simple invoice PDF using reportlab.
    purchase_data keys: reference, package_name, amount_cop, company_name, date
    """
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import cm
    from reportlab.pdfgen import canvas as rl_canvas

    buf = io.BytesIO()
    c = rl_canvas.Canvas(buf, pagesize=A4)
    width, height = A4

    # Header
    c.setFont("Helvetica-Bold", 20)
    c.drawString(2 * cm, height - 3 * cm, "Licenciame")
    c.setFont("Helvetica", 11)
    c.drawString(2 * cm, height - 3.8 * cm, "Factura de compra")

    c.setFont("Helvetica-Bold", 13)
    c.drawString(2 * cm, height - 5.5 * cm, "Detalles de la compra")

    y = height - 6.5 * cm
    fields = [
        ("Referencia", purchase_data.get("reference", "")),
        ("Paquete", purchase_data.get("package_name", "")),
        ("Empresa", purchase_data.get("company_name", "")),
        ("Monto (COP)", f"${purchase_data.get('amount_cop', 0):,.0f}"),
        ("Fecha", purchase_data.get("date", str(datetime.now().date()))),
        ("Estado", purchase_data.get("status", "APROBADO")),
    ]
    c.setFont("Helvetica", 11)
    for label, value in fields:
        c.setFont("Helvetica-Bold", 11)
        c.drawString(2 * cm, y, f"{label}:")
        c.setFont("Helvetica", 11)
        c.drawString(7 * cm, y, str(value))
        y -= 0.8 * cm

    # Footer
    c.setFont("Helvetica", 9)
    c.drawString(2 * cm, 2 * cm, "Este documento es una factura de compra generada automáticamente por Licenciame.")

    c.save()
    return buf.getvalue()
