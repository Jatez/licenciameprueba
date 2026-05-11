/**
 * Dev-only panel index. The exports here are React.lazy() bound, so production
 * bundles won't include the panel implementation.
 */
import { lazy } from "react";

export const DevTrackingTrigger = lazy(() =>
  import("./DevTrackingTrigger").then((m) => ({ default: m.DevTrackingTrigger })),
);

export const DevTrackingPanel = lazy(() =>
  import("./DevTrackingPanel").then((m) => ({ default: m.DevTrackingPanel })),
);
