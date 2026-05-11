/**
 * Deterministic mock catalog generator.
 *
 * Produces 15.000 tracks from a fixed seed so the same IDs always map to the
 * same metadata across reloads, sessions and developers.
 *
 * NEVER import this file from components — go through `api/endpoints/catalog`.
 */

import type {
  Genre,
  LicensablePlatform,
  Mood,
  PlatformLicensability,
  Track,
} from "@/api/types";
import type { LicenseUsageType } from "@/api/types.dashboard";

// ─── PRNG ────────────────────────────────────────────────────────────────────

/** Mulberry32: tiny deterministic PRNG. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED = 42;
const TOTAL_TRACKS = 15000;

// ─── Banks ───────────────────────────────────────────────────────────────────

const ARTIST_BANK = [
  "Luna Cortés", "Mateo Ríos", "The Northern Lights", "Aurora Vélez", "Kai Tanaka",
  "Sofía del Mar", "Black Cat Theory", "Diego Maravilla", "Isabella Wren", "Nico Aurelio",
  "Valeria Bloom", "Sundown Society", "Camila Estrella", "Andrés Mercurio", "Paloma Reyes",
  "Velvet Compass", "Julián Aragón", "Marina Vega", "Tomás Cordillera", "Helena Solana",
  "Galaxy Brothers", "Lucía Atlántico", "El Trío Suburbano", "Renata Bosque", "Iván Peregrino",
  "Antonia Alba", "The Blue Hour", "Sebastián Costa", "Olivia Ferrer", "Ramiro Calderón",
  "Indie Río", "Catalina Mendoza", "Rocío Silente", "Gabriel Norte", "Bruna Ipanema",
  "Coral Reverb", "Salvador Lima", "Manuela Polvo", "Esteban Rumbo", "Frida Velasco",
  "The Velvet Tide", "Joaquín Roble", "Adriana Sirena", "Felipe Estuario", "Carmen Eclipse",
  "Lobo Negro", "Verano Suave", "Ámbar Lagos", "Damián Pulse", "Renee Astral",
  "The Cosmic Bus", "Itzel Brisa", "Octavio Valle", "Rosa Cinética", "Hugo Manantial",
  "Las Hermanas Vidal", "Pablo Cardenal", "Constanza Río", "Mauricio Eco", "Daniela Tundra",
  "Atlas Mirage", "Inés Caracol", "Bruno Faro", "Magnolia Sur", "Tristán Argento",
  "Quetzal Ardilla", "Rocco Verbena", "Luz del Páramo", "Emiliano Cobalto", "Sara Crepúsculo",
  "The Late Bloomers", "Vincent Cardumen", "Nora Sándalo", "Hernán Trazado", "Pilar Estuche",
  "Plata Caliente", "Romina Calzada", "Aitor Bahía", "Greta Ribera", "Cristian Silbo",
  "The Saltwater Choir", "Ema Cobre", "Beto Manantial", "Nadia Cártel", "Jonás Acueducto",
  "Lirio Eléctrico", "Sandra Pulso", "Yago Cifra", "Beatriz Ártico", "Tobías Galaxia",
  "Coro de Tijuana", "Fátima Resaca", "Boris Cordón", "Inti Reverbero", "Leonor Tahona",
  "The Mango Sessions", "Mara Telar", "Edgardo Brújula", "Selene Fragua", "Ulises Pampa",
];

const TITLE_WORDS = [
  "Aurora", "Luz", "Río", "Norte", "Sur", "Calle", "Cielo", "Mar", "Eclipse", "Verano",
  "Invierno", "Lunar", "Astral", "Eterno", "Latido", "Pulso", "Sombra", "Pureza", "Vértigo",
  "Hogar", "Ruta", "Sendero", "Faro", "Ola", "Tormenta", "Calma", "Niebla", "Brisa",
  "Corriente", "Ámbar", "Cobalto", "Carmín", "Plata", "Oro", "Vidrio", "Espejo", "Sal",
  "Fuego", "Hielo", "Polvo", "Tierra", "Madera", "Acero", "Seda", "Lino", "Algodón",
  "Mañana", "Noche", "Tarde", "Alba", "Crepúsculo", "Mediodía", "Madrugada", "Domingo",
  "Cumbre", "Valle", "Llanura", "Bosque", "Selva", "Páramo", "Sabana", "Costa", "Bahía",
  "Constelación", "Galaxia", "Cometa", "Planeta", "Satélite", "Órbita", "Estela", "Luna",
  "Renacer", "Origen", "Vuelo", "Salto", "Camino", "Paso", "Huella", "Eco", "Voz",
  "Promesa", "Recuerdo", "Olvido", "Memoria", "Sueño", "Despertar", "Latín", "Murmullo",
  "Compás", "Acorde", "Verso", "Estribillo", "Coro", "Ritmo", "Silencio", "Himno",
  "Nudo", "Lazo", "Cadena", "Hilo", "Trama", "Tejido", "Bordado", "Pliegue", "Costura",
  "Catalejo", "Ventana", "Puerta", "Umbral", "Tejado", "Pasillo", "Atalaya", "Mirador",
  "Carmesí", "Esmeralda", "Marfil", "Carbón", "Cuarzo", "Cristal", "Mármol", "Pizarra",
  "Antares", "Vega", "Sirius", "Polaris", "Andrómeda", "Casiopea", "Orión", "Pegaso",
  "Tropical", "Boreal", "Austral", "Desierto", "Oasis", "Manantial", "Cascada", "Laguna",
  "Caribe", "Atlántico", "Pacífico", "Mediterráneo", "Caspio", "Báltico", "Egeo", "Jónico",
  "Festín", "Brindis", "Banquete", "Rito", "Ofrenda", "Ceremonia", "Procesión", "Cortejo",
  "Vértice", "Espiral", "Círculo", "Triángulo", "Cubo", "Prisma", "Esfera", "Cilindro",
  "Saudade", "Nostalgia", "Anhelo", "Esperanza", "Promesa", "Júbilo", "Calma", "Vértigo",
  "Aire", "Viento", "Brújula", "Cardinal", "Ruta", "Travesía", "Ancla", "Vela",
  "Volcán", "Cráter", "Géiser", "Falla", "Magma", "Ceniza", "Roca", "Arena",
  "Susurro", "Grito", "Eco", "Resonancia", "Vibración", "Onda", "Frecuencia", "Tono",
  "Granito", "Pórfido", "Basalto", "Caliza", "Yeso", "Pizarra", "Lava", "Coral",
  "Pájaro", "Halcón", "Águila", "Garza", "Ibis", "Cisne", "Tórtola", "Cóndor",
];

const MOOD_BANK: Mood[] = [
  "energético", "melancólico", "corporativo", "épico", "chill", "romántico",
  "tenso", "alegre", "sombrío", "motivacional", "relajante", "dramático",
  "juguetón", "nostálgico", "poderoso",
];

const TAG_BANK = [
  "upbeat", "downtempo", "cinematic", "minimalist", "lush", "vintage",
  "modern", "warm", "cold", "groovy", "anthemic", "intimate", "bold",
];

const LANGUAGES = ["es", "en", "pt", "fr", null, null];

// Genre distribution (cumulative thresholds matching the prompt percentages).
const GENRE_DISTRIBUTION: Array<{ genre: Genre; threshold: number }> = [
  { genre: "pop", threshold: 0.25 },
  { genre: "latin", threshold: 0.40 },
  { genre: "electronic", threshold: 0.52 },
  { genre: "rock", threshold: 0.62 },
  { genre: "hip-hop", threshold: 0.72 },
  { genre: "reggaeton", threshold: 0.80 },
  { genre: "jazz", threshold: 0.85 },
  { genre: "indie", threshold: 0.90 },
  { genre: "cinematic", threshold: 0.94 },
  { genre: "corporate", threshold: 0.97 },
  { genre: "rnb", threshold: 0.98 },
  { genre: "folk", threshold: 0.985 },
  { genre: "ambient", threshold: 0.99 },
  { genre: "classical", threshold: 0.995 },
  { genre: "acoustic", threshold: 0.998 },
  { genre: "world", threshold: 1.0 },
];

const ALL_PLATFORMS: LicensablePlatform[] = ["instagram", "tiktok", "facebook"];
const ALL_USAGE_TYPES: LicenseUsageType[] = [
  "single-use",
  "stories-pack",
  "monthly-extended",
  "long-video",
  "paid-post",
  "collaborative-post",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickGenre(rnd: () => number): Genre {
  const r = rnd();
  for (const { genre, threshold } of GENRE_DISTRIBUTION) {
    if (r <= threshold) return genre;
  }
  return "pop";
}

/** Box–Muller approximation for normally distributed durations. */
function pickDuration(rnd: () => number): number {
  const u1 = Math.max(rnd(), 1e-6);
  const u2 = rnd();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const sec = Math.round(180 + z * 40);
  return Math.max(60, Math.min(300, sec));
}

function pickPopularity(rnd: () => number): number {
  const r = rnd();
  if (r < 0.7) return Math.round(20 + rnd() * 40);
  if (r < 0.9) return Math.round(60 + rnd() * 25);
  return Math.round(85 + rnd() * 15);
}

function pickMoods(rnd: () => number): Mood[] {
  if (rnd() < 0.30) return [];
  const count = 1 + Math.floor(rnd() * 3);
  const picked = new Set<Mood>();
  while (picked.size < count) {
    picked.add(MOOD_BANK[Math.floor(rnd() * MOOD_BANK.length)]);
  }
  return Array.from(picked);
}

function pickTags(rnd: () => number): string[] {
  const count = Math.floor(rnd() * 4);
  const picked = new Set<string>();
  while (picked.size < count) {
    picked.add(TAG_BANK[Math.floor(rnd() * TAG_BANK.length)]);
  }
  return Array.from(picked);
}

function pickTitle(rnd: () => number): string {
  const a = TITLE_WORDS[Math.floor(rnd() * TITLE_WORDS.length)];
  const b = TITLE_WORDS[Math.floor(rnd() * TITLE_WORDS.length)];
  if (rnd() < 0.4) return a;
  return `${a} ${b.toLowerCase()}`;
}

function buildLicensability(rnd: () => number): PlatformLicensability[] {
  const restricted = rnd() < 0.15;
  return ALL_PLATFORMS.map((platform) => {
    let allowed = true;
    let allowedUsageTypes = ALL_USAGE_TYPES;
    let maxDurationSec: number | null = null;
    let notes: string | null = null;
    if (restricted) {
      if (platform === "facebook" && rnd() < 0.5) {
        allowed = false;
        allowedUsageTypes = [];
        notes = "Sin licencia para Facebook por restricción del catálogo.";
      } else if (rnd() < 0.5) {
        allowedUsageTypes = ALL_USAGE_TYPES.filter((t) => t !== "paid-post");
        notes = "No disponible para publicaciones con pauta.";
      } else if (platform === "instagram") {
        maxDurationSec = 60;
      }
    }
    return { platform, allowed, allowedUsageTypes, maxDurationSec, notes };
  });
}

function platformsLicensableFor(track: Track): LicensablePlatform[] {
  return track.platformLicensability.filter((p) => p.allowed).map((p) => p.platform);
}

function buildWaveform(rnd: () => number): number[] | null {
  if (rnd() < 0.20) return null;
  return Array.from({ length: 200 }, () => Math.max(0.05, Math.min(1, rnd() * 0.8 + 0.1)));
}

function isoDateBetween(rnd: () => number, fromYear: number, toYear: number): string {
  const year = fromYear + Math.floor(rnd() * (toYear - fromYear + 1));
  const month = 1 + Math.floor(rnd() * 12);
  const day = 1 + Math.floor(rnd() * 28);
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
}

// ─── Generator ───────────────────────────────────────────────────────────────

export function generateTracks(count: number): Track[] {
  const rnd = mulberry32(SEED);
  const tracks: Track[] = [];
  for (let i = 0; i < count; i++) {
    const id = `trk_${(i + 1).toString().padStart(6, "0")}`;
    const genre = pickGenre(rnd);
    const artist = ARTIST_BANK[Math.floor(rnd() * ARTIST_BANK.length)];
    const hasCover = rnd() >= 0.15;
    const hasAlbum = rnd() >= 0.25;
    const hasBpm = rnd() >= 0.20;
    const hasYear = rnd() >= 0.10;
    const hasIsrc = rnd() >= 0.30;
    const releaseYear = hasYear ? 2018 + Math.floor(rnd() * 9) : null;
    const baseTrack: Track = {
      id,
      title: pickTitle(rnd),
      artist,
      album: hasAlbum ? `${pickTitle(rnd)} (LP)` : null,
      coverUrl: hasCover ? `https://picsum.photos/seed/${id}/400/400` : null,
      genre,
      moods: pickMoods(rnd),
      durationSec: pickDuration(rnd),
      bpm: hasBpm ? 70 + Math.floor(rnd() * 90) : null,
      tags: pickTags(rnd),
      releaseYear,
      language: LANGUAGES[Math.floor(rnd() * LANGUAGES.length)],
      previewUrl: `https://mock.licenciame.local/preview/${id}.mp3`,
      waveformPeaks: buildWaveform(rnd),
      popularityScore: pickPopularity(rnd),
      isrc: hasIsrc ? `MX-${Math.floor(rnd() * 1e6).toString().padStart(6, "0")}` : null,
      platformLicensability: buildLicensability(rnd),
      licensesIssuedCount: Math.floor(rnd() * 250),
      isFavorite: rnd() < 0.05,
      createdAt: isoDateBetween(rnd, 2018, 2026),
    };
    tracks.push(baseTrack);
  }
  return tracks;
}

export const TOTAL_MOCK_TRACKS = TOTAL_TRACKS;
export { platformsLicensableFor };
