import { RefreshCcw } from "lucide-react";
import { editorialStrings } from "../strings";

/** Tertiary footer line: last update timestamp + ghost refresh link. */
export function EditorialFooter() {
  const t = editorialStrings.footer;

  return (
    <footer className="flex items-center gap-2 text-xs text-lm-gray-400">
      <span>{t.lastUpdate}</span>
      <span aria-hidden="true">·</span>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-xs text-lm-gray-500 transition-opacity hover:opacity-70"
      >
        <RefreshCcw className="h-3 w-3" aria-hidden="true" />
        {t.refresh}
      </button>
    </footer>
  );
}
