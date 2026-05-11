/**
 * F-11 · Mock pool of tracks reused across publications and top tracks.
 * Covers ~12 distinct tracks to allow realistic top-N rankings.
 */
export interface MockTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}

export const mockTracksPool: MockTrack[] = [
  { id: "trk_001", title: "Neon Pulse", artist: "Lúa Romero", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },
  { id: "trk_002", title: "Cielo Roto", artist: "Mateo Vega", coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80" },
  { id: "trk_003", title: "Bossa Verde", artist: "Aldea Nueve", coverUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&q=80" },
  { id: "trk_004", title: "Lo Que Queda", artist: "Sara Clavijo", coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80" },
  { id: "trk_005", title: "Madrugada FM", artist: "Quintino", coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80" },
  { id: "trk_006", title: "Sin Norte", artist: "Hábito", coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80" },
  { id: "trk_007", title: "Plata", artist: "Ana Murcia", coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&q=80" },
  { id: "trk_008", title: "Glaciar", artist: "Tres Pasos", coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80" },
  { id: "trk_009", title: "Calor de Marzo", artist: "Lorena Briz", coverUrl: "https://images.unsplash.com/photo-1483821577009-83b167890088?w=400&q=80" },
  { id: "trk_010", title: "Modo Avión", artist: "Cuarzo", coverUrl: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&q=80" },
  { id: "trk_011", title: "Tarde de Sábado", artist: "Iván Pulido", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },
  { id: "trk_012", title: "Hilo Rojo", artist: "Sombra Clara", coverUrl: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400&q=80" },
];
