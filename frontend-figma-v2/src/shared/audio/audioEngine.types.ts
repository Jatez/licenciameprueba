export type AudioEngineEvent =
  | "timeupdate"
  | "ended"
  | "error"
  | "loadstart"
  | "canplay"
  | "play"
  | "pause";

export type AudioEngineListener = (payload: AudioEnginePayload) => void;

export interface AudioEnginePayload {
  currentTimeSec: number;
  durationSec: number;
  /** Present only on `error` events. */
  errorMessage?: string;
}

export interface LoadOptions {
  /**
   * Hard upper bound enforced by the engine. When playback crosses this
   * threshold the engine pauses, stops and emits `ended`.
   */
  maxDurationSec: number;
}

export type Unsubscribe = () => void;
