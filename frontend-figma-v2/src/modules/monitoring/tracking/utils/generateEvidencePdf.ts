/**
 * Client-side evidence PDF generator (F-06).
 *
 * Produces a single-page PDF preserving a detected post's metadata at the
 * moment of capture. Used as a fallback evidence document for ephemeral
 * content (Stories) that disappeared from the platform.
 *
 * Backend hand-off: when backend ships `/posts/{id}/evidence.pdf`, swap this
 * for a fetch+save call. The filename / contents stay stable for auditing.
 *
 * NOTE on colors: jsPDF works in RGB and does not consume DS tokens. Same
 * sanctioned exception as `generateCertificate.ts`.
 */
import { jsPDF } from "jspdf";
import type { DetectedPost } from "@/api/types";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

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

function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}

interface EvidenceInput {
  post: DetectedPost;
  /** Optional human-readable license id (LIC-XXXX). */
  licenseTokenId?: string;
}

export function generateEvidencePdf({ post, licenseTokenId }: EvidenceInput): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const t = trackingStrings.snapshotViewer;
  let y = PAGE_MARGIN_MM;

  // Header band
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT);
  doc.text("LICÉNCIAME", PAGE_MARGIN_MM, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(formatDateTime(new Date().toISOString()), pageWidth - PAGE_MARGIN_MM, y, {
    align: "right",
  });
  y += 12;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(ACCENT);
  doc.text(t.evidencePdf.title, pageWidth / 2, y, { align: "center" });
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(MUTED);
  doc.text(t.evidencePdf.subtitle, pageWidth / 2, y, { align: "center" });
  y += 10;

  // Divider
  doc.setDrawColor(DIVIDER);
  doc.line(PAGE_MARGIN_MM, y, pageWidth - PAGE_MARGIN_MM, y);
  y += 8;

  // Post id
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(ACCENT);
  doc.text(`POST-${post.id}`, PAGE_MARGIN_MM, y);
  y += 8;

  // Section: metadata
  y = renderSection(doc, t.sections.metadata, y, PAGE_MARGIN_MM);
  const platformLabel = trackingStrings.syncStatus.platformLabels[post.platform];
  const postTypeLabel = trackingStrings.postCard.postType[post.postType];
  const lifetime = computeLifetime(post);

  y = renderRow(doc, t.fields.platform, platformLabel, y, PAGE_MARGIN_MM, pageWidth);
  y = renderRow(doc, t.fields.postType, postTypeLabel, y, PAGE_MARGIN_MM, pageWidth);
  y = renderRow(doc, t.fields.originalUrl, post.externalUrl, y, PAGE_MARGIN_MM, pageWidth);
  y = renderRow(doc, t.fields.publishedAt, formatDateTime(post.publishedAt), y, PAGE_MARGIN_MM, pageWidth);
  y = renderRow(doc, t.fields.detectedAt, formatDateTime(post.detectedAt), y, PAGE_MARGIN_MM, pageWidth);
  if (lifetime) y = renderRow(doc, t.fields.lifetime, lifetime, y, PAGE_MARGIN_MM, pageWidth);
  y += 4;

  // Section: metrics
  y = renderSection(doc, t.sections.metrics, y, PAGE_MARGIN_MM);
  if (post.metrics) {
    y = renderRow(
      doc,
      t.fields.reproductions,
      String(post.metrics.reproductions),
      y,
      PAGE_MARGIN_MM,
      pageWidth,
    );
    const interactions =
      post.metrics.likes + post.metrics.comments + post.metrics.shares + post.metrics.saves;
    y = renderRow(doc, t.fields.interactions, String(interactions), y, PAGE_MARGIN_MM, pageWidth);
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(MUTED);
    doc.text(t.fields.noMetrics, PAGE_MARGIN_MM, y);
    y += LINE;
  }
  y += 4;

  // Section: track
  y = renderSection(doc, t.sections.track, y, PAGE_MARGIN_MM);
  y = renderRow(
    doc,
    "Track",
    `"${post.snapshot.detectedTrackTitle}" — ${post.snapshot.detectedArtist}`,
    y,
    PAGE_MARGIN_MM,
    pageWidth,
  );
  y += 4;

  // Section: license
  y = renderSection(doc, t.sections.license, y, PAGE_MARGIN_MM);
  if (licenseTokenId) {
    y = renderRow(doc, "ID", licenseTokenId, y, PAGE_MARGIN_MM, pageWidth);
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(MUTED);
    doc.text(t.fields.noLicense, PAGE_MARGIN_MM, y);
    y += LINE;
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(DIVIDER);
  doc.line(PAGE_MARGIN_MM, pageHeight - 18, pageWidth - PAGE_MARGIN_MM, pageHeight - 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(MUTED);
  doc.text(t.evidencePdf.footer, pageWidth / 2, pageHeight - 12, { align: "center" });
  doc.text(`hash: post-${post.id}`, pageWidth / 2, pageHeight - 7, { align: "center" });

  return doc;
}

export function downloadEvidencePdf(input: EvidenceInput): void {
  const t = trackingStrings.snapshotViewer.evidencePdf;
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${t.filenamePrefix}-${input.post.id}-${ts}.pdf`;
  const doc = generateEvidencePdf(input);
  doc.save(filename);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function renderSection(doc: jsPDF, title: string, y: number, x: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(title.toUpperCase(), x, y);
  return y + LINE + 1;
}

function renderRow(
  doc: jsPDF,
  label: string,
  value: string,
  y: number,
  x: number,
  pageWidth: number,
): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(MUTED);
  doc.text(label, x, y);
  doc.setTextColor(ACCENT);
  const valueX = x + 42;
  const lines = doc.splitTextToSize(value, pageWidth - valueX - PAGE_MARGIN_MM);
  doc.text(lines, valueX, y);
  return y + LINE * Math.max(1, lines.length);
}

function computeLifetime(post: DetectedPost): string | null {
  if (!post.evidenceExpiresAt) return null;
  const start = new Date(post.publishedAt).getTime();
  const end = new Date(post.evidenceExpiresAt).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  const totalMin = Math.round((end - start) / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}
