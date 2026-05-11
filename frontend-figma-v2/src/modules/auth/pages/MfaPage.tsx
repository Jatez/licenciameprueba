import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { MfaVerification } from "@/modules/auth/components/MfaVerification";

export default function Mfa() {
  return (
    <AuthLayout>
      <MfaVerification />
    </AuthLayout>
  );
}
