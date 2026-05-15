import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BillingProfile } from "@/api/types";
import {
  useBillingProfile,
  useSaveBillingProfile,
} from "@/modules/packages/packages/hooks";
import { packagesStrings } from "@/modules/packages/packages/strings";

interface Step2Props {
  initial: BillingProfile | null;
  onSaved: (profile: BillingProfile) => void;
}

const NIT_REGEX = /^\d{3}\.\d{3}\.\d{3}-\d{1}$/;
const PHONE_REGEX = /^\+?\d[\d\s-]{7,18}$/;

function buildSchema() {
  const e = packagesStrings.checkout.step2.errors;
  return z.object({
    legalName: z.string().trim().min(3, e.legalName).max(200, e.legalName),
    taxId: z
      .string()
      .trim()
      .regex(NIT_REGEX, e.taxId),
    taxpayerType: z.enum(["natural", "juridica"], { required_error: e.required }),
    taxRegime: z.enum(
      [
        "responsable-iva",
        "no-responsable-iva",
        "regimen-simple",
        "gran-contribuyente",
      ],
      { required_error: e.required },
    ),
    billingEmail: z
      .string()
      .trim()
      .email(e.email)
      .max(255, e.email),
    fiscalAddress: z.string().trim().min(5, e.fiscalAddress).max(200, e.fiscalAddress),
    city: z.string().trim().min(2, e.city).max(100, e.city),
    country: z.string().min(2, e.required),
    contactName: z.string().trim().min(3, e.contactName).max(100, e.contactName),
    contactPhone: z
      .string()
      .trim()
      .regex(PHONE_REGEX, e.contactPhone),
  });
}

export function Step2BillingProfile({ initial, onSaved }: Step2Props) {
  const s = packagesStrings.checkout.step2;
  const profile = useBillingProfile();
  const save = useSaveBillingProfile();
  const schema = buildSchema();

  const form = useForm<BillingProfile>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? profile.data ?? {
      legalName: "",
      taxId: "",
      taxpayerType: "juridica",
      taxRegime: "responsable-iva",
      billingEmail: "",
      fiscalAddress: "",
      city: "",
      country: "COL",
      contactName: "",
      contactPhone: "",
    },
  });

  // Hydrate when fetched data arrives.
  useEffect(() => {
    if (!initial && profile.data) form.reset(profile.data);
  }, [initial, profile.data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const saved = await save.mutateAsync(values);
    onSaved(saved);
  });

  if (profile.isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const fieldErrorId = (name: keyof BillingProfile) => `${name}-error`;

  return (
    <section aria-labelledby="step2-heading" className="space-y-4">
      <div className="space-y-1">
        <h2 id="step2-heading" className="text-lg font-semibold text-foreground">
          {s.title}
        </h2>
        <p className="text-sm text-muted-foreground">{s.subtitle}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="legalName">{s.fields.legalName}</Label>
            <Input
              id="legalName"
              {...form.register("legalName")}
              aria-invalid={!!form.formState.errors.legalName}
              aria-describedby={fieldErrorId("legalName")}
              placeholder={s.placeholders.legalName}
            />
            {form.formState.errors.legalName ? (
              <p id={fieldErrorId("legalName")} className="text-xs text-destructive">
                {form.formState.errors.legalName.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="taxId">{s.fields.taxId}</Label>
            <Input
              id="taxId"
              {...form.register("taxId")}
              aria-invalid={!!form.formState.errors.taxId}
              aria-describedby={fieldErrorId("taxId")}
              placeholder="900.123.456-7"
            />
            {form.formState.errors.taxId ? (
              <p id={fieldErrorId("taxId")} className="text-xs text-destructive">
                {form.formState.errors.taxId.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{s.hints.taxId}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="taxpayerType">{s.fields.taxpayerType}</Label>
            <Select
              value={form.watch("taxpayerType")}
              onValueChange={(v) => form.setValue("taxpayerType", v as "natural" | "juridica", { shouldValidate: true })}
            >
              <SelectTrigger id="taxpayerType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="juridica">{s.taxpayerTypes.juridica}</SelectItem>
                <SelectItem value="natural">{s.taxpayerTypes.natural}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="taxRegime">{s.fields.taxRegime}</Label>
            <Select
              value={form.watch("taxRegime")}
              onValueChange={(v) => form.setValue("taxRegime", v as BillingProfile["taxRegime"], { shouldValidate: true })}
            >
              <SelectTrigger id="taxRegime">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="responsable-iva">{s.taxRegimes["responsable-iva"]}</SelectItem>
                <SelectItem value="no-responsable-iva">{s.taxRegimes["no-responsable-iva"]}</SelectItem>
                <SelectItem value="regimen-simple">{s.taxRegimes["regimen-simple"]}</SelectItem>
                <SelectItem value="gran-contribuyente">{s.taxRegimes["gran-contribuyente"]}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="billingEmail">{s.fields.billingEmail}</Label>
            <Input
              id="billingEmail"
              type="email"
              {...form.register("billingEmail")}
              aria-invalid={!!form.formState.errors.billingEmail}
              aria-describedby={fieldErrorId("billingEmail")}
              placeholder={s.placeholders.billingEmail}
            />
            {form.formState.errors.billingEmail ? (
              <p id={fieldErrorId("billingEmail")} className="text-xs text-destructive">
                {form.formState.errors.billingEmail.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="fiscalAddress">{s.fields.fiscalAddress}</Label>
            <Input
              id="fiscalAddress"
              {...form.register("fiscalAddress")}
              aria-invalid={!!form.formState.errors.fiscalAddress}
              aria-describedby={fieldErrorId("fiscalAddress")}
              placeholder={s.placeholders.fiscalAddress}
            />
            {form.formState.errors.fiscalAddress ? (
              <p id={fieldErrorId("fiscalAddress")} className="text-xs text-destructive">
                {form.formState.errors.fiscalAddress.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="city">{s.fields.city}</Label>
            <Input
              id="city"
              {...form.register("city")}
              aria-invalid={!!form.formState.errors.city}
              placeholder={s.placeholders.city}
            />
            {form.formState.errors.city ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.city.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="country">{s.fields.country}</Label>
            <Select
              value={form.watch("country")}
              onValueChange={(v) => form.setValue("country", v, { shouldValidate: true })}
            >
              <SelectTrigger id="country">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COL">{s.countries.COL}</SelectItem>
                <SelectItem value="MEX">{s.countries.MEX}</SelectItem>
                <SelectItem value="ARG">{s.countries.ARG}</SelectItem>
                <SelectItem value="CHL">{s.countries.CHL}</SelectItem>
                <SelectItem value="PER">{s.countries.PER}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contactName">{s.fields.contactName}</Label>
            <Input
              id="contactName"
              {...form.register("contactName")}
              aria-invalid={!!form.formState.errors.contactName}
              placeholder={s.placeholders.contactName}
            />
            {form.formState.errors.contactName ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.contactName.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contactPhone">{s.fields.contactPhone}</Label>
            <Input
              id="contactPhone"
              {...form.register("contactPhone")}
              aria-invalid={!!form.formState.errors.contactPhone}
              placeholder="+57 3001234567"
            />
            {form.formState.errors.contactPhone ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.contactPhone.message}
              </p>
            ) : null}
          </div>
        </div>

        {save.isError ? (
          <Alert variant="destructive">
            <AlertDescription>{s.saveError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            {s.submit}
          </Button>
        </div>
      </form>
    </section>
  );
}
