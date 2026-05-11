/**
 * Post generator — produces coherent fake DetectedPosts.
 *
 * Pulls track snapshots from the licenses/active catalog so thumbnails and
 * titles look real. Used by the simulator's tick and dev-panel triggers.
 */
import {
  EPHEMERAL_POST_TYPES,
  POST_EPHEMERAL_DURATION_HOURS,
  type DetectedPost,
  type License,
  type PostSnapshot,
  type PostType,
  type SocialPlatformF06,
} from "@/api/types";

const CAPTIONS_ES = [
  "Probando este beat 🔥 ¿qué les parece?",
  "Detrás de cámaras de la nueva campaña ✨",
  "Día 1 del lanzamiento. Vamos con todo.",
  "Esto pasó hoy en el estudio 🎬",
  "Transición que estaba esperando hace semanas.",
  "Sonido que no me puedo sacar de la cabeza.",
  "Nuevo contenido en el feed — corran a verlo.",
  "Resumen rápido de la semana 👇",
  "¿Le ponen pausa o lo escuchan completo?",
  "Esta canción nos representa demasiado.",
];

const HASHTAGS = [
  "#marca",
  "#contenido",
  "#publicidad",
  "#campaña",
  "#lanzamiento",
  "#detrasdecamaras",
  "#sonidos",
  "#trending",
  "#fyp",
  "#reels",
  "#brandcontent",
  "#colombia",
  "#agencia",
  "#creator",
  "#community",
];

const PLATFORM_POST_TYPES: Record<SocialPlatformF06, PostType[]> = {
  instagram: ["reel", "story", "feed-post"],
  tiktok: ["tiktok-video"],
  facebook: ["facebook-post"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], min: number, max: number): T[] {
  const n = min + Math.floor(Math.random() * (max - min + 1));
  const copy = arr.slice();
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i += 1) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function fakeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildExternalUrl(platform: SocialPlatformF06, externalPostId: string): string {
  switch (platform) {
    case "instagram":
      return `https://www.instagram.com/p/${externalPostId}/`;
    case "tiktok":
      return `https://www.tiktok.com/@licenciame/video/${externalPostId}`;
    case "facebook":
      return `https://www.facebook.com/licenciame/posts/${externalPostId}`;
  }
}

export interface GenerateDetectedPostInput {
  /** Track pool (license snapshots double as our track index in the simulator). */
  trackOptions: Array<{
    trackId: string;
    title: string;
    artist: string;
    coverUrl: string | null;
  }>;
  /** Optional override — used by dev panel "force detection" buttons. */
  platform?: SocialPlatformF06;
  postType?: PostType;
  /** When provided, simulator already knows this won't match — we still build the post. */
  publishedAt?: string;
  /** Override default ephemeral lifetime (used by dev panel). */
  evidenceLifetimeOverrideMs?: number;
}

export function generateDetectedPost(input: GenerateDetectedPostInput): DetectedPost {
  const platform: SocialPlatformF06 = input.platform ?? pick(["instagram", "tiktok", "facebook"]);
  const allowedTypes = PLATFORM_POST_TYPES[platform];
  const postType: PostType = input.postType && allowedTypes.includes(input.postType)
    ? input.postType
    : pick(allowedTypes);

  const track = input.trackOptions.length
    ? pick(input.trackOptions)
    : {
        trackId: fakeId("track"),
        title: "Track desconocido",
        artist: "Artista desconocido",
        coverUrl: null,
      };

  const publishedAt = input.publishedAt
    ?? new Date(Date.now() - Math.floor(Math.random() * 30 * 60 * 1000)).toISOString();
  const detectedAt = new Date().toISOString();
  const externalPostId = fakeId("post");

  const ephemeralHours = POST_EPHEMERAL_DURATION_HOURS[postType];
  let evidenceExpiresAt: string | null = null;
  if (EPHEMERAL_POST_TYPES.includes(postType)) {
    const lifetimeMs = input.evidenceLifetimeOverrideMs
      ?? (ephemeralHours ?? 24) * 60 * 60 * 1000;
    evidenceExpiresAt = new Date(new Date(publishedAt).getTime() + lifetimeMs).toISOString();
  }

  const snapshot: PostSnapshot = {
    capturedAt: detectedAt,
    thumbnailUrl: track.coverUrl,
    caption: pick(CAPTIONS_ES),
    hashtags: pickN(HASHTAGS, 2, 5),
    detectedTrackId: track.trackId,
    detectedTrackTitle: track.title,
    detectedArtist: track.artist,
  };

  return {
    id: fakeId("dp"),
    licenseId: null,
    platform,
    postType,
    externalPostId,
    externalUrl: buildExternalUrl(platform, externalPostId),
    publishedAt,
    detectedAt,
    matchStatus: "pending-match",
    matchConfidence: null,
    matchMethod: null,
    evidenceStatus: "live",
    evidenceExpiresAt,
    snapshot,
    metrics: null,
    linkedByUserId: null,
    linkedAt: null,
    unlinkReason: null,
  };
}

/** Build a track pool from issued licenses, deduped by trackId. */
export function buildTrackPoolFromLicenses(
  licenses: License[],
): GenerateDetectedPostInput["trackOptions"] {
  const seen = new Map<string, GenerateDetectedPostInput["trackOptions"][number]>();
  for (const l of licenses) {
    if (seen.has(l.trackId)) continue;
    seen.set(l.trackId, {
      trackId: l.trackId,
      title: l.trackSnapshot.title,
      artist: l.trackSnapshot.artist,
      coverUrl: l.trackSnapshot.coverUrl,
    });
  }
  return Array.from(seen.values());
}
