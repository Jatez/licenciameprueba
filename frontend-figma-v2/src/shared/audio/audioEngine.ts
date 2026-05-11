import type {
  AudioEngineEvent,
  AudioEngineListener,
  AudioEnginePayload,
  LoadOptions,
  Unsubscribe,
} from "./audioEngine.types";

/** Frontend-owned constant — preview is always capped at 30 seconds. */
export const PREVIEW_DURATION_SEC = 30;

/** Mock domain used by the F-03 fixtures. */
const MOCK_AUDIO_HOST = "mock.licenciame.local";

/**
 * Singleton wrapper around a single `HTMLAudioElement`.
 *
 * - Centralises playback so only one preview can play at a time.
 * - Enforces an explicit `maxDurationSec` cap on every load.
 * - For URLs pointing at the mock host (`mock.licenciame.local`) it swaps in
 *   a synthesised 30s silent WAV blob so playback works end-to-end without
 *   network requests, and still emits realistic `timeupdate` events.
 * - Exposes a typed event emitter for UI layers to subscribe to.
 */
class AudioEngine {
  private element: HTMLAudioElement | null = null;
  private maxDurationSec = PREVIEW_DURATION_SEC;
  private listeners: Map<AudioEngineEvent, Set<AudioEngineListener>> = new Map();
  private boundHandlers: Array<{ event: string; handler: EventListener }> = [];
  private silentBlobUrl: string | null = null;
  private currentSourceUrl: string | null = null;

  private ensureElement(): HTMLAudioElement {
    if (this.element) return this.element;
    if (typeof window === "undefined") {
      throw new Error("AudioEngine cannot be used outside the browser.");
    }
    const el = new Audio();
    el.preload = "metadata";
    el.crossOrigin = "anonymous";
    this.element = el;
    this.attachNativeListeners(el);
    return el;
  }

  private attachNativeListeners(el: HTMLAudioElement): void {
    const onTimeUpdate = () => {
      if (el.currentTime >= this.maxDurationSec) {
        this.pause();
        el.currentTime = 0;
        this.emit("ended");
        return;
      }
      this.emit("timeupdate");
    };
    const onEnded = () => this.emit("ended");
    const onError = () =>
      this.emit("error", { errorMessage: el.error?.message ?? "Audio error" });
    const onLoadStart = () => this.emit("loadstart");
    const onCanPlay = () => this.emit("canplay");
    const onPlay = () => this.emit("play");
    const onPause = () => this.emit("pause");

    const pairs: Array<[string, EventListener]> = [
      ["timeupdate", onTimeUpdate as EventListener],
      ["ended", onEnded as EventListener],
      ["error", onError as EventListener],
      ["loadstart", onLoadStart as EventListener],
      ["canplay", onCanPlay as EventListener],
      ["play", onPlay as EventListener],
      ["pause", onPause as EventListener],
    ];
    for (const [event, handler] of pairs) {
      el.addEventListener(event, handler);
      this.boundHandlers.push({ event, handler });
    }
  }

  private emit(event: AudioEngineEvent, extra: Partial<AudioEnginePayload> = {}): void {
    const subs = this.listeners.get(event);
    if (!subs || subs.size === 0) return;
    const payload: AudioEnginePayload = {
      currentTimeSec: this.element?.currentTime ?? 0,
      durationSec: Math.min(this.element?.duration || 0, this.maxDurationSec),
      ...extra,
    };
    subs.forEach((listener) => {
      try {
        listener(payload);
      } catch {
        // listeners must not break the loop
      }
    });
  }

  /**
   * Lazily build a 30s silent WAV blob (mono, 8kHz, 8-bit) and cache its URL.
   * ~240KB — tiny, deterministic, no network.
   */
  private getOrCreateSilentBlobUrl(): string {
    if (this.silentBlobUrl) return this.silentBlobUrl;
    const sampleRate = 8000;
    const seconds = PREVIEW_DURATION_SEC;
    const numSamples = sampleRate * seconds;
    const dataSize = numSamples; // 8-bit mono
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };
    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true); // PCM chunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate, true); // byte rate
    view.setUint16(32, 1, true); // block align
    view.setUint16(34, 8, true); // bits per sample
    writeString(36, "data");
    view.setUint32(40, dataSize, true);
    // 8-bit unsigned PCM silence is 0x80
    for (let i = 0; i < numSamples; i++) view.setUint8(44 + i, 0x80);
    const blob = new Blob([buffer], { type: "audio/wav" });
    this.silentBlobUrl = URL.createObjectURL(blob);
    return this.silentBlobUrl;
  }

  private resolveSource(url: string): string {
    if (url.includes(MOCK_AUDIO_HOST)) return this.getOrCreateSilentBlobUrl();
    return url;
  }

  load(url: string, opts: LoadOptions): void {
    const el = this.ensureElement();
    this.maxDurationSec = Math.max(1, opts.maxDurationSec);
    const resolved = this.resolveSource(url);
    if (this.currentSourceUrl !== url) {
      el.src = resolved;
      el.load();
      this.currentSourceUrl = url;
    }
    el.currentTime = 0;
  }

  async play(): Promise<void> {
    const el = this.ensureElement();
    try {
      await el.play();
    } catch (err) {
      this.emit("error", {
        errorMessage: err instanceof Error ? err.message : "Playback failed",
      });
      throw err;
    }
  }

  pause(): void {
    this.element?.pause();
  }

  seek(sec: number): void {
    if (!this.element) return;
    const clamped = Math.max(0, Math.min(sec, this.maxDurationSec));
    this.element.currentTime = clamped;
  }

  setVolume(v: number): void {
    if (!this.element) return;
    this.element.volume = Math.max(0, Math.min(1, v));
  }

  setMuted(muted: boolean): void {
    if (!this.element) return;
    this.element.muted = muted;
  }

  stop(): void {
    if (!this.element) return;
    this.element.pause();
    this.element.currentTime = 0;
  }

  /** Synchronous accessor for current playback position. */
  getCurrentTime(): number {
    return this.element?.currentTime ?? 0;
  }

  /** Synchronous accessor for the active duration cap. */
  getMaxDuration(): number {
    return this.maxDurationSec;
  }

  /** Returns the URL most recently passed to `load()` (not the resolved blob URL). */
  getCurrentSourceUrl(): string | null {
    return this.currentSourceUrl;
  }

  destroy(): void {
    if (!this.element) return;
    for (const { event, handler } of this.boundHandlers) {
      this.element.removeEventListener(event, handler);
    }
    this.boundHandlers = [];
    this.element.pause();
    this.element.src = "";
    this.element = null;
    this.listeners.clear();
    if (this.silentBlobUrl) {
      URL.revokeObjectURL(this.silentBlobUrl);
      this.silentBlobUrl = null;
    }
    this.currentSourceUrl = null;
  }

  on(event: AudioEngineEvent, listener: AudioEngineListener): Unsubscribe {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener);
    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }
}

export const audioEngine = new AudioEngine();
