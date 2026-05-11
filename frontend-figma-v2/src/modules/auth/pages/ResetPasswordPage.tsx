import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { ResetPasswordForm } from "@/modules/auth/components/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}
