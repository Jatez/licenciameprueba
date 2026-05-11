import { Form } from "@/components/ui/form";
import { authStrings } from "../../strings";
import { useRegisterFormController } from "./RegisterForm.hooks";
import { RegisterFormFields } from "./parts/RegisterFormFields";
import { RegisterFormFooter } from "./parts/RegisterFormFooter";

export function RegisterForm() {
  const { form, onSubmit, isSubmitting } = useRegisterFormController();
  const t = authStrings.register;

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">{t.title}</h2>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </header>
      <Form {...form}>
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          <RegisterFormFields form={form} disabled={isSubmitting} />
          <RegisterFormFooter form={form} isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
}
