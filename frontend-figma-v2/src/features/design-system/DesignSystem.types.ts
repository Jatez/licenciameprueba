export type DSStatus = "stable" | "beta" | "deprecated";

export interface DSNavSection {
  id: string;
  labelKey: string;
  status: DSStatus;
  lastUpdate: string;
}

export interface DSNavGroup {
  id: string;
  labelKey: string;
  sections: DSNavSection[];
}
