/**
 * Client-side receipt PDF generator (F-04). Demo only — explicitly NOT a
 * DIAN electronic invoice. Same monochrome jsPDF palette as the certificate.
 */
import { jsPDF } from "jspdf";
import type { Purchase } from "@/api/types";
import { packagesStrings, formatString } from "@/modules/packages/packages/strings";
import { formatCop } from "./formatCop";
import { formatCredits } from "./formatCredits";
import { formatDate, formatDateTime } from "./formatDate";

const ACCENT = "#050505";
const MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";
const WARN = "#92400E";
const PAGE_MARGIN_MM = 18;
const LINE = 5.2;

export function generateReceiptPdf(purchase: Purchase): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE_MARGIN_MM * 2;
  const s = packagesStrings.pdf;
  let y = PAGE_MARGIN_MM;

  // Diagonal "DOCUMENTO PROVISIONAL" watermark — light gray, behind content.
  if (purchase.isProvisionalDocument !== false) {
    doc.saveGraphicsState();
    // @ts-expect-error jsPDF types miss GState in some versions
    doc.setGState(new doc.GState({ opacity: 0.08 }));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(64);
    doc.setTextColor("#000000");
    doc.text("DOCUMENTO PROVISIONAL", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 30,
    });
    doc.restoreGraphicsState();
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT);
  doc.text("LICÉNCIAME", PAGE_MARGIN_MM, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(formatDateTime(purchase.confirmedAt), pageWidth - PAGE_MARGIN_MM, y, {
    align: "right",
  });
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(ACCENT);
  doc.text(s.receiptTitle, pageWidth / 2, y, { align: "center" });
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(purchase.receiptNumber ?? purchase.id, pageWidth / 2, y, {
    align: "center",
  });
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
    ["Empresa", "Marca Demo S.A.S."],
    ["NIT", "900.123.456-7"],
    ["Correo", "compras@marcademo.co"],
    [s.receiptNumberLabel, purchase.receiptNumber ?? "—"],
    [s.confirmedAtLabel, formatDateTime(purchase.confirmedAt)],
  ]);

  section(s.conceptSection, [
    ["Paquete", purchase.packageSnapshot.name],
    [s.columns.credits, formatCredits(purchase.packageSnapshot.credits)],
    [
      s.columns.validity,
      `${purchase.packageSnapshot.validityMonths} ${packagesStrings.comparisonTable.monthsSuffix}`,
    ],
    [s.columns.unitPrice, formatCop(purchase.packageSnapshot.priceCop)],
  ]);

  const paymentLabel = purchase.paymentMethod === "card-simulated"
    ? formatString(s.cardLabel, { last4: purchase.cardLast4 ?? "----" })
    : formatString(s.transferLabel, {
        reference: purchase.transferReference ?? "—",
      });
  section(s.paymentSection, [["Método", paymentLabel]]);

  const totalRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 12 : 10);
    doc.setTextColor(ACCENT);
    doc.text(label, PAGE_MARGIN_MM, y);
    doc.text(value, pageWidth - PAGE_MARGIN_MM, y, { align: "right" });
    y += LINE + 1;
  };
  totalRow(s.subtotal, formatCop(purchase.subtotalCop));
  totalRow(s.iva, formatCop(purchase.ivaCop));
  doc.setDrawColor(DIVIDER);
  doc.line(PAGE_MARGIN_MM, y, pageWidth - PAGE_MARGIN_MM, y);
  y += 4;
  totalRow(s.total, formatCop(purchase.totalCop), true);
  y += 6;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(
    `Vigencia de los créditos: ${purchase.packageSnapshot.validityMonths} ${packagesStrings.comparisonTable.monthsSuffix} desde la confirmación.`,
    PAGE_MARGIN_MM,
    y,
  );

  const footerY = doc.internal.pageSize.getHeight() - PAGE_MARGIN_MM;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(WARN);
  const wrappedFooter = doc.splitTextToSize(s.receiptFooter, contentWidth);
  doc.text(wrappedFooter, pageWidth / 2, footerY - 4, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(MUTED);
  doc.text(s.website, pageWidth / 2, footerY, { align: "center" });

  return doc;
}

export function downloadReceiptPdf(purchase: Purchase): void {
  const doc = generateReceiptPdf(purchase);
  doc.save(`recibo-${purchase.receiptNumber ?? purchase.id}.pdf`);
}

// re-export so consumers only need a single file
export { formatDate };
