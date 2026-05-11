import { useState } from "react";
import { NAV_SECTIONS } from "../sections";

interface SidebarProps {
  active: string;
}

export function InternalSidebar({ active }: SidebarProps) {
  const [q, setQ] = useState("");
  const items = NAV_SECTIONS.filter((s) => s.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <aside className="hidden lg:block w-[240px] shrink-0 sticky top-6 self-start">
        <div className="rounded-lg border border-border bg-surface p-4">
          <input
            type="search"
            placeholder="Buscar sección…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full mb-3 px-2 py-1.5 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Buscar sección"
          />
          <nav className="flex flex-col gap-1">
            {items.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`text-sm px-2 py-1.5 rounded-md hover:bg-bodycard-bg ${
                  active === s.id
                    ? "bg-lm-black text-white hover:bg-lm-black"
                    : "text-muted-foreground"
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>
      <div className="lg:hidden mb-4">
        <select
          aria-label="Ir a sección"
          className="w-full px-3 py-2 border border-border rounded-md bg-surface text-sm"
          onChange={(e) => {
            const el = document.getElementById(e.target.value);
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          value={active}
        >
          {NAV_SECTIONS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
    </>
  );
}
