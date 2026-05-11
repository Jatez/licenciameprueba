/**
 * F-11 · Publication mocks for the 5 scenarios.
 * Generated deterministically (mulberry32 seed) so renders are stable.
 */
import type {
  LicenseStatus,
  LicenseUseType,
  MetricsScenario,
  PublicationMetric,
  PublicationPostType,
  PublicationSyncStatus,
  SocialPlatform,
} from "../types";
import { mockTracksPool } from "./tracks";
import {
  createSeededRandom,
  isoDaysAgo,
  isoHoursAgo,
  pick,
  randInt,
  viralViews,
} from "./utils";

const ALL_USE_TYPES: LicenseUseType[] = [
  "single-use",
  "stories-pack",
  "monthly-extended",
  "long-video",
  "paid-post",
  "collaborative-post",
];

const POST_TYPES_BY_PLATFORM: Record<SocialPlatform, PublicationPostType[]> = {
  instagram: ["reel", "story", "post"],
  tiktok: ["video", "short"],
  facebook: ["video", "post"],
};

const LICENSE_STATUSES: LicenseStatus[] = ["active", "consumed", "expired"];

interface GenerateOpts {
  count: number;
  seed: number;
  /** Window in days behind today. */
  windowDays: number;
  platformDistribution: Record<SocialPlatform, number>;
  /** Tracks pool size to use. Lower = more concentration in top tracks. */
  trackPoolSize: number;
  /** Fixed sync state, or "mixed" for partial scenario. */
  syncMode: "all_synced" | "mixed_partial" | "minimal";
}

function buildPublication(
  rng: () => number,
  index: number,
  opts: GenerateOpts,
  forcedPlatform?: SocialPlatform,
  forcedSync?: PublicationSyncStatus,
): PublicationMetric {
  const platform: SocialPlatform = forcedPlatform ?? pickWeighted(rng, opts.platformDistribution);
  const tracksSlice = mockTracksPool.slice(0, opts.trackPoolSize);
  const track = pick(rng, tracksSlice);
  const useType = pick(rng, ALL_USE_TYPES);
  const postType = pick(rng, POST_TYPES_BY_PLATFORM[platform]);
  const daysAgo = randInt(rng, 0, opts.windowDays - 1);
  const hourOffset = randInt(rng, 0, 23);

  const views = viralViews(rng);
  const likeRate = 0.02 + rng() * 0.06;
  const commentRate = 0.001 + rng() * 0.004;
  const shareRate = 0.001 + rng() * 0.003;
  const saveRate = platform === "facebook" ? 0 : 0.002 + rng() * 0.005;

  const sync: PublicationSyncStatus = forcedSync ?? resolveSync(rng, opts.syncMode);
  const lastSyncedAt =
    sync === "no_data"
      ? null
      : sync === "failed"
        ? isoHoursAgo(randInt(rng, 4, 12))
        : isoHoursAgo(randInt(rng, 0, 1));

  const baseLikes = Math.floor(views * likeRate);
  const baseComments = Math.floor(views * commentRate);
  const baseShares = Math.floor(views * shareRate);
  const baseSaves = Math.floor(views * saveRate);

  // Partial: views unknown yet
  const finalViews = sync === "partial" ? 0 : views;

  return {
    id: `pub_${opts.seed}_${String(index).padStart(4, "0")}`,
    publishedAt: isoDaysAgo(daysAgo, hourOffset),
    platform,
    postUrl:
      sync === "no_data"
        ? "—"
        : `https://${platform}.com/p/${randomSlug(rng)}`,
    postExternalId: `${platform.slice(0, 2).toUpperCase()}_${randomSlug(rng)}`,
    postType,
    trackId: track.id,
    trackTitle: track.title,
    trackArtist: track.artist,
    trackCoverUrl: track.coverUrl,
    licenseId: `lic_${opts.seed}_${String(index).padStart(4, "0")}`,
    licenseUseType: useType,
    licenseStatus: pick(rng, LICENSE_STATUSES),
    creditsSpent: useType === "stories-pack" ? 5 : useType === "monthly-extended" ? 12 : useType === "long-video" ? 8 : useType === "paid-post" ? 6 : useType === "collaborative-post" ? 7 : 3,
    views: finalViews,
    likes: baseLikes,
    comments: baseComments,
    shares: baseShares,
    saves: baseSaves,
    syncStatus: sync,
    lastSyncedAt,
    syncError:
      sync === "failed"
        ? "TikTok API rate limit excedido. Reintento en 1h."
        : sync === "partial"
          ? "Likes y comentarios disponibles, reproducciones pendientes."
          : undefined,
  };
}

function pickWeighted(
  rng: () => number,
  weights: Record<SocialPlatform, number>,
): SocialPlatform {
  const total = Object.values(weights).reduce((s, v) => s + v, 0);
  let r = rng() * total;
  for (const [k, v] of Object.entries(weights) as [SocialPlatform, number][]) {
    r -= v;
    if (r <= 0) return k;
  }
  return "instagram";
}

function resolveSync(rng: () => number, mode: GenerateOpts["syncMode"]): PublicationSyncStatus {
  if (mode === "all_synced") return "synced";
  if (mode === "minimal") return "synced";
  // mixed_partial handled by caller forcing specific posts
  return "synced";
}

function randomSlug(rng: () => number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[Math.floor(rng() * chars.length)];
  return out;
}

// ─── Scenario builders ───────────────────────────────────────────────────────

function buildHappy(): PublicationMetric[] {
  const rng = createSeededRandom(11_001);
  const opts: GenerateOpts = {
    count: 45,
    seed: 11001,
    windowDays: 30,
    platformDistribution: { instagram: 22, tiktok: 15, facebook: 8 },
    trackPoolSize: 10,
    syncMode: "all_synced",
  };
  return Array.from({ length: opts.count }, (_, i) => buildPublication(rng, i, opts));
}

function buildEmpty(): PublicationMetric[] {
  return [];
}

function buildSparse(): PublicationMetric[] {
  const rng = createSeededRandom(11_002);
  const opts: GenerateOpts = {
    count: 3,
    seed: 11002,
    windowDays: 30,
    platformDistribution: { instagram: 1, tiktok: 1, facebook: 1 },
    trackPoolSize: 2, // mismo track repetido
    syncMode: "all_synced",
  };
  return [
    buildPublication(rng, 0, opts, "instagram"),
    buildPublication(rng, 1, opts, "tiktok"),
    buildPublication(rng, 2, opts, "facebook"),
  ];
}

function buildPartial(): PublicationMetric[] {
  const rng = createSeededRandom(11_003);
  const opts: GenerateOpts = {
    count: 30,
    seed: 11003,
    windowDays: 30,
    platformDistribution: { instagram: 14, tiktok: 10, facebook: 6 },
    trackPoolSize: 8,
    syncMode: "mixed_partial",
  };
  const list: PublicationMetric[] = [];
  for (let i = 0; i < 30; i++) {
    let forced: PublicationSyncStatus | undefined;
    if (i < 8) forced = "partial";
    else if (i < 12) forced = "failed";
    else forced = "synced";
    list.push(buildPublication(rng, i, opts, undefined, forced));
  }
  return list;
}

function buildHeavy(): PublicationMetric[] {
  const rng = createSeededRandom(11_004);
  const opts: GenerateOpts = {
    count: 320,
    seed: 11004,
    windowDays: 90,
    platformDistribution: { instagram: 150, tiktok: 110, facebook: 60 },
    trackPoolSize: 12,
    syncMode: "all_synced",
  };
  return Array.from({ length: opts.count }, (_, i) => buildPublication(rng, i, opts));
}

const cache: Partial<Record<MetricsScenario, PublicationMetric[]>> = {};

export function getPublicationsForScenario(scenario: MetricsScenario): PublicationMetric[] {
  if (cache[scenario]) return cache[scenario]!;
  let result: PublicationMetric[];
  switch (scenario) {
    case "happy": result = buildHappy(); break;
    case "empty": result = buildEmpty(); break;
    case "sparse": result = buildSparse(); break;
    case "partial": result = buildPartial(); break;
    case "heavy": result = buildHeavy(); break;
  }
  cache[scenario] = result;
  return result;
}
