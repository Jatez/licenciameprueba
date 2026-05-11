import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { authStrings } from "../../../strings";
import type { RegisterFormValues } from "../RegisterForm.types";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  isSubmitting: boolean;
}

export function RegisterFormFooter({ form, isSubmitting }: Props) {
  const t = authStrings.register;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="acceptedTerms"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-start gap-2">
              <FormControl>
                <Checkbox
                  id="acceptedTerms"
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  disabled={isSubmitting}
                  aria-describedby="acceptedTerms-message"
                />
              </FormControl>
              <label htmlFor="acceptedTerms" className="text-sm leading-snug text-foreground">
                {t.fields.acceptedTerms.label}
              </label>
            </div>
            <div id="acceptedTerms-message">
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? t.submitting : t.submit}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t.alreadyHaveAccount}{" "}
        <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          {t.login}
        </Link>
      </p>
    </div>
  );
}
