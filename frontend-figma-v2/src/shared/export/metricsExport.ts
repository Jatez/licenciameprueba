/**
 * Client-side Metrics report export (PDF + Excel).
 */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  buildExportFilename,
  formatExportDateTime,
  getCurrentExportMetadata,
  type ExportMetadata,
} from "./exportMetadata";

const KPIS: Array<[string, string]> = [
  ["Publicaciones", "45"],
  ["Reproducciones", "2,7 M"],
  ["Interacciones", "182,5 k"],
  ["Engagement rate", "6,8%"],
];

const PLATFORMS: Array<[string, number, string, string]> = [
  ["Instagram", 21, "1,1 M", "7,0%"],
  ["TikTok", 16, "1,2 M", "6,6%"],
  ["Facebook", 8, "446,7 k", "6,9%"],
];

const TREND: Array<[string, number, number]> = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  const iso = d.toISOString().slice(0, 10);
  return [iso, 80_000 + Math.round(Math.random() * 60_000), 5_000 + Math.round(Math.random() * 4_000)];
});

const PUBLICATIONS: Array<Array<string | number>> = [
  ["pub-001", "Sunset Avenue", "Lia Carter", "Instagram", "2026-04-12", "Stories", 132_000, 8_900, "6,7%", "Sincronizada", "https://instagram.com/p/abc"],
  ["pub-002", "Neon Streets", "DJ Omar", "TikTok", "2026-04-14", "Video corto", 245_000, 19_400, "7,9%", "Sincronizada", "https://tiktok.com/@u/v/1"],
  ["pub-003", "Quiet Storm", "Marina Vega", "Instagram", "2026-04-15", "Reel", 98_000, 6_100, "6,2%", "Con incidencias", "https://instagram.com/p/def"],
  ["pub-004", "Gold Hour", "The Atlas", "Facebook", "2026-04-17", "Post", 56_000, 3_400, "6,1%", "Sincronizada", "https://facebook.com/p/1"],
  ["pub-005", "Saudade", "Helio", "TikTok", "2026-04-19", "Video corto", 188_000, 14_200, "7,5%", "Sincronizada", "https://tiktok.com/@u/v/2"],
  ["pub-006", "Lighthouse", "Nova Sound", "Instagram", "2026-04-21", "Reel", 142_000, 9_800, "6,9%", "Sincronizada", "https://instagram.com/p/ghi"],
];

const RANKING: Array<Array<string | number>> = [
  [1, "Sunset Avenue", "Lia Carter", 12, 480_000, 32_400, "6,8%", "Instagram", "Activa"],
  [2, "Neon Streets", "DJ Omar", 9, 320_000, 24_500, "7,7%", "TikTok", "Activa"],
  [3, "Quiet Storm", "Marina Vega", 7, 245_000, 15_800, "6,4%", "Instagram", "Activa"],
  [4, "Gold Hour", "The Atlas", 5, 188_000, 12_100, "6,4%", "Facebook", "Activa"],
  [5, "Saudade", "Helio", 4, 142_000, 10_650, "7,5%", "TikTok", "Activa"],
];

function addHeader(doc: jsPDF, meta: ExportMetadata): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(meta.reportName, 40, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(`Período: ${meta.periodLabel}`, 40, 68);
  doc.text(
    "Filtros: todas las redes · todos los tipos de uso · sincronizadas + con incidencias",
    40,
    82,
  );
  doc.text(`Generado: ${formatExportDateTime(meta.generatedAt)}`, 40, 96);
  doc.setTextColor(0);
  return 116;
}

export async function exportMetricsPDF(): Promise<void> {
  const meta = getCurrentExportMetadata("metricas");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = addHeader(doc, meta);

  autoTable(doc, {
    startY: y,
    head: [["KPI", "Valor"]],
    body: KPIS,
    theme: "grid",
    headStyles: { fillColor: [219, 236, 98], textColor: [5, 5, 5] },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;

  autoTable(doc, {
    startY: y,
    head: [["Plataforma", "Publicaciones", "Reproducciones", "Engagement"]],
    body: PLATFORMS.map((r) => r.map(String)),
    theme: "grid",
    headStyles: { fillColor: [219, 236, 98], textColor: [5, 5, 5] },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;

  autoTable(doc, {
    startY: y,
    head: [["Fecha", "Reproducciones", "Interacciones"]],
    body: TREND.map((r) => r.map(String)),
    theme: "striped",
    headStyles: { fillColor: [219, 236, 98], textColor: [5, 5, 5] },
    styles: { fontSize: 8 },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;

  autoTable(doc, {
    startY: y,
    head: [["Canción", "Red", "Fecha", "Reproducciones", "Engagement"]],
    body: PUBLICATIONS.map((r) => [r[1], r[3], r[4], r[6], r[8]].map(String)),
    theme: "grid",
    headStyles: { fillColor: [219, 236, 98], textColor: [5, 5, 5] },
    styles: { fontSize: 8 },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;

  autoTable(doc, {
    startY: y,
    head: [["#", "Canción", "Artista", "Reproducciones", "Engagement"]],
    body: RANKING.map((r) => [r[0], r[1], r[2], r[4], r[6]].map(String)),
    theme: "grid",
    headStyles: { fillColor: [219, 236, 98], textColor: [5, 5, 5] },
  });

  doc.save(buildExportFilename(meta, "pdf"));
}

export async function exportMetricsExcel(): Promise<void> {
  const meta = getCurrentExportMetadata("metricas");
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["Reporte", meta.reportName],
      ["Período", meta.periodLabel],
      ["Generado", formatExportDateTime(meta.generatedAt)],
      ["Filtros", "Todas las redes; todos los tipos de uso; sincronizadas + con incidencias"],
    ]),
    "Metadata",
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["KPI", "Valor"],
      ...KPIS,
      [],
      ["Plataforma", "Publicaciones", "Reproducciones", "Engagement"],
      ...PLATFORMS,
    ]),
    "Resumen Métricas",
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["Fecha", "Reproducciones", "Interacciones"],
      ...TREND,
    ]),
    "Tendencia Diaria",
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      [
        "ID publicación",
        "Canción",
        "Artista",
        "Red",
        "Fecha",
        "Tipo de uso",
        "Reproducciones",
        "Interacciones",
        "Engagement rate",
        "Estado",
        "Acción",
      ],
      ...PUBLICATIONS,
    ]),
    "Publicaciones",
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      [
        "Rank",
        "Canción",
        "Artista",
        "Publicaciones",
        "Reproducciones",
        "Interacciones",
        "Engagement rate",
        "Red principal",
        "Estado",
      ],
      ...RANKING,
    ]),
    "Ranking Canciones",
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["Campo", "Descripción"],
      ["Reproducciones", "Total de visualizaciones del contenido en redes"],
      ["Interacciones", "Likes, comentarios y compartidos agregados"],
      ["Engagement rate", "Interacciones / reproducciones"],
      ["Estado", "Sincronización del rastreo: Sincronizada o Con incidencias"],
    ]),
    "Diccionario de Datos",
  );

  XLSX.writeFile(wb, buildExportFilename(meta, "xlsx"));
}