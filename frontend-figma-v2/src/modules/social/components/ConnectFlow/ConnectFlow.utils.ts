import type { SocialPlatformF06 } from "@/api/types";
import type { MockConnectionResult } from "./ConnectFlow.types";

const USERNAMES: Record<SocialPlatformF06, string[]> = {
  instagram: ["@tu_marca_oficial", "@licenciame.studio", "@brand.demo"],
  tiktok: ["@tu_marca", "@brand.tiktok", "@demo.account"],
  facebook: ["Tu Marca Oficial", "Licénciame Demo", "Brand Studio"],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function initialFor(username: string): string {
  const cleaned = username.replace(/^@/, "").trim();
  return (cleaned[0] ?? "L").toUpperCase();
}

/**
 * Generates a deterministic-shape mock connection result.
 *
 * Backend hand-off: when OAuth is wired, the real callback returns this same
 * shape from `POST /social-accounts/oauth/callback`.
 */
export function generateMockConnection(platform: SocialPlatformF06): MockConnectionResult {
  const username = pickRandom(USERNAMES[platform]);
  return {
    username,
    displayName: "Empresa Licénciame",
    avatarInitial: initialFor(username),
    postsFound: 15 + Math.floor(Math.random() * 36),
    connectedAt: new Date().toISOString(),
  };
}
