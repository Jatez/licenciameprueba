export interface Track {
  id: string;
  cover: string;
  title: string;
  artist: string;
  bpm: number;
  duration: string;
}

export interface TrackTableProps {
  tracks: Track[];
  onLicense?: (track: Track) => void;
  onPlay?: (track: Track) => void;
  onDownload?: (track: Track) => void;
  onFavorite?: (track: Track) => void;
  onMore?: (track: Track) => void;
}

export interface TrackTableRowProps {
  track: Track;
  onLicense?: (track: Track) => void;
  onPlay?: (track: Track) => void;
  onDownload?: (track: Track) => void;
  onFavorite?: (track: Track) => void;
  onMore?: (track: Track) => void;
}
