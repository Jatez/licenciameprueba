import type {
  SocialDetection,
  SocialMetric,
  SocialPlatformIntegration,
} from "./types.social";

export const socialIntegrations: SocialPlatformIntegration[] = [
  { platform: "tiktok", status: "demo_connected" },
  { platform: "meta", status: "demo_connected" },
  { platform: "spotify", status: "manual" },
];

export const socialMetrics: SocialMetric[] = [
  { key: "postsAnalyzed", value: 38 },
  { key: "tracksDetected", value: 64 },
  { key: "matchedLicensable", value: 27 },
  { key: "partial", value: 9 },
  { key: "notAvailable", value: 28 },
  { key: "potentialRisks", value: 11, highlight: true },
];

export const socialDetections: SocialDetection[] = [
  {
    id: "sd_01",
    postLabel: "Reel campaña primavera",
    platform: "meta",
    trackTitle: "Midnight Pulse",
    artist: "Nova Lane",
    matchStatus: "matched",
    confidence: 98,
    licenseStatus: "not_licensed",
  },
  {
    id: "sd_02",
    postLabel: "TikTok lanzamiento producto",
    platform: "tiktok",
    trackTitle: "Golden Reels Remix",
    artist: "Marea",
    matchStatus: "partial",
    confidence: 72,
    licenseStatus: "pending_review",
  },
  {
    id: "sd_03",
    postLabel: "Ad historia 15s",
    platform: "meta",
    trackTitle: "Corporate Motion",
    artist: "SoundLab",
    matchStatus: "matched",
    confidence: 96,
    licenseStatus: "licensed",
  },
  {
    id: "sd_04",
    postLabel: "TikTok UGC Creator",
    platform: "tiktok",
    trackTitle: "City Lights",
    artist: "Orion Club",
    matchStatus: "not_available",
    confidence: 0,
    licenseStatus: "potential_risk",
  },
  {
    id: "sd_05",
    postLabel: "Reel evento",
    platform: "meta",
    trackTitle: "Event Drive",
    artist: "Pulse Unit",
    matchStatus: "legal_review",
    confidence: 61,
    licenseStatus: "not_licensed",
  },
];

export const socialSyncSteps = [
  { key: "read", label: "Leyendo publicaciones" },
  { key: "detect", label: "Detectando canciones" },
  { key: "metadata", label: "Extrayendo metadata" },
  { key: "match", label: "Cruzando contra catálogo Licénciame" },
  { key: "ready", label: "Resultados listos" },
];
