import { useSearchParams } from "react-router-dom";
import { isApiError } from "@/api";
import { useAuthStore } from "@/stores/authStore";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";
import { VerifyEmailWaiting } from "./parts/VerifyEmailWaiting";
import { VerifyEmailLoading } from "./parts/VerifyEmailLoading";
import { VerifyEmailSuccess } from "./parts/VerifyEmailSuccess";
import { VerifyEmailExpired } from "./parts/VerifyEmailExpired";
import { VerifyEmailAlreadyVerified } from "./parts/VerifyEmailAlreadyVerified";
import { VerifyEmailGenericError } from "./parts/VerifyEmailGenericError";

export function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const pendingEmail = useAuthStore((s) => s.pendingVerificationEmail);
  const query = useVerifyEmail(token);

  if (!token) return <VerifyEmailWaiting email={pendingEmail} />;
  if (query.isLoading || query.isFetching) return <VerifyEmailLoading />;
  if (query.data) return <VerifyEmailSuccess />;

  const code = isApiError(query.error) ? query.error.code : null;
  switch (code) {
    case "VERIFICATION_TOKEN_EXPIRED":
      return <VerifyEmailExpired />;
    case "EMAIL_ALREADY_VERIFIED":
      return <VerifyEmailAlreadyVerified />;
    default:
      return <VerifyEmailGenericError onRetry={() => query.refetch()} />;
  }
}
