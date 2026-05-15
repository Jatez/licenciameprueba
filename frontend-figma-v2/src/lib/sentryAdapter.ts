/**
 * sentryAdapter — puente entre el errorStore y Sentry.
 *
 * Sentry se inicializa automáticamente si VITE_SENTRY_DSN está definido.
 * En desarrollo (MODE !== "production") solo se imprime un aviso en consola.
 *
 * Para activar en producción:
 *  1. npm install @sentry/react  (ya instalado)
 *  2. Añadir VITE_SENTRY_DSN=https://xxx@sentry.io/yyy en .env.production
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (import.meta as any).env as Record<string, string | undefined>;

let initialized = false;

export function initSentry() {
  const dsn = env?.VITE_SENTRY_DSN;
  if (!dsn || initialized) return;
  initialized = true;

  const isProd = env?.MODE === "production";

  if (isProd) {
    // Sentry real en producción
    import("@sentry/react")
      .then((Sentry) => {
        Sentry.init({
          dsn,
          environment: env?.MODE ?? "production",
          tracesSampleRate: 0.1,
          // Ignorar errores de red comunes para reducir ruido
          ignoreErrors: [
            "ResizeObserver loop limit exceeded",
            "Non-Error promise rejection captured",
          ],
        });
        console.info("[Sentry] Inicializado en producción");
      })
      .catch(() => {
        console.warn("[Sentry] @sentry/react no instalado — ejecuta: npm install @sentry/react");
      });
  } else {
    console.info("[Sentry] DSN encontrado — Sentry activo solo en production (MODE actual:", env?.MODE, ")");
  }
}

export function reportToSentry(error: Error, extra?: Record<string, unknown>) {
  if (!initialized) return;
  import("@sentry/react")
    .then((Sentry) => {
      Sentry.captureException(error, { extra });
    })
    .catch(() => void 0);
}
