/**
 * Client-side PDF certificate generator (F-05).
 *
 * Uses jsPDF. When backend ships `/licenses/{id}/certificate.pdf`, swap the
 * `downloadCertificate` implementation to fetch + save — the public surface
 * (filename, contents) stays stable.
 *
 * NOTE on colors: jsPDF works in RGB and does not consume design-system
 * tokens. We intentionally hardcode a small monochrome palette + one accent
 * here. This is the *only* sanctioned exception to the no-hex rule and lives
 * in this single file.
 */
import { jsPDF } from "jspdf";
import type { License, LicensingTermsResponse } from "@/api/types";
import { licensingStrings } from "@/modules/packages/licensing/strings";
import { formatCredits } from "./formatCredits";

const ACCENT = "#050505";
const MUTED = "#6B7280";
const DIVIDER = "#E5E7EB";

const PAGE_MARGIN_MM = 18;
const LINE = 5.2;

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatUsageLabel(usageType: License["usageType"]): string {
  return licensingStrings.usageTypes[usageType].title;
}

interface CertificateInput {
  license: License;
  terms?: Pick<LicensingTermsResponse, "version" | "summaryBullets">;
}

export function generateCertificatePdf({
  license,
  terms,
}: CertificateInput): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - PAGE_MARGIN_MM * 2;
  const c = licensingStrings.certificate;
  let y = PAGE_MARGIN_MM;

  // Header band: brand + issuance date
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT);
  doc.text("LICÉNCIAME", PAGE_MARGIN_MM, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(formatDateTime(license.issuedAt), pageWidth - PAGE_MARGIN_MM, y, {
    align: "right",
  });
  y += 12;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(ACCENT);
  doc.text(c.pdfTitle, pageWidth / 2, y, { align: "center" });
  y += 9;

  // License token id (prominent)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(license.licenseTokenId, pageWidth / 2, y, { align: "center" });
  y += 8;

  // Divider
  doc.setDrawColor(DIVIDER);
  doc.setLineWidth(0.3);
  doc.line(PAGE_MARGIN_MM, y, pageWidth - PAGE_MARGIN_MM, y);
  y += 8;

  // Helper to render a labelled section
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
      const wrapped = doc.splitTextToSize(value, contentWidth - 42);
      doc.text(wrapped, PAGE_MARGIN_MM + 42, y);
      y += LINE * Math.max(1, wrapped.length);
    });
    y += 3;
  };

  section(c.sections.company, [
    [c.fields.companyName, license.companyName],
    [c.fields.companyId, license.companyId],
  ]);

  section(c.sections.track, [
    [c.fields.trackTitle, license.trackSnapshot.title],
    [c.fields.trackArtist, license.trackSnapshot.artist],
    [c.fields.trackAlbum, license.trackSnapshot.album ?? c.notAvailable],
    [c.fields.trackDuration, formatDuration(license.trackSnapshot.durationSec)],
    [c.fields.trackIsrc, license.trackSnapshot.isrc ?? c.notAvailable],
  ]);

  section(c.sections.license, [
    [c.fields.usageType, formatUsageLabel(license.usageType)],
    [c.fields.credits, formatCredits(license.creditsConsumed)],
    [c.fields.issuedAt, formatDateTime(license.issuedAt)],
    [c.fields.issuedBy, license.issuedByUserName],
    [c.fields.status, c.statusActive],
    [
      c.fields.cancellableUntil,
      license.cancellableUntil
        ? formatDateTime(license.cancellableUntil)
        : c.notAvailable,
    ],
  ]);

  // Conditions block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT);
  doc.text(c.sections.conditions, PAGE_MARGIN_MM, y);
  y += LINE + 1;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(ACCENT);
  const bullets = terms?.summaryBullets ?? [];
  bullets.forEach((bullet) => {
    const wrapped = doc.splitTextToSize(`• ${bullet}`, contentWidth);
    doc.text(wrapped, PAGE_MARGIN_MM, y);
    y += LINE * wrapped.length + 1;
  });
  y += 4;

  // Divider
  doc.setDrawColor(DIVIDER);
  doc.line(PAGE_MARGIN_MM, y, pageWidth - PAGE_MARGIN_MM, y);
  y += 6;

  // Legal notice
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  const legal = c.legalNotice.replace("{company}", license.companyName);
  const wrappedLegal = doc.splitTextToSize(legal, contentWidth);
  doc.text(wrappedLegal, PAGE_MARGIN_MM, y);
  y += LINE * wrappedLegal.length + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `${c.termsVersionLabel}: ${terms?.version ?? c.notAvailable}`,
    PAGE_MARGIN_MM,
    y,
  );
  y += LINE;
  doc.text(`${c.hashLabel}: ${license.licenseTokenId}-${license.id.slice(0, 8)}`, PAGE_MARGIN_MM, y);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - PAGE_MARGIN_MM;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(ACCENT);
  doc.text(c.footer, pageWidth / 2, footerY - 4, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(MUTED);
  doc.text(c.website, pageWidth / 2, footerY, { align: "center" });

  return doc;
}

export function downloadCertificate(input: CertificateInput): void {
  const doc = generateCertificatePdf(input);
  doc.save(`licencia-${input.license.licenseTokenId}.pdf`);
}

export function buildCertificateBlobUrl(input: CertificateInput): string {
  const doc = generateCertificatePdf(input);
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}
