/**
 * F-11 · Top tracks mock — pre-computed snapshots per scenario.
 * The selector `computeTopTracks` is the runtime source of truth;
 * these fixtures only exist to test the rendering layer in isolation.
 */
import type { MetricsScenario, MetricsTopTrack } from "../types";
import { getPublicationsForScenario } from "./publications";
import { computeTopTracks } from "../selectors/computeTopTracks";

const limits: Record<MetricsScenario, number> = {
  happy: 12,
  empty: 0,
  sparse: 8,
  partial: 10,
  heavy: 25,
};

export function getTopTracksForScenario(scenario: MetricsScenario): MetricsTopTrack[] {
  const pubs = getPublicationsForScenario(scenario);
  return computeTopTracks(pubs, limits[scenario]);
}
