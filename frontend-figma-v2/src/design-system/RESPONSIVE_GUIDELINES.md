# Responsive & Mobile Guidelines — Licénciame

> **Single source of truth** for responsive behavior in this project.
> Every new screen MUST be built mobile-first and pass the checklist at the bottom of this document.

---

## 1. Breakpoints

Tailwind breakpoints used across the project. **Always mobile-first**: write default styles for mobile and scale up.

| Breakpoint | Prefix | Range | Device |
| --- | --- | --- | --- |
| default | — | 0 – 639px | Small phone / base |
| sm | `sm:` | 640 – 767px | Large phone |
| md | `md:` | 768 – 1023px | Tablet |
| lg | `lg:` | 1024 – 1279px | Small desktop |
| xl | `xl:` | 1280 – 1535px | Desktop |
| 2xl | `2xl:` | 1536px+ | Large desktop |

```tsx
// ✅ mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" />

// ❌ desktop-first
<div className="grid grid-cols-4 sm:grid-cols-1" />
```

---

## 2. Layout patterns

| Desktop layout | Tailwind classes |
| --- | --- |
| 4 columns | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6` |
| 3 columns | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6` |
| 2 columns | `grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6` |
| Stack → row | `flex flex-col md:flex-row gap-3 md:gap-4 md:items-center` |

---

## 3. Typography scale

| Role | Mobile | Tablet | Desktop | Tailwind |
| --- | --- | --- | --- | --- |
| H1 — page | 24px | 30px | 36px | `text-2xl md:text-3xl lg:text-4xl` |
| H2 — section | 20px | 24px | 24px | `text-xl md:text-2xl` |
| H3 — card | 18px | 20px | 20px | `text-lg md:text-xl` |
| Body | 14px | 16px | 16px | `text-sm md:text-base` |
| Caption / label | 12px | 14px | 14px | `text-xs md:text-sm` |
| Inputs | **16px always** | 16px | 16px | `text-base` (avoids iOS zoom) |

---

## 4. Spacing system

| Element | Tailwind |
| --- | --- |
| Container horizontal padding | `px-4 md:px-6 lg:px-8` |
| Section vertical spacing | `py-6 md:py-8 lg:py-12` |
| Card internal padding | `p-4 md:p-6` |
| Grid / stack gaps | `gap-4 md:gap-6` (or `gap-3 md:gap-4`) |

---

## 5. Touch targets

- **Minimum 40×40px** (`h-10 w-10`), **prefer 44×44px** (`h-11 w-11`) — Apple HIG / WCAG.
- Minimum **8px** between interactive elements (`gap-2` or more).
- Primary CTAs on mobile: `h-11 w-full sm:w-auto`.
- List items: `min-h-[44px]`.
- **No hover-only interactions** — every action must be reachable with a tap.

```tsx
// ✅ Icon button
<button className="h-11 w-11 inline-flex items-center justify-center rounded-md" aria-label="…">
  <Icon className="h-4 w-4" />
</button>

// ✅ Mobile primary CTA
<Button className="h-11 w-full sm:w-auto">Continuar</Button>
```

---

## 6. Navigation patterns

The desktop sidebar collapses to a **hamburger drawer** under `lg`.

```tsx
// Sidebar visible only on lg+
<aside className="hidden lg:block fixed left-0 top-0 w-56 h-screen">…</aside>

// Hamburger button visible only under lg
<button
  className="lg:hidden fixed top-3 left-3 z-40 h-11 w-11"
  aria-label="Abrir menú"
  onClick={() => setOpen(true)}
>
  <Menu className="h-5 w-5" />
</button>

// Drawer
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="left" className="w-[85%] max-w-sm p-0 overflow-y-auto">…</SheetContent>
</Sheet>
```

Lock body scroll while the drawer is open:

```tsx
useEffect(() => {
  if (!open) return;
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => { document.body.style.overflow = prev; };
}, [open]);
```

Reference files in this project:
- `src/components/layout/AppMobileDrawer.tsx`
- `src/components/layout/BodyCard.tsx`
- `src/components/ui/sheet.tsx`

In top bars, collapse text labels behind icons on mobile:
```tsx
<Button className="h-11">
  <Download className="h-4 w-4" />
  <span className="hidden sm:inline ml-2">Exportar</span>
</Button>
```

---

## 7. Forms on mobile

- Labels **always** stacked above inputs.
- Inputs use `text-base` (16px) — prevents iOS zoom on focus.
- Multi-column forms collapse: `grid grid-cols-1 md:grid-cols-2`.
- Submit buttons full-width on mobile: `w-full md:w-auto`.
- Always set `inputMode` and `autoComplete`.

| Input type | `inputMode` | `autoComplete` | `type` |
| --- | --- | --- | --- |
| Email | `email` | `email` | `email` |
| Phone | `tel` | `tel` | `tel` |
| Numeric (qty) | `numeric` | `off` | `text` |
| Decimal (price) | `decimal` | `off` | `text` |
| Search | `search` | `off` | `search` |
| URL | `url` | `url` | `url` |
| Password | `text` | `current-password` | `password` |
| New password | `text` | `new-password` | `password` |
| Name | `text` | `name` | `text` |
| OTP 6-digit | `numeric` | `one-time-code` | `text` |

```tsx
<form className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col gap-1.5">
      <label htmlFor="email" className="text-xs md:text-sm font-medium">Email</label>
      <input id="email" type="email" inputMode="email" autoComplete="email"
        className="text-base h-11 px-3 rounded-md border" />
    </div>
  </div>
  <Button className="h-11 w-full md:w-auto">Guardar</Button>
</form>
```

---

## 8. Tables & data on mobile

Rule of thumb:
- **< 4 columns** → horizontal scroll.
- **≥ 4 columns or long content** → stack as cards on mobile (preferred).

Horizontal scroll:
```tsx
<div className="-mx-4 px-4 overflow-x-auto md:mx-0 md:px-0">
  <table className="w-full min-w-[560px] text-sm">…</table>
</div>
```

Stacked cards (preferred for complex data):
```tsx
<table className="hidden md:table w-full">…</table>

<ul className="md:hidden space-y-3">
  {rows.map((r) => (
    <li key={r.id} className="rounded-card border border-border bg-card p-4">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-muted-foreground">{r.id}</span>
        <span className="text-base font-semibold">{r.amount}</span>
      </div>
      <p className="text-sm">{r.concept}</p>
      <p className="text-xs text-muted-foreground mt-1">{r.date}</p>
    </li>
  ))}
</ul>
```

Charts: always use `ResponsiveContainer` and reduce X-axis tick density on mobile (`interval="preserveStartEnd"`, `minTickGap={32}`).

---

## 9. Modals & dialogs

Full-screen on mobile, centered on desktop:

```tsx
<DialogContent
  className="
    p-0
    w-full h-full max-w-none rounded-none
    md:h-auto md:max-w-lg md:rounded-card
    flex flex-col
  "
>
  <DialogHeader className="p-4 md:p-6 border-b border-border">
    <DialogTitle className="text-lg md:text-xl">Título</DialogTitle>
  </DialogHeader>

  <div className="flex-1 overflow-y-auto p-4 md:p-6">…</div>

  <DialogFooter className="p-4 md:p-6 border-t border-border flex-col-reverse sm:flex-row gap-2">
    <Button variant="ghost" className="w-full sm:w-auto">Cancelar</Button>
    <Button className="w-full sm:w-auto">Confirmar</Button>
  </DialogFooter>
</DialogContent>
```

Bottom-sheet alternative for filters/pickers:
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button className="h-11 w-full md:w-auto">Abrir filtros</Button>
  </SheetTrigger>
  <SheetContent side="bottom" className="rounded-t-card max-h-[85dvh] overflow-y-auto">
    …
  </SheetContent>
</Sheet>
```

---

## 10. Mobile-first build checklist

- [ ] Tested at 375px viewport (no horizontal scroll)
- [ ] All touch targets ≥ 40×40px
- [ ] All inputs use `text-base` (min 16px)
- [ ] Grid uses mobile-first column counts (`grid-cols-1` default)
- [ ] Typography scales up with `md:` and `lg:` prefixes
- [ ] Sidebar collapses to drawer under `lg`
- [ ] Tables handled with horizontal scroll or stacked cards
- [ ] Modals are full-screen or bottom-sheet under `md`
- [ ] Primary CTAs are `w-full` on mobile
- [ ] No hover-only interactions

---

## How to use this document

When asking the AI assistant to build or modify a screen in this project, include this file (or reference its rules explicitly) to ensure the output is mobile-first and consistent with the established design system. Example prompt opener:

> "Follow the rules in `src/design-system/RESPONSIVE_GUIDELINES.md`. Build the screen mobile-first, use the breakpoint scale and typography scale defined there, and verify the build checklist before declaring done."

The live, interactive version of this guide lives in the Design System page, group **"Responsive & Mobile"** (route `/design-system`).
