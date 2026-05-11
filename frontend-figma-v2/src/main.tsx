import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PasswordGate } from "./PasswordGate.tsx";
import "./i18n";
import "./index.css";
import { trackingSimulator } from "@/shared/tracking-simulator";
import { useAuthStore } from "@/stores/authStore";
import { captureError } from "@/stores/errorStore";
import { initSentry } from "@/lib/sentryAdapter";

// Sentry (no-op en dev, activo en prod con VITE_SENTRY_DSN)
initSentry();

// Captura errores JS no manejados
window.addEventListener("error", (event) => {
  captureError({
    severity: "fatal",
    message: event.message ?? "Unhandled error",
    source: "window.onerror",
    stack: event.error?.stack,
    extra: { filename: event.filename, lineno: event.lineno, colno: event.colno },
  });
});

// Captura promesas rechazadas no manejadas
window.addEventListener("unhandledrejection", (event) => {
  const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
  captureError({
    severity: "error",
    message: error.message,
    source: "unhandledrejection",
    stack: error.stack,
  });
});

// Solo arrancar el simulador si ya hay sesión activa (token persistido).
const { accessToken } = useAuthStore.getState();
if (accessToken) {
  void trackingSimulator.start();
}

createRoot(document.getElementById("root")!).render(
  <PasswordGate>
    <App />
  </PasswordGate>
);
