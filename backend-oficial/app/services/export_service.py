"""Export service — genera PDFs y CSVs para reportes de licencias y compras."""
from __future__ import annotations

import io
import csv
from datetime import datetime
from typing import Any

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT


# ── Helpers ───────────────────────────────────────────────────────────────────

BRAND_COLOR = colors.HexColor("#6C2BD9")
HEADER_BG = colors.HexColor("#F3EEFF")
ALT_ROW = colors.HexColor("#FAFAFA")


def _build_pdf(elements: list, pagesize=A4) -> bytes:
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=pagesize,
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )
    doc.build(elements)
    return buf.getvalue()


def _styles():
    s = getSampleStyleSheet()
    title = ParagraphStyle(
        "licTitle",
        parent=s["Heading1"],
        fontSize=18,
        textColor=BRAND_COLOR,
        spaceAfter=4,
    )
    sub = ParagraphStyle(
        "licSub",
        parent=s["Normal"],
        fontSize=9,
        textColor=colors.grey,
        spaceAfter=12,
    )
    return title, sub, s


def _table_style(n_rows: int) -> TableStyle:
    cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_COLOR),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 8),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, ALT_ROW]),
        ("FONTSIZE", (0, 1), (-1, -1), 7.5),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.lightgrey),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ]
    return TableStyle(cmds)


# ── Public functions ──────────────────────────────────────────────────────────


def export_licenses_pdf(licenses: list[dict[str, Any]], company_name: str) -> bytes:
    """Tabla de licencias en PDF (A4 landscape)."""
    title_style, sub_style, _ = _styles()

    now = datetime.utcnow().strftime("%d/%m/%Y %H:%M UTC")
    elements = [
        Paragraph(f"Reporte de Licencias — {company_name}", title_style),
        Paragraph(f"Generado: {now}  ·  Total: {len(licenses)} registros", sub_style),
        Spacer(1, 0.3 * cm),
    ]

    headers = ["Fecha", "Track", "Artista", "Plataforma", "Estado", "Créditos usados"]
    rows = [headers]
    for lic in licenses:
        issued = lic.get("issued_at") or lic.get("published_at") or ""
        if issued:
            try:
                issued = datetime.fromisoformat(issued.replace("Z", "+00:00")).strftime("%d/%m/%Y")
            except Exception:
                pass
        rows.append([
            issued,
            (lic.get("track_title") or "")[:40],
            (lic.get("artist") or "")[:30],
            lic.get("platform") or "-",
            lic.get("status") or "-",
            str(lic.get("credits_consumed") or lic.get("credits_used") or 0),
        ])

    col_widths = [3 * cm, 6 * cm, 5 * cm, 3.5 * cm, 3 * cm, 3.5 * cm]
    tbl = Table(rows, colWidths=col_widths, repeatRows=1)
    tbl.setStyle(_table_style(len(rows)))
    elements.append(tbl)

    return _build_pdf(elements, pagesize=landscape(A4))


def export_licenses_csv(licenses: list[dict[str, Any]]) -> bytes:
    """CSV de licencias."""
    buf = io.StringIO()
    fieldnames = [
        "id", "issued_at", "track_title", "artist", "platform",
        "status", "usage_type", "credits_consumed",
    ]
    writer = csv.DictWriter(buf, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    for lic in licenses:
        row = {
            "id": lic.get("id", ""),
            "issued_at": lic.get("issued_at") or lic.get("published_at") or "",
            "track_title": lic.get("track_title") or lic.get("track", {}).get("title", "") if isinstance(lic.get("track"), dict) else lic.get("track_title", ""),
            "artist": lic.get("artist", ""),
            "platform": lic.get("platform", ""),
            "status": lic.get("status", ""),
            "usage_type": lic.get("usage_type") or lic.get("license_type", ""),
            "credits_consumed": lic.get("credits_consumed") or lic.get("credits_used") or 0,
        }
        writer.writerow(row)
    return buf.getvalue().encode("utf-8-sig")


def export_purchases_csv(packages: list[dict[str, Any]]) -> bytes:
    """CSV de historial de compras."""
    buf = io.StringIO()
    fieldnames = [
        "id", "package_name", "credits_total", "credits_used",
        "credits_blocked", "price_cop", "start_date", "end_date", "status",
    ]
    writer = csv.DictWriter(buf, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    for pkg in packages:
        writer.writerow({
            "id": pkg.get("id", ""),
            "package_name": pkg.get("package_name", ""),
            "credits_total": pkg.get("credits_total", 0),
            "credits_used": pkg.get("credits_used", 0),
            "credits_blocked": pkg.get("credits_blocked", 0),
            "price_cop": pkg.get("price_cop") or "",
            "start_date": pkg.get("start_date", ""),
            "end_date": pkg.get("end_date", ""),
            "status": pkg.get("status", ""),
        })
    return buf.getvalue().encode("utf-8-sig")


def export_usage_report_pdf(metrics: dict[str, Any], company_name: str, period: str) -> bytes:
    """Resumen ejecutivo de uso en PDF."""
    title_style, sub_style, base = _styles()
    body_style = ParagraphStyle(
        "licBody",
        parent=base["Normal"],
        fontSize=9,
        spaceAfter=6,
    )
    kpi_label = ParagraphStyle(
        "licKpiLabel",
        parent=base["Normal"],
        fontSize=8,
        textColor=colors.grey,
    )
    kpi_val = ParagraphStyle(
        "licKpiVal",
        parent=base["Normal"],
        fontSize=22,
        textColor=BRAND_COLOR,
        fontName="Helvetica-Bold",
        spaceAfter=2,
    )

    now = datetime.utcnow().strftime("%d/%m/%Y %H:%M UTC")
    elements = [
        Paragraph(f"Reporte Ejecutivo de Uso — {company_name}", title_style),
        Paragraph(f"Período: {period}  ·  Generado: {now}", sub_style),
        Spacer(1, 0.4 * cm),
    ]

    # KPI summary table
    kpi_data = [
        ["Licencias emitidas", "Créditos usados", "Plataformas activas", "Tracks licenciados"],
        [
            str(metrics.get("total_licenses", 0)),
            str(metrics.get("total_credits_used", 0)),
            str(metrics.get("platforms_count", 0)),
            str(metrics.get("tracks_count", 0)),
        ],
    ]
    kpi_tbl = Table(kpi_data, colWidths=[4.5 * cm] * 4)
    kpi_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), HEADER_BG),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 8),
        ("TEXTCOLOR", (0, 0), (-1, 0), BRAND_COLOR),
        ("FONTNAME", (0, 1), (-1, 1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 1), (-1, 1), 20),
        ("TEXTCOLOR", (0, 1), (-1, 1), BRAND_COLOR),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOX", (0, 0), (-1, -1), 0.5, BRAND_COLOR),
        ("INNERGRID", (0, 0), (-1, -1), 0.3, colors.lightgrey),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    elements.append(kpi_tbl)
    elements.append(Spacer(1, 0.5 * cm))

    # Platform breakdown if available
    by_platform = metrics.get("by_platform") or []
    if by_platform:
        elements.append(Paragraph("Distribución por plataforma", ParagraphStyle(
            "licSec", parent=base["Heading2"], fontSize=11, textColor=BRAND_COLOR, spaceAfter=4
        )))
        plat_rows = [["Plataforma", "Licencias", "Créditos"]]
        for row in by_platform:
            plat_rows.append([
                row.get("platform", ""),
                str(row.get("count", 0)),
                str(row.get("credits", 0)),
            ])
        plat_tbl = Table(plat_rows, colWidths=[6 * cm, 4 * cm, 4 * cm])
        plat_tbl.setStyle(_table_style(len(plat_rows)))
        elements.append(plat_tbl)
        elements.append(Spacer(1, 0.4 * cm))

    # Status breakdown if available
    by_status = metrics.get("by_status") or []
    if by_status:
        elements.append(Paragraph("Distribución por estado", ParagraphStyle(
            "licSec2", parent=base["Heading2"], fontSize=11, textColor=BRAND_COLOR, spaceAfter=4
        )))
        stat_rows = [["Estado", "Cantidad"]]
        for row in by_status:
            stat_rows.append([row.get("status", ""), str(row.get("count", 0))])
        stat_tbl = Table(stat_rows, colWidths=[8 * cm, 4 * cm])
        stat_tbl.setStyle(_table_style(len(stat_rows)))
        elements.append(stat_tbl)

    return _build_pdf(elements, pagesize=A4)
