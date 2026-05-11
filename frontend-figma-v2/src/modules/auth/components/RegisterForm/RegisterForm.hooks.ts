import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isApiError } from "@/api";
import { registerSchema } from "../../utils/registerSchema";
import { mapApiErrorToField } from "../../utils/mapApiErrorToField";
import { DEFAULT_COUNTRY_CODE } from "../../utils/countries";
import { useRegister } from "../../hooks/useRegister";
import { useAuthErrorMessage } from "../../hooks/useAuthErrorMessage";
import { authStrings } from "../../strings";
import type { RegisterFormValues } from "./RegisterForm.types";

export function useRegisterFormController() {
  const navigate = useNavigate();
  const register = useRegister();
  const toMessage = useAuthErrorMessage();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      companyName: "",
      countryCode: DEFAULT_COUNTRY_CODE,
      fullName: "",
      email: "",
      role: undefined as unknown as RegisterFormValues["role"],
      password: "",
      acceptedTerms: false as unknown as true,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await register.mutateAsync(values as Required<RegisterFormValues>);
      toast.success(authStrings.register.toast.success.title, {
        description: authStrings.register.toast.success.description,
      });
    } catch (error) {
      const { code, message } = toMessage(error);
      const field = mapApiErrorToField(code);
      if (field) {
        form.setError(field, { type: "server", message });
        return;
      }
      if (code === "EMAIL_ALREADY_EXISTS") {
        toast.error(message, {
          action: {
            label: authStrings.register.toast.emailExistsAction,
            onClick: () => navigate("/forgot-password"),
          },
        });
        return;
      }
      toast.error(isApiError(error) ? message : authStrings.register.errors.NETWORK_ERROR);
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting: register.isPending || form.formState.isSubmitting,
  };
}
