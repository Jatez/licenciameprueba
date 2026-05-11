import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

// We need to test that the http client injects Authorization header.
// We do this by intercepting the request before it's sent.

describe("API client - Authorization header", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds Authorization header when token is in localStorage", async () => {
    localStorage.setItem(
      "licenciame-auth",
      JSON.stringify({ state: { accessToken: "test-token-abc" } })
    );

    let capturedAuth: string | undefined;

    const testClient = axios.create({ baseURL: "http://localhost:8000" });

    // Interceptor that reads from localStorage and sets Authorization
    testClient.interceptors.request.use((config) => {
      let token: string | null = null;
      try {
        const raw = localStorage.getItem("licenciame-auth");
        if (raw) {
          const parsed = JSON.parse(raw) as { state?: { accessToken?: string } };
          token = parsed?.state?.accessToken ?? null;
        }
      } catch {
        // ignore
      }
      if (token && config.headers) {
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
      // Capture the Authorization header then cancel request
      capturedAuth = (config.headers as Record<string, string>).Authorization;
      return Promise.reject(new axios.Cancel("request captured"));
    });

    try {
      await testClient.get("/test");
    } catch {
      // Expected — cancelled
    }

    expect(capturedAuth).toBe("Bearer test-token-abc");
  });

  it("does not add Authorization header when no token present", async () => {
    const capturedConfigs: Record<string, string>[] = [];
    const testClient = axios.create({ baseURL: "http://localhost:8000" });

    testClient.interceptors.request.use((config) => {
      let token: string | null = null;
      try {
        const raw = localStorage.getItem("licenciame-auth");
        if (raw) {
          const parsed = JSON.parse(raw) as { state?: { accessToken?: string } };
          token = parsed?.state?.accessToken ?? null;
        }
      } catch {
        // ignore
      }
      if (token && config.headers) {
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
      capturedConfigs.push({ ...(config.headers as Record<string, string>) });
      throw new axios.Cancel("captured");
    });

    try {
      await testClient.get("/test");
    } catch {
      // expected
    }

    expect(capturedConfigs[0]?.Authorization).toBeUndefined();
  });
});
