/**
 * Brand colors for the OAuth simulator step.
 *
 * ⚠️ These hex values are HARDCODED ON PURPOSE — they only render inside the
 * simulated OAuth popup (`OAuthSimulatorStep`) to mimic the real provider
 * screens (Instagram pink, TikTok black, Facebook blue). The rest of the app
 * sticks strictly to design system tokens.
 *
 * Do NOT promote these values to the global Tailwind theme.
 */
import type { SocialPlatformF06 } from "@/api/types";

export interface PlatformBrand {
  /** Tailwind class for the popup header background. */
  headerBg: string;
  /** Tailwind classes for the primary "Authorize" button. */
  buttonBg: string;
  /** Tailwind class for the button text color. */
  buttonText: string;
  /** Mock domain shown in the fake browser chrome. */
  domain: string;
}

export const PLATFORM_BRAND: Record<SocialPlatformF06, PlatformBrand> = {
  instagram: {
    headerBg: "bg-[#E1306C]",
    buttonBg: "bg-[#E1306C] hover:bg-[#C13584]",
    buttonText: "text-white",
    domain: "accounts.instagram.com",
  },
  tiktok: {
    headerBg: "bg-black",
    buttonBg: "bg-black hover:bg-neutral-800",
    buttonText: "text-white",
    domain: "www.tiktok.com",
  },
  facebook: {
    headerBg: "bg-[#1877F2]",
    buttonBg: "bg-[#1877F2] hover:bg-[#166FE5]",
    buttonText: "text-white",
    domain: "www.facebook.com",
  },
};
