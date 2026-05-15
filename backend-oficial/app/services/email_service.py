"""
email_service.py — Servicio de envío de correos transaccionales.

Usa smtplib + email.mime (stdlib, sin dependencias extra).
Los errores son silenciosos: si falla el email, NO rompe el flujo principal.

Configuración requerida en .env:
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
"""

import asyncio
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import get_settings

logger = logging.getLogger(__name__)


# ── Templates HTML ────────────────────────────────────────────────────────────

def welcome_email(user_name: str) -> tuple[str, str]:
    """Retorna (subject, html_body) para email de bienvenida."""
    subject = "¡Bienvenido a Licenciame! 🎵"
    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:12px;overflow:hidden;border:1px solid #2a2a4a;">
            <!-- Header -->
            <tr><td style="background:linear-gradient(135deg,#6c47ff,#a855f7);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">🎵 Licenciame</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Plataforma de licenciamiento musical</p>
            </td></tr>
            <!-- Body -->
            <tr><td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#e2e8f0;font-size:22px;">¡Hola, {user_name}! 👋</h2>
              <p style="margin:0 0 16px;color:#94a3b8;font-size:15px;line-height:1.6;">
                Tu cuenta en <strong style="color:#a78bfa;">Licenciame</strong> ha sido creada exitosamente.
                Ya puedes explorar nuestro catálogo musical y obtener licencias para tu contenido.
              </p>
              <p style="margin:0 0 24px;color:#94a3b8;font-size:15px;line-height:1.6;">
                Con Licenciame puedes:
              </p>
              <ul style="margin:0 0 24px;padding-left:20px;color:#94a3b8;font-size:15px;line-height:2;">
                <li>🎶 Explorar miles de tracks licenciables</li>
                <li>📄 Obtener licencias para TikTok, Instagram, YouTube y más</li>
                <li>📊 Monitorear el uso de música en tus publicaciones</li>
              </ul>
              <div style="text-align:center;margin:32px 0;">
                <a href="#" style="display:inline-block;background:linear-gradient(135deg,#6c47ff,#a855f7);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                  Ir a mi dashboard →
                </a>
              </div>
            </td></tr>
            <!-- Footer -->
            <tr><td style="padding:24px 40px;border-top:1px solid #2a2a4a;text-align:center;">
              <p style="margin:0;color:#475569;font-size:12px;">
                © 2025 Licenciame · Colombia ·
                <a href="/privacy" style="color:#6c47ff;text-decoration:none;">Privacidad</a> ·
                <a href="/terms" style="color:#6c47ff;text-decoration:none;">Términos</a>
              </p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    """
    return subject, html


def payment_confirmed_email(user_name: str, package_name: str, amount: str) -> tuple[str, str]:
    """Retorna (subject, html_body) para confirmación de pago."""
    subject = f"✅ Pago confirmado — {package_name}"
    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:12px;overflow:hidden;border:1px solid #2a2a4a;">
            <tr><td style="background:linear-gradient(135deg,#059669,#10b981);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">✅ Pago Confirmado</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Licenciame · Plataforma de licenciamiento musical</p>
            </td></tr>
            <tr><td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#e2e8f0;font-size:22px;">¡Hola, {user_name}!</h2>
              <p style="margin:0 0 24px;color:#94a3b8;font-size:15px;line-height:1.6;">
                Tu pago ha sido procesado exitosamente. Aquí están los detalles de tu compra:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;color:#64748b;font-size:13px;border-bottom:1px solid #1e1e3a;">Paquete</td>
                  <td style="padding:16px 20px;color:#e2e8f0;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #1e1e3a;">{package_name}</td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;color:#64748b;font-size:13px;">Total pagado</td>
                  <td style="padding:16px 20px;color:#10b981;font-size:18px;font-weight:700;text-align:right;">{amount}</td>
                </tr>
              </table>
              <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
                Tus créditos han sido acreditados en tu cuenta y ya están disponibles para obtener licencias.
              </p>
              <div style="text-align:center;">
                <a href="#" style="display:inline-block;background:linear-gradient(135deg,#6c47ff,#a855f7);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                  Ver mis créditos →
                </a>
              </div>
            </td></tr>
            <tr><td style="padding:24px 40px;border-top:1px solid #2a2a4a;text-align:center;">
              <p style="margin:0;color:#475569;font-size:12px;">
                © 2025 Licenciame · Colombia ·
                <a href="/privacy" style="color:#6c47ff;text-decoration:none;">Privacidad</a> ·
                <a href="/terms" style="color:#6c47ff;text-decoration:none;">Términos</a>
              </p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    """
    return subject, html


def license_issued_email(user_name: str, track_name: str, platform: str) -> tuple[str, str]:
    """Retorna (subject, html_body) para licencia emitida."""
    subject = f"🎵 Licencia emitida — {track_name} para {platform}"
    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#0f0f0f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:12px;overflow:hidden;border:1px solid #2a2a4a;">
            <tr><td style="background:linear-gradient(135deg,#6c47ff,#a855f7);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">🎵 Licencia Emitida</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Licenciame · Plataforma de licenciamiento musical</p>
            </td></tr>
            <tr><td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#e2e8f0;font-size:22px;">¡Hola, {user_name}!</h2>
              <p style="margin:0 0 24px;color:#94a3b8;font-size:15px;line-height:1.6;">
                Tu licencia ha sido generada correctamente. Aquí están los detalles:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;color:#64748b;font-size:13px;border-bottom:1px solid #1e1e3a;">Track</td>
                  <td style="padding:16px 20px;color:#e2e8f0;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #1e1e3a;">{track_name}</td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;color:#64748b;font-size:13px;">Plataforma</td>
                  <td style="padding:16px 20px;color:#a78bfa;font-size:14px;font-weight:600;text-align:right;">{platform}</td>
                </tr>
              </table>
              <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
                Puedes ver y descargar tu certificado de licencia en tu dashboard en cualquier momento.
              </p>
              <div style="text-align:center;">
                <a href="#" style="display:inline-block;background:linear-gradient(135deg,#6c47ff,#a855f7);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                  Ver mis licencias →
                </a>
              </div>
            </td></tr>
            <tr><td style="padding:24px 40px;border-top:1px solid #2a2a4a;text-align:center;">
              <p style="margin:0;color:#475569;font-size:12px;">
                © 2025 Licenciame · Colombia ·
                <a href="/privacy" style="color:#6c47ff;text-decoration:none;">Privacidad</a> ·
                <a href="/terms" style="color:#6c47ff;text-decoration:none;">Términos</a>
              </p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    """
    return subject, html


# ── Core send function ────────────────────────────────────────────────────────

def _send_email_sync(to: str, subject: str, html_body: str) -> None:
    """Envío síncrono via smtplib. Lanza excepción en caso de error."""
    settings = get_settings()

    if not settings.SMTP_HOST or not settings.SMTP_USER:
        logger.warning("[email_service] SMTP no configurado — omitiendo envío a %s", to)
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM or settings.SMTP_USER
    msg["To"] = to

    msg.attach(MIMEText(html_body, "html", "utf-8"))

    port = int(settings.SMTP_PORT or 587)
    with smtplib.SMTP(settings.SMTP_HOST, port, timeout=10) as server:
        server.ehlo()
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(msg["From"], [to], msg.as_string())

    logger.info("[email_service] Email enviado a %s — subject: %s", to, subject)


async def send_email(to: str, subject: str, html_body: str) -> None:
    """
    Envía un email de forma async-friendly ejecutando el envío SMTP en un
    thread pool para no bloquear el event loop.

    Manejo de errores silencioso: si falla, registra el error pero NO propaga
    la excepción, para no interrumpir el flujo principal.
    """
    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _send_email_sync, to, subject, html_body)
    except Exception as exc:
        logger.error(
            "[email_service] Error al enviar email a %s: %s",
            to,
            exc,
            exc_info=True,
        )
