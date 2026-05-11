import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/api";
import type { RegisterRequest, RegisterResponse } from "@/api";
import { useAuthStore } from "@/stores/authStore";

export function useRegister() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setPendingVerificationEmail = useAuthStore((s) => s.setPendingVerificationEmail);

  return useMutation<RegisterResponse, unknown, RegisterRequest>({
    mutationFn: (payload) => api.auth.register(payload),
    onSuccess: (data, variables) => {
      setTokens(data.tokens);
      setPendingVerificationEmail(variables.email);
      navigate("/verify-email", { replace: true });
    },
  });
}
