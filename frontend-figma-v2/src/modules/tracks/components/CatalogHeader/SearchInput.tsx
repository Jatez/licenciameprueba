import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { catalogStrings } from "@/modules/tracks/strings";
import { useDebounceSearch } from "@/modules/tracks/hooks/useDebounceSearch";
import { isTypingTarget } from "@/modules/tracks/utils";

interface SearchInputProps {
  value: string;
  onChange: (next: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounceSearch(local, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastEmittedRef = useRef(value);

  // External (URL) → local sync.
  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      setLocal(value);
      lastEmittedRef.current = value;
    }
  }, [value]);

  // Local debounced → external.
  useEffect(() => {
    if (debounced !== lastEmittedRef.current) {
      lastEmittedRef.current = debounced;
      onChange(debounced);
    }
  }, [debounced, onChange]);

  // Global "/" shortcut to focus.
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "/" || isTypingTarget(e.target)) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    lastEmittedRef.current = local;
    onChange(local);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && local) {
      e.preventDefault();
      setLocal("");
      lastEmittedRef.current = "";
      onChange("");
    }
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        ref={inputRef}
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={catalogStrings.search.placeholder}
        aria-label={catalogStrings.search.ariaLabel}
        className="h-10 rounded-full border-white/20 bg-white/10 backdrop-blur-md pl-9 pr-9 placeholder:text-muted-foreground/70"
      />
      {local && (
        <button
          type="button"
          onClick={() => {
            setLocal("");
            lastEmittedRef.current = "";
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label={catalogStrings.search.clear}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </form>
  );
}
