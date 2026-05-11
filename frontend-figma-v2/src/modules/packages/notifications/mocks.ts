import {
  CheckCircle2,
  CreditCard,
  FileCheck,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";
import type {
  NotificationChannelState,
  NotificationItem,
  NotificationPendingRule,
} from "./types";

export const mockChannelState: NotificationChannelState = {
  recipientEmail: "empresa@demo.com",
  emailVerified: true,
  channelLabel: "Email transaccional",
  disclaimer:
    "Estas notificaciones son automáticas y no pueden desactivarse desde la cuenta.",
};

export const mockNotifications: NotificationItem[] = [
  {
    id: "registration",
    kind: "registration",
    icon: CheckCircle2,
    title: "Registro completado",
    event: "Cuenta creada correctamente",
    description: "Email de bienvenida con guía de primeros pasos.",
    contentSummary:
      "Guía de primeros pasos para empezar a usar Licénciame.",
    status: "sent",
    primaryAction: { label: "Explorar catálogo", to: "/catalog" },
    email: {
      subject: "Bienvenido a Licénciame",
      recipient: "empresa@demo.com",
      sentAt: "2026-04-20T10:14:00Z",
      greeting: "Tu cuenta empresa ya está activa.",
      bodyParagraphs: [
        "Empieza explorando el catálogo, revisando tu wallet y licenciando tracks para tus contenidos.",
        "Si tienes dudas, nuestro equipo está disponible para acompañarte en tus primeras licencias.",
      ],
      ctaLabel: "Explorar catálogo",
    },
  },
  {
    id: "credit_purchase",
    kind: "credit_purchase",
    icon: CreditCard,
    title: "Compra de créditos confirmada",
    event: "Compra de bolsa de créditos",
    description: "Email con resumen de compra y factura adjunta.",
    contentSummary: "Resumen de compra + factura PDF.",
    status: "sent",
    primaryAction: { label: "Ir a Wallet", to: "/packages" },
    email: {
      subject: "Compra de créditos confirmada",
      recipient: "empresa@demo.com",
      sentAt: "2026-04-22T16:02:00Z",
      greeting: "Tu compra fue procesada correctamente.",
      bodyParagraphs: [
        "Adjuntamos la factura electrónica con el detalle de la transacción para tus registros contables.",
      ],
      details: [
        { label: "Bolsa comprada", value: "Bolsa B" },
        { label: "Créditos", value: "600 créditos" },
        { label: "Vigencia", value: "14 meses" },
        { label: "Total", value: "$166.000.000 COP", emphasis: true },
      ],
      ctaLabel: "Ver wallet",
      attachment: { label: "Factura.pdf", type: "invoice_pdf" },
    },
  },
  {
    id: "license_issued",
    kind: "license_issued",
    icon: FileCheck,
    title: "Licencia emitida",
    event: "Licencia generada",
    description: "Email con detalle de licencia y certificado adjunto.",
    contentSummary: "Certificado de licencia en PDF adjunto.",
    status: "sent",
    primaryAction: { label: "Ver mis licencias", to: "/licenses" },
    email: {
      subject: "Tu licencia ha sido emitida",
      recipient: "empresa@demo.com",
      sentAt: "2026-04-25T09:31:00Z",
      greeting: "Tu nueva licencia ya está disponible.",
      bodyParagraphs: [
        "El certificado oficial con los términos de uso y plataformas autorizadas se encuentra adjunto en este correo.",
      ],
      details: [
        { label: "Track licenciado", value: "Midnight Pulse — Aurora Wave" },
        { label: "Uso permitido", value: "Redes sociales · Campaña pagada" },
        { label: "Fecha de emisión", value: "25 abr 2026" },
        { label: "Código de licencia", value: "LIC-2026-00184", emphasis: true },
      ],
      ctaLabel: "Ver licencia",
      attachment: {
        label: "Certificado_Licencia.pdf",
        type: "certificate_pdf",
      },
    },
  },
  {
    id: "low_balance",
    kind: "low_balance",
    icon: AlertTriangle,
    title: "Saldo bajo",
    event: "Créditos por debajo del umbral",
    description: "Email de alerta con CTA para comprar más créditos.",
    contentSummary: "Aviso preventivo + CTA de recarga de bolsa.",
    status: "pending_rule",
    pendingNote: "Umbral por definir",
    primaryAction: { label: "Ir a Wallet", to: "/packages" },
    email: {
      subject: "Tu saldo de créditos está bajo",
      recipient: "empresa@demo.com",
      sentAt: "—",
      greeting: "Tu bolsa activa está cerca de agotarse.",
      bodyParagraphs: [
        "Compra más créditos para seguir licenciando música sin interrupciones.",
      ],
      details: [
        { label: "Saldo actual", value: "28 créditos", emphasis: true },
        { label: "Bolsa activa", value: "Bolsa B" },
      ],
      ctaLabel: "Comprar créditos",
    },
  },
  {
    id: "package_expiring",
    kind: "package_expiring",
    icon: CalendarClock,
    title: "Bolsa próxima a vencer",
    event: "Fecha de vencimiento cercana",
    description: "Email con saldo restante y fecha de vencimiento.",
    contentSummary: "Recordatorio de vencimiento de la bolsa activa.",
    status: "pending_rule",
    pendingNote: "Días de anticipación por definir",
    primaryAction: { label: "Ir a Wallet", to: "/packages" },
    email: {
      subject: "Tu bolsa de créditos está próxima a vencer",
      recipient: "empresa@demo.com",
      sentAt: "—",
      greeting: "Tu bolsa activa está por terminar su vigencia.",
      bodyParagraphs: [
        "Usa tus créditos antes de que termine la vigencia para no perder saldo disponible.",
      ],
      details: [
        { label: "Bolsa activa", value: "Bolsa B" },
        { label: "Créditos restantes", value: "184 créditos" },
        { label: "Fecha de vencimiento", value: "12 jun 2026", emphasis: true },
      ],
      ctaLabel: "Ver créditos disponibles",
    },
  },
];

export const mockPendingRules: NotificationPendingRule[] = [
  {
    id: "low_balance_threshold",
    title: "Umbral de saldo bajo",
    description: "Pendiente de definición técnica.",
  },
  {
    id: "expiry_anticipation",
    title: "Anticipación de vencimiento",
    description: "Pendiente de definición técnica.",
  },
];
