import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authStrings } from "@/modules/auth/strings";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/modules/auth/utils/loginSchema";
import { useMockPasswordReset } from "@/modules/auth/hooks/useMockPasswordReset";

export function ForgotPasswordForm() {
  const t = authStrings.forgotPassword;
  const { requestReset, isPending } = useMockPasswordReset();
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await requestReset(values.email);
    setSent(true);
  });

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-foreground">
          <MailCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{t.success.title}</h1>
          <p className="text-sm text-muted-foreground">{t.success.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild size="lg">
            <Link to="/reset-password?token=mock">{t.success.demoLink}</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> {t.backToLogin}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
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

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? t.submitting : t.submit}
        </Button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t.backToLogin}
        </Link>
      </form>
    </div>
  );
}
