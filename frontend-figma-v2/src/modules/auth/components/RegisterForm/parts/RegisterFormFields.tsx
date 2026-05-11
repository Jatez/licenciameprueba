import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authStrings } from "../../../strings";
import { isCorporateEmail } from "../../../utils/isCorporateEmail";
import { CountrySelect } from "../../CountrySelect";
import { RoleSelect } from "../../RoleSelect";
import { PasswordInput } from "../../PasswordInput";
import { NonCorporateEmailWarning } from "./NonCorporateEmailWarning";
import type { RegisterFormValues } from "../RegisterForm.types";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  disabled?: boolean;
}

export function RegisterFormFields({ form, disabled }: Props) {
  const f = authStrings.register.fields;
  const emailValue = form.watch("email");
  const emailError = form.formState.errors.email;
  const showCorporateWarning =
    !emailError &&
    emailValue.length > 0 &&
    emailValue.includes("@") &&
    !isCorporateEmail(emailValue);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{f.companyName.label}</FormLabel>
            <FormControl>
              <Input autoComplete="organization" disabled={disabled} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="countryCode"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>{f.countryCode.label}</FormLabel>
            <FormControl>
              <CountrySelect
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={disabled}
                aria-invalid={!!fieldState.error}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{f.fullName.label}</FormLabel>
            <FormControl>
              <Input autoComplete="name" disabled={disabled} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{f.email.label}</FormLabel>
            <FormControl>
              <Input
                type="email"
                autoComplete="email"
                placeholder={f.email.placeholder}
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
            {showCorporateWarning && <NonCorporateEmailWarning />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="role"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>{f.role.label}</FormLabel>
            <FormControl>
              <RoleSelect
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={disabled}
                aria-invalid={!!fieldState.error}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{f.password.label}</FormLabel>
            <FormControl>
              <PasswordInput autoComplete="new-password" disabled={disabled} {...field} />
            </FormControl>
            <FormDescription>{f.password.requirements}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
