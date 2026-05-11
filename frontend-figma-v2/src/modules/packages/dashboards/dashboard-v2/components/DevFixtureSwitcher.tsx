import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FlaskConical, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { DashboardFixture } from "@/api/types.dashboard";

interface FixtureOption {
  value: DashboardFixture;
  label: string;
  description: string;
}

const OPTIONS: FixtureOption[] = [
  { value: "default", label: "Default", description: "Empresa con datos completos" },
  { value: "newCompany", label: "Empty / Nueva empresa", description: "Sin saldo, sin licencias, sin actividad" },
  { value: "lowBalance", label: "Saldo bajo", description: "Wallet por debajo del umbral" },
  { value: "error", label: "Error de carga", description: "Falla la petición del dashboard" },
];

const VALID = OPTIONS.map((o) => o.value);

/**
 * Dev-only floating switcher to simulate dashboard states by toggling
 * the `?fixture=` query param consumed by useDashboardData.
 */
export function DevFixtureSwitcher() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);

  const raw = searchParams.get("fixture") as DashboardFixture | null;
  const current: DashboardFixture = raw && VALID.includes(raw) ? raw : "default";

  const handleSelect = (value: DashboardFixture) => {
    const next = new URLSearchParams(searchParams);
    if (value === "default") {
      next.delete("fixture");
    } else {
      next.set("fixture", value);
    }
    setSearchParams(next, { replace: true });
    setOpen(false);
  };

  const activeOption = OPTIONS.find((o) => o.value === current) ?? OPTIONS[0];
  const isActive = current !== "default";

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Simulador de estados del dashboard"
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium shadow-lg backdrop-blur transition-all",
              "border border-border bg-card text-foreground hover:bg-muted",
              isActive && "border-primary bg-primary text-primary-foreground hover:bg-primary-hover",
            )}
          >
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Dev · {activeOption.label}</span>
            <span className="sm:hidden">Dev</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-72">
          <DropdownMenuLabel className="flex items-center gap-2 text-xs">
            <FlaskConical className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Simular estado del dashboard
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {OPTIONS.map((option) => {
            const selected = option.value === current;
            return (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
                className="flex items-start gap-2 py-2"
              >
                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                  {selected && <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <p className="px-2 py-1.5 text-[10px] leading-relaxed text-muted-foreground">
            Modo demo · cambia el query <code className="rounded bg-muted px-1">?fixture</code> en la URL.
          </p>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
