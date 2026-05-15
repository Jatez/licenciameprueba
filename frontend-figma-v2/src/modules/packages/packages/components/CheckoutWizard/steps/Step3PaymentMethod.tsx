import { Building2, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PaymentMethod } from "@/api/types";
import { packagesStrings } from "@/modules/packages/packages/strings";
import type {
  CheckoutCardFields,
  CheckoutDraft,
} from "../checkoutDraft.types";

interface Step3Props {
  draft: CheckoutDraft;
  onMethodChange: (method: PaymentMethod) => void;
  onCardChange: (fields: Partial<CheckoutCardFields>, valid: boolean) => void;
}

const cardSchema = z.object({
  cardholderName: z.string().min(3, packagesStrings.checkout.step3.errors.cardholder),
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\d{16}$/, packagesStrings.checkout.step3.errors.number),
    ),
  expiryMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, packagesStrings.checkout.step3.errors.expiryMonth),
  expiryYear: z
    .string()
    .regex(/^\d{2}$/, packagesStrings.checkout.step3.errors.expiryYear),
  cvv: z.string().regex(/^\d{3}$/, packagesStrings.checkout.step3.errors.cvv),
  forceFailure: z.boolean().optional(),
});

type CardFormValues = z.infer<typeof cardSchema>;

export function Step3PaymentMethod({
  draft,
  onMethodChange,
  onCardChange,
}: Step3Props) {
  const s = packagesStrings.checkout.step3;
  const method = draft.paymentMethod ?? "card-simulated";
  const isDev = import.meta.env.DEV;

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    mode: "onChange",
    defaultValues: {
      cardholderName: draft.cardData?.cardholderName ?? "",
      cardNumber: draft.cardData?.cardNumber ?? "",
      expiryMonth: draft.cardData?.expiryMonth ?? "",
      expiryYear: draft.cardData?.expiryYear ?? "",
      cvv: draft.cardData?.cvv ?? "",
      forceFailure: draft.cardData?.forceFailure ?? false,
    },
  });

  // Push form state to wizard so footer's "Continue" gating works.
  form.watch((values) => {
    const result = cardSchema.safeParse(values);
    onCardChange(values as Partial<CheckoutCardFields>, result.success);
  });

  return (
    <section aria-labelledby="step3-heading" className="space-y-4">
      <div className="space-y-1">
        <h2 id="step3-heading" className="text-lg font-semibold text-foreground">
          {s.title}
        </h2>
        <p className="text-sm text-muted-foreground">{s.subtitle}</p>
      </div>

      <fieldset className="space-y-3">
        <legend className="sr-only">{s.legend}</legend>
        <RadioGroup
          value={method}
          onValueChange={(v) => onMethodChange(v as PaymentMethod)}
          className="grid grid-cols-1 gap-3 md:grid-cols-2"
        >
          <Label
            htmlFor="method-card"
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4 hover:border-primary/40 has-[:checked]:border-primary"
          >
            <RadioGroupItem id="method-card" value="card-simulated" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-foreground" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">
                  {s.card}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{s.cardDescription}</p>
            </div>
          </Label>

          <Label
            htmlFor="method-bank"
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4 hover:border-primary/40 has-[:checked]:border-primary"
          >
            <RadioGroupItem id="method-bank" value="bank-transfer-simulated" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-foreground" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">
                  {s.bank}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{s.bankDescription}</p>
            </div>
          </Label>
        </RadioGroup>
      </fieldset>

      {method === "card-simulated" ? (
        <Card>
          <CardContent className="space-y-4 p-5">
            <p className="text-sm font-medium text-foreground">{s.cardFormTitle}</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="cardholderName">{s.fields.cardholder}</Label>
                <Input
                  id="cardholderName"
                  {...form.register("cardholderName")}
                  placeholder={s.placeholders.cardholder}
                />
                {form.formState.errors.cardholderName ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.cardholderName.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="cardNumber">{s.fields.number}</Label>
                <Input
                  id="cardNumber"
                  inputMode="numeric"
                  {...form.register("cardNumber")}
                  placeholder="0000 0000 0000 0000"
                />
                <p className="text-xs text-muted-foreground">{s.numberHint}</p>
                {form.formState.errors.cardNumber ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.cardNumber.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expiryMonth">{s.fields.expiryMonth}</Label>
                <Input
                  id="expiryMonth"
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="MM"
                  {...form.register("expiryMonth")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expiryYear">{s.fields.expiryYear}</Label>
                <Input
                  id="expiryYear"
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="YY"
                  {...form.register("expiryYear")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cvv">{s.fields.cvv}</Label>
                <Input
                  id="cvv"
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="123"
                  {...form.register("cvv")}
                />
              </div>
            </div>

            {isDev ? (
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox
                  checked={!!form.watch("forceFailure")}
                  onCheckedChange={(v) =>
                    form.setValue("forceFailure", v === true)
                  }
                />
                {s.forceFailure}
              </label>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-2 p-5">
            <p className="text-sm font-medium text-foreground">
              {s.transferPreviewTitle}
            </p>
            <p className="text-sm text-muted-foreground">{s.transferPreview}</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
