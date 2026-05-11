const LANGUAGE_LABELS: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  pt: "Portugués",
  fr: "Francés",
  it: "Italiano",
  de: "Alemán",
  ja: "Japonés",
  ko: "Coreano",
  zh: "Chino",
  ca: "Catalán",
  eu: "Euskera",
  gl: "Gallego",
  instrumental: "Instrumental",
};

/** Map ISO-2 (or `instrumental`) to a Spanish label. Falls back to the raw code. */
export function languageLabel(code: string | null | undefined): string | null {
  if (!code) return null;
  const key = code.toLowerCase();
  return LANGUAGE_LABELS[key] ?? code;
}
