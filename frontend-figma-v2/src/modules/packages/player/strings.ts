/**
 * Spanish copy for the persistent global player.
 * Use `interpolate(template, vars)` for placeholders like `{seconds}` / `{title}`.
 */
export const playerStrings = {
  region: "Reproductor de audio",
  play: "Reproducir",
  pause: "Pausar",
  mute: "Silenciar",
  unmute: "Quitar silencio",
  volume: "Volumen",
  progress: "Progreso de la canción",
  expand: "Expandir reproductor",
  collapse: "Colapsar reproductor",
  close: "Cerrar reproductor",
  license: "Licenciar",
  addToFavorites: "Agregar a favoritos",
  removeFromFavorites: "Quitar de favoritos",
  preview: {
    limitedTo: "Preview limitado a {seconds} segundos",
  },
  error: {
    loadFailed: "No pudimos reproducir este preview",
    retry: "Reintentar",
    dismiss: "Cerrar",
    favoriteFailed: "No pudimos actualizar tus favoritos",
  },
  shortcuts: {
    announcement: {
      playing: "Reproduciendo {title} de {artist}",
      paused: "Pausado",
      muted: "Silenciado",
      unmuted: "Sonido activado",
      error: "Error al cargar preview",
    },
  },
  expanded: {
    title: "Detalle del track",
    album: "Álbum",
    genre: "Género",
    tags: "Tags",
  },
} as const;
