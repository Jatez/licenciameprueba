/**
 * Client-side Dashboard report export (PDF + Excel).
 * All data is hardcoded mock to match what the Dashboard view renders.
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

const KPIS = [
  { label: "Saldo de créditos", value: "180" },
  { label: "Licencias activas", value: "35" },
  { label: "Publicaciones rastreadas", value: "22" },
  { label: "Vigencia de bolsa", value: "270 días restantes" },
];

const ALERTS = [
  "Saldo bajo de créditos",
  "Bolsa próxima a vencer",
  "Facebook no conectado",
];

const CREDIT_USAGE: Array<[string, number]> = [
  ["Uso único", 42],
  ["Paquete stories", 28],
  ["Uso extendido mensual", 18],
  ["Video largo", 14],
  ["Post con pauta", 9],
  ["Post colaborativo", 6],
];

const TOP_TRACKS: Array<[number, string, string, number, number]> = [
  [1, "Sunset Avenue", "Lia Carter", 12, 480_000],
  [2, "Neon Streets", "DJ Omar", 9, 320_000],
  [3, "Quiet Storm", "Marina Vega", 7, 245_000],
  [4, "Gold Hour", "The Atlas", 5, 188_000],
  [5, "Saudade", "Helio", 4, 142_000],
];

const PLATFORMS: Array<[string, number, string]> = [
  ["Instagram", 21, "7,0%"],
  ["TikTok", 16, "6,6%"],
  ["Facebook", 8, "6,9%"],
];

const RECENT_ACTIVITY: Array<[string, string]> = [
  ["Hace 2 h", "Nueva licencia emitida · Sunset Avenue"],
  ["Hace 5 h", "Publicación detectada en Instagram"],
  ["Ayer", "Compra de bolsa de 200 créditos"],
  ["Hace 2 días", "Licencia consumida · Quiet Storm"],
  ["Hace 3 días", "Conexión TikTok renovada"],
];

function addHeader(doc: jsPDF, meta: ExportMetadata): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(meta.reportName, 40, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(`Empresa: ${meta.company} · ${meta.user}`, 40, 68);
  doc.text(`Período: ${meta.periodLabel}`, 40, 82);
  doc.text(`Generado: ${formatExportDateTime(meta.generatedAt)}`, 40, 96);
  doc.setTextColor(0);
  return 116;
}

export async function exportDashboardPDF(): Promise<void> {
  const meta = getCurrentExportMetadata("dashboard");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = addHeader(doc, meta);

  autoTable(doc, {
    startY: y,
    head: [["KPI", "Valor"]],
    body: KPIS.map((k) => [k.label, k.value]),
    theme: "grid",
    headStyles: { fillColor: [219, 236, 98], textColor: [5, 5, 5] },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;

  doc.setFont("helvetica", "bold");
  doc.text("Alertas", 40, y);
  y += 8;
  autoTable(doc, {
    startY: y,
    body: ALERTS.map((a) => [a]),
    theme: "plain",
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;

  autoTable(doc, {
    startY: y,
    head: [["Tipo de uso", "Créditos"]],
    body: CREDIT_USAGE.map(([t, v]) => [t, String(v)]),
    theme: "grid",
    headStyles: { fillColor: [219, 236, 98], textColor: [5, 5, 5] },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;

  autoTable(doc, {
    startY: y,
    head: [["#", "Canción", "Artista", "Licencias", "Impresiones"]],
    body: TOP_TRACKS.map((r) => r.map(String)),
    theme: "grid",
    headStyles: { fillColor: [219, 236, 98], textColor: [5, 5, 5] },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;

  autoTable(doc, {
    startY: y,
    head: [["Red social", "Publicaciones", "Engagement"]],
    body: PLATFORMS.map((r) => r.map(String)),
    theme: "grid",
    headStyles: { fillColor: [219, 236, 98], textColor: [5, 5, 5] },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;

  autoTable(doc, {
    startY: y,
    head: [["Cuándo", "Evento"]],
    body: RECENT_ACTIVITY,
    theme: "grid",
    headStyles: { fillColor: [219, 236, 98], textColor: [5, 5, 5] },
  });

  doc.save(buildExportFilename(meta, "pdf"));
}

export async function exportDashboardExcel(): Promise<void> {
  const meta = getCurrentExportMetadata("dashboard");
  const wb = XLSX.utils.book_new();

  const metadata = [
    ["Reporte", meta.reportName],
    ["Empresa", meta.company],
    ["Usuario", meta.user],
    ["Período", meta.periodLabel],
    ["Generado", formatExportDateTime(meta.generatedAt)],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(metadata), "Metadata");

  const resumen = [
    ["KPI", "Valor"],
    ...KPIS.map((k) => [k.label, k.value]),
    [],
    ["Alertas"],
    ...ALERTS.map((a) => [a]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumen), "Resumen Dashboard");

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([["Tipo de uso", "Créditos"], ...CREDIT_USAGE]),
    "Consumo Créditos",
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["Rank", "Canción", "Artista", "Licencias", "Impresiones"],
      ...TOP_TRACKS,
    ]),
    "Ranking Canciones",
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["Red social", "Publicaciones", "Engagement"],
      ...PLATFORMS,
    ]),
    "Redes Sociales",
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([["Cuándo", "Evento"], ...RECENT_ACTIVITY]),
    "Actividad Reciente",
  );

  const dictionary = [
    ["Campo", "Descripción"],
    ["Saldo de créditos", "Créditos disponibles para emitir nuevas licencias"],
    ["Licencias activas", "Licencias vigentes en el período"],
    ["Publicaciones rastreadas", "Publicaciones detectadas en redes en el período"],
    ["Vigencia de bolsa", "Días restantes hasta el vencimiento de la bolsa actual"],
    ["Engagement", "Tasa de interacciones sobre reproducciones"],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dictionary), "Diccionario de Datos");

  XLSX.writeFile(wb, buildExportFilename(meta, "xlsx"));
}