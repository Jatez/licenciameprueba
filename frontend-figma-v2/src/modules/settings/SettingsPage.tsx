import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppPageHeader } from "@/shared/components/layout/AppPageHeader";
import {
  useCurrentUser,
  useCompany,
  useUpdateProfile,
  useChangePassword,
  useBillingProfile,
  useSaveBilling,
} from "./hooks";

// ─── Tab: Perfil ──────────────────────────────────────────────────────────────

function PerfilTab() {
  const { data: user, isLoading: loadingUser, isError: errorUser } = useCurrentUser();
  const { data: company, isLoading: loadingCompany } = useCompany();
  const updateProfile = useUpdateProfile();

  const [email, setEmail] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("El correo electrónico es requerido.");
      return;
    }
    updateProfile.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          toast.success("Perfil actualizado correctamente.");
          setEmail("");
        },
        onError: () => {
          toast.error("Error al actualizar el perfil. Intenta de nuevo.");
        },
      }
    );
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (errorUser) {
    return (
      <p className="text-sm text-destructive py-6">
        Error al cargar los datos del usuario.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Información de cuenta</CardTitle>
          <CardDescription>Datos actuales de tu perfil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Correo</span>
            <span className="text-sm font-medium">{user?.email ?? "—"}</span>
          </div>
          <Separator />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Rol</span>
            <div>
              <Badge variant="secondary" className="capitalize">
                {user?.role ?? "—"}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Empresa</span>
            {loadingCompany ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <span className="text-sm font-medium">
                {(company as Record<string, unknown>)?.name as string ?? "—"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Actualizar correo</CardTitle>
          <CardDescription>
            Ingresa tu nuevo correo electrónico y guarda los cambios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Nuevo correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder={user?.email ?? "correo@ejemplo.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={updateProfile.isPending}
              />
            </div>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab: Seguridad ───────────────────────────────────────────────────────────

function SeguridadTab() {
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (newPassword.length < 8) {
      setValidationError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("Las contraseñas no coinciden.");
      return;
    }

    changePassword.mutate(
      { current_password: currentPassword, new_password: newPassword },
      {
        onSuccess: () => {
          toast.success("Contraseña cambiada correctamente.");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: () => {
          toast.error("Error al cambiar la contraseña. Verifica tu contraseña actual.");
        },
      }
    );
  };

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Cambiar contraseña</CardTitle>
        <CardDescription>
          Actualiza tu contraseña de acceso. Mínimo 8 caracteres.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña actual</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={changePassword.isPending}
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={changePassword.isPending}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={changePassword.isPending}
              autoComplete="new-password"
            />
          </div>
          {validationError && (
            <p className="text-sm text-destructive">{validationError}</p>
          )}
          <Button type="submit" disabled={changePassword.isPending}>
            {changePassword.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Cambiar contraseña
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Tab: Facturación ─────────────────────────────────────────────────────────

function FacturacionTab() {
  const { data: billing, isLoading, isError } = useBillingProfile();
  const saveBilling = useSaveBilling();

  const [legalName, setLegalName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [country, setCountry] = useState("");

  // Seed form once data loads
  const [seeded, setSeeded] = useState(false);
  if (billing && !seeded) {
    setLegalName(billing.legalName ?? "");
    setBillingEmail(billing.billingEmail ?? "");
    setCountry(billing.country ?? "");
    setSeeded(true);
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billing) return;
    saveBilling.mutate(
      {
        ...billing,
        legalName,
        billingEmail,
        country,
      },
      {
        onSuccess: () => toast.success("Datos de facturación guardados."),
        onError: () => toast.error("Error al guardar los datos de facturación."),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !billing) {
    return (
      <p className="text-sm text-destructive py-6">
        Error al cargar los datos de facturación.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Perfil de facturación</CardTitle>
          <CardDescription>
            Información utilizada para generar tus facturas y recibos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="legal-name">Razón social</Label>
              <Input
                id="legal-name"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Nombre legal de la empresa"
                disabled={saveBilling.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-email">Correo de facturación</Label>
              <Input
                id="billing-email"
                type="email"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                placeholder="facturacion@empresa.com"
                disabled={saveBilling.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">País (código ISO)</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="COL"
                disabled={saveBilling.isPending}
              />
            </div>
            <Button type="submit" disabled={saveBilling.isPending}>
              {saveBilling.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Guardar datos de facturación
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="w-full space-y-5">
      <AppPageHeader
        title="Configuración"
        description="Administra tu perfil, seguridad y datos de facturación"
      />

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="mb-5">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="facturacion">Facturación</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <PerfilTab />
        </TabsContent>

        <TabsContent value="seguridad">
          <SeguridadTab />
        </TabsContent>

        <TabsContent value="facturacion">
          <FacturacionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
