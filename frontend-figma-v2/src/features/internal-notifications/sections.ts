export interface SowNotif {
  num: number;
  name: string;
  tone: "success" | "warning" | "info" | "error";
  surfaces: string[];
  copy: string;
  ctaPrimary: string;
  ctaSecondary?: string;
  trigger: string;
}

export const SOW_NOTIFS: SowNotif[] = [
  { num: 1, name: "Registro completado", tone: "success", surfaces: ["Email", "Toast"],
    copy: "¡Bienvenido a Licénciame! Tu cuenta está lista. Comencemos.",
    ctaPrimary: "Iniciar onboarding", ctaSecondary: "Ir al catálogo",
    trigger: "Confirmación de email + primer login" },
  { num: 2, name: "Compra de créditos confirmada", tone: "success", surfaces: ["Email (con factura)", "Toast"],
    copy: "Compra confirmada: +{X} créditos en tu wallet.",
    ctaPrimary: "Ver factura", ctaSecondary: "Explorar catálogo",
    trigger: "Webhook OK de pasarela" },
  { num: 3, name: "Licencia emitida", tone: "success", surfaces: ["Email (con certificado)", "Toast"],
    copy: "Licencia emitida para «{track}». Certificado disponible.",
    ctaPrimary: "Descargar certificado", ctaSecondary: "Ver mis licencias",
    trigger: "Confirmación de F-05 post-descuento" },
  { num: 4, name: "Saldo bajo", tone: "warning", surfaces: ["Email", "Banner persistente"],
    copy: "Te quedan {X} créditos. Recarga para no interrumpir tus campañas.",
    ctaPrimary: "Comprar créditos", ctaSecondary: "Ver consumo",
    trigger: "Saldo ≤ 30% del último paquete" },
  { num: 5, name: "Bolsa próxima a vencer", tone: "warning", surfaces: ["Email", "Banner persistente"],
    copy: "Tu bolsa de {Y} créditos vence en {N} días. Úsala o piérdela.",
    ctaPrimary: "Licenciar ahora", ctaSecondary: "Ver bolsa",
    trigger: "30 / 15 / 7 / 1 días antes" },
];

export const OPS_NOTIFS: SowNotif[] = [
  { num: 6, name: "Pago rechazado", tone: "error", surfaces: ["Modal", "Toast"],
    copy: "No pudimos procesar tu pago. Intenta con otro método.",
    ctaPrimary: "Reintentar", trigger: "Webhook fallido de pasarela" },
  { num: 7, name: "Créditos insuficientes (al licenciar)", tone: "warning", surfaces: ["Inline en flujo F-05"],
    copy: "Necesitas {X} créditos. Tienes {Y}.",
    ctaPrimary: "Comprar créditos", trigger: "Click en Licenciar sin saldo" },
  { num: 8, name: "Token OAuth expirado", tone: "warning", surfaces: ["Banner en sección Redes"],
    copy: "Reconecta {red} para seguir trackeando publicaciones.",
    ctaPrimary: "Reconectar", trigger: "Health check periódico falla" },
  { num: 9, name: "Publicación sin licencia detectada", tone: "info", surfaces: ["Banner en dashboard"],
    copy: "Detectamos {N} publicaciones sin licencia vinculada.",
    ctaPrimary: "Revisar", trigger: "Job de match falla" },
  { num: 10, name: "MFA requerido", tone: "info", surfaces: ["Modal"],
    copy: "Ingresa el código que enviamos a {email}.",
    ctaPrimary: "Verificar", trigger: "Login con MFA activo" },
  { num: 11, name: "Sesión por expirar", tone: "info", surfaces: ["Toast"],
    copy: "Tu sesión expira en 2 minutos.",
    ctaPrimary: "Continuar", trigger: "2 min antes de logout por inactividad" },
  { num: 12, name: "Reporte listo", tone: "success", surfaces: ["Toast", "Email"],
    copy: "Tu reporte está listo para descargar.",
    ctaPrimary: "Descargar", trigger: "Job async termina" },
];

export const NAV_SECTIONS = [
  { id: "intro", label: "1. Introducción" },
  { id: "tokens", label: "2. Tokens de color" },
  { id: "surfaces", label: "3. Superficies" },
  { id: "sow", label: "4. Notificaciones SOW (5)" },
  { id: "ops", label: "5. Operacionales (7)" },
  { id: "wallet", label: "6. Estados de Wallet" },
  { id: "bolsa", label: "7. Estados de Bolsa" },
  { id: "license", label: "8. Badges de licencia" },
  { id: "rules", label: "9. Reglas de comportamiento" },
  { id: "open", label: "10. Preguntas abiertas" },
] as const;