/**
 * sentryAdapter — puente entre el errorStore y Sentry (u otro APM).
 *
 * Para activar Sentry en producción:
 *  1. npm install @sentry/react
 *  2. Añadir VITE_SENTRY_DSN=https://xxx@sentry.io/yyy en .env.production
 *  3. Descomentar los bloques marcados con [SENTRY]
 */

// [SENTRY] import * as Sentry from "@sentry/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (import.meta as any).env as Record<string, string | undefined>;

let initialized = false;

export function initSentry() {
  const dsn = env?.VITE_SENTRY_DSN;
  const isProd = env?.PROD === "true" || env?.MODE === "production";
  if (!dsn || !isProd || initialized) return;
  initialized = true;
  // [SENTRY] Sentry.init({ dsn, environment: env.MODE ?? "production", tracesSampleRate: 0.2 });
  console.info("[Sentry] DSN encontrado — activa Sentry.init() para producción");
}

export function reportToSentry(error: Error, extra?: Record<string, unknown>) {
  if (!initialized) return;
  // [SENTRY] Sentry.captureException(error, { extra });
  void error; void extra;
}
