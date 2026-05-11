import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { accessStrings } from "../strings";
import { ACCESS_COMPANIES, type InviteRole } from "../types";
import { inviteUserSchema, type InviteUserFormValues } from "../utils/inviteUserSchema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSent?: (values: InviteUserFormValues) => void;
}

const ROLES: InviteRole[] = ["empresa_admin", "empresa_user", "super_admin"];

function generateToken() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export function InviteUserDialog({ open, onOpenChange, onSent }: Props) {
  const t = accessStrings.invite;
  const [step, setStep] = useState<"form" | "preview">("form");
  const [submitting, setSubmitting] = useState(false);
  const [token] = useState(generateToken());

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      fullName: "",
      company: "",
      role: "empresa_user",
      language: "es",
      forceMfa: true,
    },
    mode: "onBlur",
  });

  const reset = () => {
    form.reset();
    setStep("form");
    setSubmitting(false);
  };

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleNext = form.handleSubmit(() => setStep("preview"));

  const handleSend = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const values = form.getValues();
    setSubmitting(false);
    toast.success(t.sentToast);
    onSent?.(values);
    handleClose(false);
  };

  const values = form.getValues();
  const errors = form.formState.errors;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={step === "form" ? "font-semibold text-foreground" : ""}>
            1. {t.steps.form}
          </span>
          <span>·</span>
          <span className={step === "preview" ? "font-semibold text-foreground" : ""}>
            2. {t.steps.preview}
          </span>
        </div>

        {step === "form" && (
          <form onSubmit={handleNext} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">{t.fields.email}</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder={t.fields.emailPlaceholder}
                {...form.register("email")}
              />
              {errors.email && (
                <p className="text-xs text-error">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="invite-name">{t.fields.fullName}</Label>
              <Input
                id="invite-name"
                placeholder={t.fields.fullNamePlaceholder}
                {...form.register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-error">{errors.fullName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t.fields.company}</Label>
                <Select
                  value={form.watch("company")}
                  onValueChange={(v) => form.setValue("company", v, { shouldValidate: true })}
                >
                  <SelectTrigger aria-label={t.fields.company}>
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCESS_COMPANIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.company && (
                  <p className="text-xs text-error">{errors.company.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>{t.fields.role}</Label>
                <Select
                  value={form.watch("role")}
                  onValueChange={(v) => form.setValue("role", v as InviteRole)}
                >
                  <SelectTrigger aria-label={t.fields.role}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {t.roles[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{t.fields.language}</Label>
              <Select
                value={form.watch("language")}
                onValueChange={(v) => form.setValue("language", v as "es" | "en")}
              >
                <SelectTrigger aria-label={t.fields.language}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">{t.languages.es}</SelectItem>
                  <SelectItem value="en">{t.languages.en}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <label className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox
                checked={form.watch("forceMfa")}
                onCheckedChange={(c) => form.setValue("forceMfa", Boolean(c))}
              />
              {t.fields.forceMfa}
            </label>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleClose(false)}>
                {t.cancel}
              </Button>
              <Button type="submit">{t.next}</Button>
            </DialogFooter>
          </form>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {t.preview.heading}
              </div>
              <p className="text-sm font-semibold text-foreground">
                {t.preview.subject("Licénciame")}
              </p>
              <p className="whitespace-pre-line text-sm text-foreground">
                {t.preview.body(
                  values.fullName,
                  t.roles[values.role],
                  values.company,
                )}
              </p>
              <Separator />
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t.preview.linkLabel}
                </p>
                <p className="break-all rounded bg-background px-2 py-1 text-xs font-tnum text-foreground">
                  {t.preview.mockToken(`inv-${token}`)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Destinatario: <span className="text-foreground">{values.email}</span>
                {" · "}MFA: <span className="text-foreground">{values.forceMfa ? "obligatorio" : "opcional"}</span>
              </p>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setStep("form")} disabled={submitting}>
                {t.back}
              </Button>
              <Button onClick={handleSend} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    {t.sending}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {t.send}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
