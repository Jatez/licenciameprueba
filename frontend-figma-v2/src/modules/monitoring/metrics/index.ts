/**
 * F-11 · Public API of the metrics feature.
 * Consumers must import from here, never from internal subpaths.
 */
export * from "./types";
export * from "./hooks";
export * from "./selectors";
export { metricsRoutes, publicationDetailPath } from "./routes";
export { metricsStrings, periodPresetLabels, platformLabels, useTypeLabels } from "./strings";
export { getActiveScenario } from "./mocks";
