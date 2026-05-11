/**
 * Client-side quote PDF generator (F-04).
 *
 * jsPDF works in RGB and does not consume design-system tokens. We hardcode
 * a small monochrome palette here — same justified exception that lives in
 * the licensing certificate generator.
 */
import { jsPDF } from "jspdf";
import type { PurchaseQuote } from "@/api/types";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatCop } from "./formatCop";
import { formatCredits } from "./formatCredits";
import { formatDate } from "./formatDate";

const ACCENT = "#050505";
const MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";
const WARN = "#92400E";
const PAGE_MARGIN_MM = 18;
const LINE = 5.2;

export function generateQuotePdf(quote: PurchaseQuote): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - PAGE_MARGIN_MM * 2;
  const s = packagesStrings.pdf;
  let y = PAGE_MARGIN_MM;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT);
  doc.text("LICÉNCIAME", PAGE_MARGIN_MM, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(formatDate(quote.createdAt), pageWidth - PAGE_MARGIN_MM, y, {
    align: "right",
  });
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(ACCENT);
  doc.text(s.quoteTitle, pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(quote.id, pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setDrawColor(DIVIDER);
  doc.setLineWidth(0.3);
  doc.line(PAGE_MARGIN_MM, y, pageWidth - PAGE_MARGIN_MM, y);
  y += 7;

  const section = (title: string, rows: Array<[string, string]>) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(ACCENT);
    doc.text(title, PAGE_MARGIN_MM, y);
    y += LINE + 1;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    rows.forEach(([label, value]) => {
      doc.setTextColor(MUTED);
      doc.text(`${label}:`, PAGE_MARGIN_MM, y);
      doc.setTextColor(ACCENT);
      const wrapped = doc.splitTextToSize(value, contentWidth - 50);
      doc.text(wrapped, PAGE_MARGIN_MM + 50, y);
      y += LINE * Math.max(1, wrapped.length);
    });
    y += 3;
  };

  section(s.buyerSection, [
    ["Empresa", quote.buyerCompanyName],
    ["NIT", quote.buyerCompanyId],
    ["Correo", quote.buyerEmail],
    [s.quoteNumberLabel, quote.id],
    [s.issuedAtLabel, formatDate(quote.createdAt)],
    [s.validUntilLabel, formatDate(quote.validUntil)],
  ]);

  // Concept table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT);
  doc.text(s.conceptSection, PAGE_MARGIN_MM, y);
  y += LINE + 1;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(ACCENT);
  doc.text(
    `${quote.packageSnapshot.name} — ${formatCredits(
      quote.packageSnapshot.credits,
    )} ${s.columns.credits.toLowerCase()} · ${quote.packageSnapshot.validityMonths} ${packagesStrings.comparisonTable.monthsSuffix}`,
    PAGE_MARGIN_MM,
    y,
  );
  y += LINE + 4;

  const totalRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 12 : 10);
    doc.setTextColor(ACCENT);
    doc.text(label, PAGE_MARGIN_MM, y);
    doc.text(value, pageWidth - PAGE_MARGIN_MM, y, { align: "right" });
    y += LINE + 1;
  };
  totalRow(s.subtotal, formatCop(quote.subtotalCop));
  totalRow(s.iva, formatCop(quote.ivaCop));
  doc.setDrawColor(DIVIDER);
  doc.line(PAGE_MARGIN_MM, y, pageWidth - PAGE_MARGIN_MM, y);
  y += 4;
  totalRow(s.total, formatCop(quote.totalCop), true);
  y += 4;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(
    formatString(packagesStrings.purchaseDialog.review.validUntil, {
      date: formatDate(quote.validUntil),
    }),
    PAGE_MARGIN_MM,
    y,
  );

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - PAGE_MARGIN_MM;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(WARN);
  const wrappedFooter = doc.splitTextToSize(s.quoteFooter, contentWidth);
  doc.text(wrappedFooter, pageWidth / 2, footerY - 4, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(MUTED);
  doc.text(s.website, pageWidth / 2, footerY, { align: "center" });

  return doc;
}

export function downloadQuotePdf(quote: PurchaseQuote): void {
  const doc = generateQuotePdf(quote);
  doc.save(`cotizacion-${quote.id}.pdf`);
}
