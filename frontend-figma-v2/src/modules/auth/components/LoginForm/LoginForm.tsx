import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/modules/auth/components/PasswordInput/PasswordInput";
import { AuthAlert } from "@/modules/auth/components/AuthAlert";
import { DemoRoleSwitcher } from "@/modules/auth/components/DemoRoleSwitcher";
import { authStrings } from "@/modules/auth/strings";
import { loginSchema, type LoginFormValues } from "@/modules/auth/utils/loginSchema";
import { authApi } from "@/modules/auth/api";
import { useAuthStore } from "@/stores/authStore";

export function LoginForm() {
  const t = authStrings.login;
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const doLogin = async (email: string, password: string) => {
    setIsPending(true);
    setServerError(null);
    try {
      const { tokens } = await authApi.login(email, password);
      setTokens(tokens);
      navigate("/dashboard03");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Credenciales inválidas";
      setServerError(msg);
    } finally {
      setIsPending(false);
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    await doLogin(values.email, values.password);
  });

  const fillDemo = async (email: string, password: string) => {
    form.setValue("email", email);
    form.setValue("password", password);
    await doLogin(email, password);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {serverError ? (
          <AuthAlert tone="error" description={serverError} />
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">{t.fields.email.label}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t.fields.email.placeholder}
            {...form.register("email")}
            aria-invalid={!!form.formState.errors.email}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.fields.password.label}</Label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
            >
              {t.forgot}
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder={t.fields.password.placeholder}
            {...form.register("password")}
            aria-invalid={!!form.formState.errors.password}
          />
          {form.formState.errors.password ? (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={form.watch("remember") ?? false}
            onCheckedChange={(v) => form.setValue("remember", v === true)}
          />
          <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
            {t.fields.remember.label}
          </Label>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? t.submitting : t.submit}
        </Button>

        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          {t.trust}
        </p>

        <p className="text-center text-sm text-muted-foreground">
          {t.noAccount}{" "}
          <Link
            to="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t.register}
          </Link>
        </p>
      </form>

      <DemoRoleSwitcher onPick={fillDemo} disabled={isPending} />
    </div>
  );
}
