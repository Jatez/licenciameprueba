import { Menu } from "lucide-react";

export function LayoutDesktopMock() {
  return (
    <div className="rounded-card overflow-hidden border border-border mb-8" style={{ aspectRatio: "16/9", background: "#EAEAEB", position: "relative" }}>
      <div className="absolute left-0 top-0 h-full" style={{ width: "16%", background: "rgba(234,234,235,0.85)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="p-3 font-serif italic text-lg font-semibold text-ink-900">lm</div>
        <div className="px-2 flex flex-col gap-1">
          <div className="h-5 rounded bg-primary" />
          <div className="h-5 rounded bg-black/10" />
          <div className="h-5 rounded bg-black/10" />
          <div className="h-5 rounded bg-black/10" />
        </div>
      </div>
      <div className="absolute" style={{ top: 8, right: 8, bottom: 8, left: "calc(16% + 8px)", background: "#F3F4F6", borderRadius: "12px", padding: "12px" }}>
        <div className="flex gap-2 mb-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-8 flex-1 bg-white rounded" />)}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 w-20 bg-white rounded" />)}
        </div>
      </div>
    </div>
  );
}

export function LayoutMobileMock() {
  return (
    <div className="flex justify-center mb-8">
      <div className="rounded-2xl overflow-hidden border border-border" style={{ width: 220, aspectRatio: "9/16", background: "#EAEAEB", position: "relative" }}>
        <div className="absolute" style={{ inset: 6, background: "#F3F4F6", borderRadius: "10px", padding: 8 }}>
          <div className="flex justify-end mb-2">
            <div className="w-7 h-7 bg-sidebar-bg rounded flex items-center justify-center">
              <Menu className="h-3.5 w-3.5 text-ink-900" />
            </div>
          </div>
          <div className="h-3 w-3/4 bg-white rounded mb-1" />
          <div className="h-3 w-1/2 bg-white rounded" />
        </div>
        <div className="absolute left-0 top-0 h-full shadow-lg" style={{ width: "60%", background: "rgba(234,234,235,0.85)", backdropFilter: "blur(20px)" }}>
          <div className="p-2 font-serif italic text-base font-semibold text-ink-900">lm</div>
          <div className="px-1.5 flex flex-col gap-0.5">
            <div className="h-4 rounded bg-primary" />
            <div className="h-4 rounded bg-black/10" />
            <div className="h-4 rounded bg-black/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
