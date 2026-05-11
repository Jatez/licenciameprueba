/**
 * Snapshot of dev-panel-relevant state. Read by the panel UI on demand.
 */
import type { TrackingEvent, TrackingSimulatorConfig } from "./trackingSimulator.types";

export interface DevControlState {
  simulatorRunning: boolean;
  config: TrackingSimulatorConfig;
  /** Most recent events (newest first), capped at 20. */
  recentEvents: TrackingEvent[];
}
