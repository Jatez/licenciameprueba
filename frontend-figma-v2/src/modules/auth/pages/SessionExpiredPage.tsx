import { useState } from "react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { SessionExpiredModal } from "@/modules/auth/components/SessionExpiredModal";
import { AutoLogoutWarningModal } from "@/modules/auth/components/AutoLogoutWarningModal";
import { Button } from "@/components/ui/button";

/**
 * MOCK ONLY — demo route to preview the two security modals.
 */
export default function SessionExpired() {
  const [expired, setExpired] = useState(true);
  const [idle, setIdle] = useState(false);

  return (
    <AuthLayout>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Demo · modales de sesión</h1>
          <p className="text-sm text-muted-foreground">
            Vista previa de los modales de sesión expirada y aviso de inactividad.
          </p>
        </header>
        <div className="flex flex-col gap-2">
          <Button onClick={() => setExpired(true)}>Mostrar “sesión expirada”</Button>
          <Button variant="outline" onClick={() => setIdle(true)}>
            Mostrar aviso de inactividad
          </Button>
        </div>
      </div>

      <SessionExpiredModal open={expired} onClose={() => setExpired(false)} />
      <AutoLogoutWarningModal
        open={idle}
        onKeep={() => setIdle(false)}
        onLogout={() => setIdle(false)}
      />
    </AuthLayout>
  );
}
