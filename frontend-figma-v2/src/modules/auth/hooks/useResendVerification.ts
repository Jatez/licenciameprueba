import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import type { ResendVerificationResponse } from "@/api";

const COOLDOWN_SECONDS = 60;

export function useResendVerification() {
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (intervalRef.current === null) {
      intervalRef.current = window.setInterval(() => {
        setCooldownSeconds((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    }
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cooldownSeconds]);

  const mutation = useMutation<ResendVerificationResponse, unknown, { email: string }>({
    mutationFn: (payload) => api.auth.resendVerification(payload),
    onSuccess: () => setCooldownSeconds(COOLDOWN_SECONDS),
  });

  return {
    resend: mutation.mutate,
    resendAsync: mutation.mutateAsync,
    isResending: mutation.isPending,
    cooldownSeconds,
    canResend: cooldownSeconds === 0 && !mutation.isPending,
    error: mutation.error,
  };
}
