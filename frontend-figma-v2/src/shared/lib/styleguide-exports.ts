// Markdown and HTML export functions for the Licénciame Design System.
// Generated as standalone artifacts that can be opened/read offline.
//
// IMPORTANT: the per-section content is driven by NAV_GROUPS + DS_LAST_UPDATED +
// i18n labels so that every new section automatically appears in the export.
// Only Foundations keeps a rich static body (the values rarely change and
// they are the most useful piece of the offline reference).

import i18n from "@/i18n";
import { NAV_GROUPS } from "@/features/design-system/config/navigation";
import {
  DS_LAST_UPDATED,
  DS_LAST_UPDATED_DEFAULT,
} from "@/config/designSystem";
import type { DSNavGroup, DSNavSection } from "@/features/design-system/DesignSystem.types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — single source of truth: NAV_GROUPS + i18n
// ─────────────────────────────────────────────────────────────────────────────

const PUBLIC_DS_URL = "/design-system";

/** Resolve i18n label for a section/group with safe fallback. */
function tr(key: string, fallback: string): string {
  try {
    const value = i18n.t(key, { ns: "designSystem", defaultValue: fallback });
    return typeof value === "string" && value.length > 0 ? value : fallback;
  } catch {
    return fallback;
  }
}

function groupLabel(group: DSNavGroup): string {
  return tr(group.labelKey.replace(/^designSystem:/, ""), group.id);
}

function sectionLabel(section: DSNavSection): string {
  return tr(section.labelKey.replace(/^designSystem:/, ""), section.id);
}

function sectionLastUpdate(section: DSNavSection): string {
  return DS_LAST_UPDATED[section.id] ?? section.lastUpdate ?? DS_LAST_UPDATED_DEFAULT;
}

function statusPillColor(status: string): string {
  switch (status) {
    case "stable":
      return "background:#BAC374;color:#1d2a04";
    case "beta":
      return "background:#E0AE74;color:#3a2403";
    case "deprecated":
      return "background:#C37474;color:#3a0a0a";
    default:
      return "background:#E5E7EB;color:#3D3D3D";
  }
}

function statusLabel(status: string): string {
  return tr(`status.${status}`, status);
}

function totalSectionCount(): number {
  return NAV_GROUPS.reduce((acc, g) => acc + g.sections.length, 0);
}

/** Markdown rows for every section in a group. */
function groupMarkdownRows(group: DSNavGroup): string {
  return group.sections
    .map((s) => {
      const label = sectionLabel(s);
      const date = sectionLastUpdate(s);
      const status = statusLabel(s.status);
      const url = `${PUBLIC_DS_URL}#${s.id}`;
      return `| [${label}](${url}) | \`${s.id}\` | ${status} | ${date} |`;
    })
    .join("\n");
}

/** HTML <li> entries for every section in a group. */
function groupHtmlEntries(group: DSNavGroup): string {
  return group.sections
    .map((s) => {
      const label = sectionLabel(s);
      const date = sectionLastUpdate(s);
      const status = statusLabel(s.status);
      const pillStyle = statusPillColor(s.status);
      const url = `${PUBLIC_DS_URL}#${s.id}`;
      return `<li class="ix-item">
    <a class="ix-link" href="${url}">${label}</a>
    <span class="ix-id">${s.id}</span>
    <span class="ix-pill" style="${pillStyle}">${status}</span>
    <span class="ix-date">${date}</span>
  </li>`;
    })
    .join("\n  ");
}

const EXPORT_GENERATED_AT = (): string =>
  new Date().toISOString().slice(0, 10);

// ─────────────────────────────────────────────────────────────────────────────
// Brand assets — inlined as SVG strings so the exported HTML is self-contained.
// Both SVGs are pure black on transparent; for dark cards we apply CSS invert.
// ─────────────────────────────────────────────────────────────────────────────

const ISOTIPO_SVG = `<svg viewBox="0 0 59 54" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10.9944 0V52.8558H0V0H10.9944Z" fill="currentColor"/><path d="M14.2314 52.8554H10.0889L20.3363 23.0579C20.9904 21.1683 21.7898 18.77 21.7898 17.8979C21.7898 16.8077 21.3538 16.517 20.6997 16.517C18.2287 16.517 14.5221 21.241 12.0511 25.6016H10.5249C13.5047 19.8601 18.4467 13.828 23.0253 13.828C24.9149 13.828 25.8597 15.3542 25.8597 17.0984C25.8597 18.6246 25.133 20.5869 24.2608 23.0579L19.4642 36.2851H20.0456C28.04 19.4241 32.982 13.6826 37.7787 13.6826C40.1044 13.6826 41.4852 15.4995 41.4852 18.0432C41.4852 22.2585 38.0694 28.8721 34.799 36.2851H35.3077C43.3021 19.4241 48.9709 13.6826 53.8403 13.6826C56.5293 13.6826 57.9828 15.4269 57.9828 18.1886C57.9828 24.1481 51.8053 35.7037 48.0261 45.079C47.6627 46.1691 47.0086 47.768 47.0086 48.7128C47.0086 49.803 47.2994 50.5297 48.4622 50.5297C51.4419 50.5297 54.7124 45.515 57.2561 39.9916H58.7823C56.2386 46.2418 51.5873 53.2914 46.7179 53.2914C43.8835 53.2914 42.8661 51.6925 42.8661 49.5122C42.8661 48.2041 43.5202 46.6052 44.1016 45.0063C48.2442 34.5408 53.4769 23.6393 53.4769 19.7148C53.4769 17.8979 52.8955 17.0257 51.7326 17.0257C49.0436 17.0257 43.5202 22.2585 36.2525 37.1572C34.1449 41.5178 31.9646 46.7505 29.5662 52.8554H25.4237L31.7465 36.5758C34.5082 29.4535 37.4153 22.6219 37.4153 19.7148C37.4153 17.8979 36.8339 17.0257 35.6711 17.0257C32.2553 17.0257 24.8422 25.747 14.2314 52.8554Z" fill="currentColor"/></svg>`;

const LOGOTIPO_SVG = `<svg viewBox="0 0 318 58" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M219.228 57.2434C216.699 57.2434 214.445 56.8046 212.466 55.9271C210.487 55.0325 208.922 53.7162 207.769 51.9784C206.633 50.2235 206.065 48.0383 206.065 45.4231C206.065 43.2208 206.47 41.3712 207.278 39.8743C208.087 38.3774 209.188 37.173 210.582 36.2611C211.976 35.3492 213.558 34.6609 215.331 34.1964C217.12 33.7318 218.995 33.4049 220.957 33.2157C223.262 32.9748 225.121 32.7511 226.532 32.5446C227.942 32.321 228.966 31.9941 229.603 31.5639C230.239 31.1338 230.558 30.4972 230.558 29.6541V29.4992C230.558 27.8647 230.042 26.6001 229.009 25.7054C227.994 24.8107 226.549 24.3634 224.673 24.3634C222.695 24.3634 221.12 24.8021 219.95 25.6796C218.78 26.5399 218.006 27.6238 217.628 28.9315L207.459 28.1056C207.975 25.6968 208.99 23.6149 210.504 21.8599C212.019 20.0877 213.971 18.7285 216.363 17.7822C218.772 16.8187 221.559 16.3369 224.725 16.3369C226.927 16.3369 229.035 16.595 231.048 17.1112C233.078 17.6273 234.876 18.4274 236.442 19.5114C238.025 20.5953 239.272 21.989 240.184 23.6923C241.096 25.3785 241.552 27.4002 241.552 29.7573V56.4949H231.125V50.9977H230.816C230.179 52.2365 229.327 53.3291 228.261 54.2754C227.194 55.2045 225.912 55.9357 224.415 56.4691C222.918 56.9853 221.189 57.2434 219.228 57.2434ZM222.376 49.6557C223.994 49.6557 225.422 49.3374 226.661 48.7008C227.899 48.047 228.872 47.1695 229.577 46.0683C230.282 44.9671 230.635 43.7197 230.635 42.3261V38.1193C230.291 38.343 229.818 38.5494 229.216 38.7387C228.631 38.9107 227.968 39.0742 227.228 39.229C226.489 39.3667 225.749 39.4957 225.009 39.6162C224.269 39.7194 223.598 39.814 222.996 39.9001C221.705 40.0893 220.578 40.3904 219.615 40.8034C218.651 41.2163 217.903 41.7755 217.37 42.4809C216.836 43.1691 216.569 44.0294 216.569 45.0618C216.569 46.5587 217.111 47.7028 218.195 48.4943C219.297 49.2686 220.69 49.6557 222.376 49.6557Z" fill="currentColor"/><path d="M191.756 56.4945V16.8527H202.75V56.4945H191.756ZM197.279 11.7426C195.644 11.7426 194.242 11.2006 193.072 10.1167C191.919 9.01551 191.343 7.69927 191.343 6.16797C191.343 4.65387 191.919 3.35484 193.072 2.27089C194.242 1.16972 195.644 0.619141 197.279 0.619141C198.913 0.619141 200.307 1.16972 201.46 2.27089C202.63 3.35484 203.215 4.65387 203.215 6.16797C203.215 7.69927 202.63 9.01551 201.46 10.1167C200.307 11.2006 198.913 11.7426 197.279 11.7426Z" fill="currentColor"/><path d="M170.646 57.2692C166.585 57.2692 163.093 56.4089 160.168 54.6883C157.26 52.9506 155.023 50.5418 153.458 47.462C151.909 44.3821 151.135 40.8378 151.135 36.8289C151.135 32.7683 151.918 29.2068 153.483 26.1441C155.066 23.0643 157.312 20.6641 160.219 18.9436C163.127 17.2058 166.585 16.3369 170.594 16.3369C174.053 16.3369 177.081 16.9649 179.679 18.2209C182.277 19.4769 184.333 21.2405 185.847 23.5117C187.361 25.7828 188.196 28.4497 188.351 31.5123H177.976C177.683 29.5337 176.909 27.9421 175.653 26.7377C174.414 25.5161 172.788 24.9053 170.775 24.9053C169.072 24.9053 167.583 25.3699 166.31 26.299C165.054 27.2109 164.073 28.5443 163.368 30.2993C162.663 32.0543 162.31 34.1792 162.31 36.674C162.31 39.2032 162.654 41.3539 163.342 43.1261C164.048 44.8983 165.037 46.249 166.31 47.1781C167.583 48.1072 169.072 48.5717 170.775 48.5717C172.031 48.5717 173.158 48.3136 174.156 47.7975C175.171 47.2813 176.006 46.5329 176.659 45.5521C177.33 44.5542 177.769 43.3584 177.976 41.9647H188.351C188.179 44.9929 187.353 47.6598 185.873 49.9654C184.411 52.2537 182.389 54.0431 179.808 55.3336C177.227 56.624 174.173 57.2692 170.646 57.2692Z" fill="currentColor"/><path d="M122.153 33.577V56.4949H111.159V16.8531H121.637V23.8472H122.101C122.979 21.5416 124.45 19.7178 126.515 18.3758C128.579 17.0165 131.083 16.3369 134.025 16.3369C136.778 16.3369 139.178 16.9391 141.226 18.1435C143.273 19.3479 144.865 21.0685 146 23.3052C147.136 25.5247 147.704 28.1744 147.704 31.2542V56.4949H136.709V33.2157C136.726 30.7897 136.107 28.897 134.851 27.5378C133.595 26.1613 131.866 25.4731 129.663 25.4731C128.184 25.4731 126.876 25.7914 125.74 26.428C124.622 27.0646 123.745 27.9938 123.108 29.2154C122.489 30.4198 122.17 31.8736 122.153 33.577Z" fill="currentColor"/><path d="M89.4224 57.2691C85.3447 57.2691 81.8347 56.4432 78.8926 54.7914C75.9676 53.1225 73.7137 50.7653 72.1307 47.7199C70.5478 44.6573 69.7563 41.0355 69.7563 36.8545C69.7563 32.7768 70.5478 29.198 72.1307 26.1182C73.7137 23.0384 75.9418 20.6382 78.8151 18.9176C81.7057 17.1971 85.0952 16.3368 88.9837 16.3368C91.5989 16.3368 94.0335 16.7583 96.2875 17.6014C98.5586 18.4273 100.537 19.6747 102.223 21.3436C103.927 23.0126 105.252 25.1117 106.198 27.6409C107.144 30.1529 107.617 33.0951 107.617 36.4674V39.487H74.1438V32.6736H97.2682C97.2682 31.0906 96.9241 29.6884 96.2359 28.4668C95.5476 27.2452 94.5927 26.2903 93.3711 25.602C92.1667 24.8966 90.7645 24.5439 89.1643 24.5439C87.4954 24.5439 86.0157 24.931 84.7253 25.7053C83.4521 26.4623 82.4541 27.486 81.7315 28.7765C81.0089 30.0497 80.6389 31.4692 80.6217 33.0349V39.5128C80.6217 41.4743 80.983 43.169 81.7057 44.5971C82.4455 46.0252 83.4865 47.1263 84.8285 47.9006C86.1706 48.6748 87.7621 49.062 89.6031 49.062C90.8247 49.062 91.9431 48.8899 92.9582 48.5458C93.9733 48.2017 94.8422 47.6855 95.5648 46.9973C96.2875 46.309 96.8381 45.466 97.2166 44.468L107.385 45.1391C106.869 47.5823 105.811 49.7158 104.211 51.5396C102.628 53.3462 100.58 54.757 98.0683 55.7722C95.5734 56.7701 92.6915 57.2691 89.4224 57.2691ZM84.7769 11.7429L90.2483 0H100.417L92.5452 11.7429H84.7769Z" fill="currentColor"/><path d="M50.2466 57.2692C46.186 57.2692 42.6933 56.4089 39.7683 54.6883C36.8606 52.9506 34.6238 50.5418 33.0581 47.462C31.5096 44.3821 30.7354 40.8378 30.7354 36.8289C30.7354 32.7683 31.5182 29.2068 33.0839 26.1441C34.6668 23.0643 36.9122 20.6641 39.8199 18.9436C42.7277 17.2058 46.186 16.3369 50.195 16.3369C53.6533 16.3369 56.6815 16.9649 59.2795 18.2209C61.8776 19.4769 63.9337 21.2405 65.4478 23.5117C66.9619 25.7828 67.7963 28.4497 67.9512 31.5123H57.5762C57.2837 29.5337 56.5094 27.9421 55.2534 26.7377C54.0146 25.5161 52.3887 24.9053 50.3756 24.9053C48.6723 24.9053 47.184 25.3699 45.9107 26.299C44.6547 27.2109 43.674 28.5443 42.9686 30.2993C42.2631 32.0543 41.9104 34.1792 41.9104 36.674C41.9104 39.2032 42.2545 41.3539 42.9428 43.1261C43.6482 44.8983 44.6375 46.249 45.9107 47.1781C47.184 48.1072 48.6723 48.5717 50.3756 48.5717C51.6316 48.5717 52.7586 48.3136 53.7565 47.7975C54.7717 47.2813 55.6061 46.5329 56.26 45.5521C56.931 44.5542 57.3697 43.3584 57.5762 41.9647H67.9512C67.7791 44.9929 66.9533 47.6598 65.4736 49.9654C64.0111 52.2537 61.9894 54.0431 59.4086 55.3336C56.8277 56.624 53.7737 57.2692 50.2466 57.2692Z" fill="currentColor"/><path d="M16.1678 56.4945V16.8527H27.1622V56.4945H16.1678ZM21.6908 11.7426C20.0563 11.7426 18.654 11.2006 17.4841 10.1167C16.3313 9.01551 15.7549 7.69927 15.7549 6.16797C15.7549 4.65387 16.3313 3.35484 17.4841 2.27089C18.654 1.16972 20.0563 0.619141 21.6908 0.619141C23.3254 0.619141 24.719 1.16972 25.8718 2.27089C27.0418 3.35484 27.6268 4.65387 27.6268 6.16797C27.6268 7.69927 27.0418 9.01551 25.8718 10.1167C24.719 11.2006 23.3254 11.7426 21.6908 11.7426Z" fill="currentColor"/><path d="M10.9944 3.63965V56.4955H0V3.63965H10.9944Z" fill="currentColor"/><path d="M301.587 54.242C306.165 54.242 310.599 48.7913 314.087 41.2329H315.541C311.834 50.6809 306.238 57.4398 299.842 57.4398C295.046 57.4398 292.139 53.7333 292.139 47.5558C292.139 35.9275 302.095 17.3223 312.197 17.3223C315.613 17.3223 317.721 19.6479 317.721 23.0637C317.721 30.6221 307.837 38.5439 297.517 40.2154C296.863 42.8318 296.499 45.3755 296.499 47.4104C296.499 51.8437 298.534 54.242 301.587 54.242ZM311.543 19.5752C305.947 19.5752 300.569 29.2412 298.025 38.1805C306.529 36.2909 314.16 30.2587 314.16 23.0637C314.16 20.9561 313.578 19.5752 311.543 19.5752Z" fill="currentColor"/><path d="M245.131 56.495H240.989L251.236 26.6976C251.89 24.808 252.69 22.4096 252.69 21.5375C252.69 20.4474 252.254 20.1567 251.6 20.1567C249.129 20.1567 245.422 24.8806 242.951 29.2412H241.425C244.405 23.4998 249.347 17.4676 253.925 17.4676C255.815 17.4676 256.76 18.9938 256.76 20.7381C256.76 22.2643 256.033 24.2266 255.161 26.6976L250.364 39.9247H250.945C258.94 23.0637 263.882 17.3223 268.679 17.3223C271.004 17.3223 272.385 19.1392 272.385 21.6829C272.385 25.8981 268.969 32.5117 265.699 39.9247H266.208C274.202 23.0637 279.871 17.3223 284.74 17.3223C287.429 17.3223 288.883 19.0665 288.883 21.8282C288.883 27.7877 282.705 39.3433 278.926 48.7186C278.563 49.8088 277.909 51.4077 277.909 52.3524C277.909 53.4426 278.199 54.1694 279.362 54.1694C282.342 54.1694 285.612 49.1547 288.156 43.6312H289.682C287.138 49.8814 282.487 56.9311 277.618 56.9311C274.783 56.9311 273.766 55.3322 273.766 53.1519C273.766 51.8437 274.42 50.2448 275.001 48.6459C279.144 38.1805 284.377 27.279 284.377 23.3544C284.377 21.5375 283.795 20.6654 282.633 20.6654C279.943 20.6654 274.42 25.8981 267.152 40.7969C265.045 45.1575 262.864 50.3902 260.466 56.495H256.324L262.646 40.2154C265.408 33.0931 268.315 26.2615 268.315 23.3544C268.315 21.5375 267.734 20.6654 266.571 20.6654C263.155 20.6654 255.742 29.3866 245.131 56.495Z" fill="currentColor"/></svg>`;

// ─────────────────────────────────────────────────────────────────────────────
// MARKDOWN export — full DS reference
// ─────────────────────────────────────────────────────────────────────────────

export function generateFullStyleGuide(): string {
  const generatedAt = EXPORT_GENERATED_AT();
  const totalSections = totalSectionCount();
  const groupsIndex = NAV_GROUPS.map(
    (g) => `- [${groupLabel(g)}](#${g.id}) — ${g.sections.length} secciones`,
  ).join("\n");
  const groupsBody = NAV_GROUPS.map((g) => {
    const rows = groupMarkdownRows(g);
    return `### ${groupLabel(g)}

| Sección | ID | Estado | Última actualización |
|---------|----|--------|----------------------|
${rows}
`;
  }).join("\n");

  return `# Licénciame — Design System

> Fuente única de verdad para construir interfaces del producto.
> Generado automáticamente desde \`/design-system\`.
>
> **Generado:** ${generatedAt} · **Secciones documentadas:** ${totalSections} · **URL en vivo:** ${PUBLIC_DS_URL}

## Índice

- [Get Started](#get-started)
- [Brand](#brand)
- [Voice & Tone](#voice--tone)
- [Foundations](#foundations)
- [Catálogo completo de secciones](#catálogo-completo-de-secciones)
${groupsIndex}

---

## Get Started

### Introducción
El Design System de Licénciame es la única fuente de verdad para construir interfaces del producto. Define tokens, componentes y patrones que todos los equipos deben usar para mantener una experiencia coherente, accesible y eficiente.

### Principios
1. **Claridad legal primero** — toda acción que implique consumo de créditos o emisión de licencia debe ser inequívoca, explícita y trazable.
2. **Eficiencia operativa** — el usuario debe poder licenciar una canción en máximo 3 clicks desde el catálogo.
3. **Confianza auditable** — los estados de licencias y créditos siempre están visibles, con historial y trazabilidad.
4. **Accesibilidad por defecto** — todo componente cumple WCAG AA sin configuración adicional.
5. **Modernidad sin fricción** — los efectos visuales (glass, glow, blur) están al servicio de la jerarquía, nunca de la decoración.

### Changelog
| Versión | Fecha | Tipo | Cambio |
|---------|-------|------|--------|
| v1.0.0 | 2026-04-17 | Release | Lanzamiento inicial del Design System de Licénciame. |

### Cómo contribuir
1. Identifica si tu necesidad ya está cubierta. Si lo está, úsala.
2. Si no, abre una propuesta describiendo el caso de uso real (no la solución).
3. Discute con el equipo de diseño antes de implementar.
4. Implementa dentro del Design System (nunca como one-off en un feature).
5. Documenta el componente con su ficha completa antes de mergear.

---

## Brand

- **Isotipo** — uso en favicon, sidebar y superficies pequeñas. Tamaño mínimo: 24px.
- **Logotipo** — wordmark completo "licénciame". Tamaño mínimo: 80px ancho.
- **Clear space** — 1× altura de la letra "l" en todos los lados.
- **Fondos permitidos** — blanco (\`#FFFFFF\`) o negro (\`#050505\`). Nunca sobre imágenes sin overlay.

---

## Voice & Tone

| Contexto | Tono | Ejemplo correcto | A evitar |
|----------|------|------------------|----------|
| Onboarding | Amable, guiado | "Conecta tu primera red social para empezar" | "Debe conectar una red social" |
| Error crítico | Claro, sin jerga | "No pudimos procesar tu pago. Intenta de nuevo en unos minutos." | "Error 402: payment declined" |
| Éxito | Celebratorio pero sobrio | "Licencia emitida. Ya puedes usar esta canción." | "¡Éxito!" |
| Confirmación legal | Preciso, sin ambigüedad | "Al continuar, aceptas los términos de uso y la política de privacidad." | "Dale click para continuar" |

---

## Foundations

### CSS Variables (\`:root\`)

\`\`\`css
:root {
  /* Core */
  --color-primary: #DBEC62;
  --color-primary-hover: #C8D855;
  --color-primary-subtle: rgba(219, 236, 98, 0.15);
  --color-black: #050505;
  --color-bg-1: #E7E7E9;
  --color-bg-2: #F3F4F6;
  --color-surface: #FFFFFF;

  /* Neutrales */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-700: #3D3D3D;
  --color-gray-900: #121212;

  /* Semánticos */
  --color-success-subtle: #BAC374;  /* burnt — usar con text-foreground */
  --color-warning-subtle: #E0AE74;  /* burnt — usar con text-foreground */
  --color-error-subtle: #C37474;    /* burnt — usar con text-foreground */
  --color-info-subtle: #7478C3;     /* burnt — usar con text-foreground */

  /* Radios */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  --radius-button: 8px;
  --radius-card: 12px;
  --radius-pill: 9999px;
}
\`\`\`

### Colors

| Nombre | Hex | Tailwind |
|--------|-----|----------|
| Primary | #DBEC62 | \`bg-primary\` |
| Primary Hover | #C8D855 | \`bg-primary-hover\` |
| Black | #050505 | \`bg-lm-black\` |
| BG 1 | #E7E7E9 | \`bg-bg-1\` |
| BG 2 | #F3F4F6 | \`bg-bg-2\` |
| Surface | #FFFFFF | \`bg-surface\` |
| Success | #BAC374 | \`bg-success-subtle\` / \`text-success\` |
| Warning | #E0AE74 | \`bg-warning-subtle\` / \`text-warning\` |
| Error | #C37474 | \`bg-error-subtle\` / \`text-error\` |
| Info | #7478C3 | \`bg-info-subtle\` / \`text-info\` |

### Typography
Inter para UI. Escala: Display 36/700 · H1 24/600 · H2 20/600 · H3 18/500 · Body 16/400 · Body SM 14/400 · Caption 12/500 · Overline 12/600 uppercase.

### Border Radius
sm 6px · md 8px · lg 12px · full 9999px · button 8px · card 12px · pill 9999px.

### Spacing
Base 4px. Escala: 4, 8, 12, 16, 24, 32, 40, 48, 64px.

### Borders
Default \`1px solid var(--color-gray-200)\`. Divider \`border-top\`.

### Animations
| Nombre | Duración | Easing | Uso |
|--------|----------|--------|-----|
| fade-in | 0.3s | ease-out | Page transitions |
| scale-in | 0.2s | ease-out | Modals, popovers |
| slide-in-right | 0.3s | ease-out | Sidesheets |

### Shadows
| Token | Valor | Uso |
|-------|-------|-----|
| sm | 0 1px 2px rgba(0,0,0,0.05) | Inputs |
| md | 0 4px 6px -1px rgba(0,0,0,0.1) | Cards |
| lg | 0 10px 15px -3px rgba(0,0,0,0.1) | Modals |
| glow | 0 0 20px rgba(219,236,98,0.3) | Primary CTA hover |

### Icons
Lucide React, outline, stroke 1.5px. Tamaños: 16px (inline), 20px (nav), 24px (headers).

---

## Catálogo completo de secciones

Cada sección está documentada en vivo en \`${PUBLIC_DS_URL}#<id>\` con anatomía,
variantes, estados, tokens, accesibilidad, do/don't y código. Esta tabla se
regenera automáticamente desde \`NAV_GROUPS\` y \`DS_LAST_UPDATED\` cada vez
que descargas el documento, así que siempre refleja el estado real del DS.

${groupsBody}
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML export — standalone, opens in any browser without dependencies
// ─────────────────────────────────────────────────────────────────────────────

export function generateHTMLStyleGuide(): string {
  const generatedAt = EXPORT_GENERATED_AT();
  const totalSections = totalSectionCount();

  // Auto-generated sidebar nav (every group + every section).
  const sidebarHTML = NAV_GROUPS.map((g) => {
    const items = g.sections
      .map((s) => `    <a href="${PUBLIC_DS_URL}#${s.id}">${sectionLabel(s)}</a>`)
      .join("\n");
    return `  <div class="group"><div class="group-label">${groupLabel(g)}</div>
${items}
  </div>`;
  }).join("\n");

  // Full catalog index section.
  const catalogHTML = NAV_GROUPS.map((g) => {
    return `<div class="ix-group">
  <div class="ix-group-header">
    <h3 class="ix-group-title">${groupLabel(g)}</h3>
    <span class="ix-group-count">${g.sections.length} secciones</span>
  </div>
  <ul class="ix-list">
  ${groupHtmlEntries(g)}
  </ul>
</div>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Licénciame — Design System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --color-primary:#DBEC62;--color-primary-hover:#C8D855;--color-primary-subtle:rgba(219,236,98,0.15);
  --color-black:#050505;--color-bg-1:#E7E7E9;--color-bg-2:#F3F4F6;--color-surface:#FFF;
  --color-gray-50:#F9FAFB;--color-gray-100:#F3F4F6;--color-gray-200:#E5E7EB;
  --color-gray-300:#D1D5DB;--color-gray-400:#9CA3AF;--color-gray-500:#6B7280;
  --color-gray-700:#3D3D3D;--color-gray-900:#121212;
  --color-success-subtle:#BAC374;
  --color-warning-subtle:#E0AE74;
  --color-error-subtle:#C37474;
  --color-info-subtle:#7478C3;
  --radius-sm:6px;--radius-md:8px;--radius-lg:12px;--radius-card:12px;--radius-pill:9999px;
}
html,body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:var(--color-bg-2);color:var(--color-gray-900);line-height:1.5;-webkit-font-smoothing:antialiased}
a{color:inherit}
.topbar{position:fixed;top:0;left:0;right:0;height:60px;background:var(--color-surface);border-bottom:1px solid var(--color-gray-200);display:flex;align-items:center;gap:12px;padding:0 24px;z-index:50}
.topbar .brand{display:flex;align-items:center;gap:10px}
.topbar svg{height:22px;width:auto;color:var(--color-black)}
.topbar h1{font-size:18px;font-weight:700}
.topbar .badge{background:var(--color-primary);color:var(--color-black);padding:2px 10px;border-radius:9999px;font-size:12px;font-weight:500}
.sidebar{position:fixed;left:0;top:60px;width:240px;height:calc(100vh - 60px);background:var(--color-surface);border-right:1px solid var(--color-gray-200);padding:20px 12px;overflow-y:auto}
.sidebar .group{margin-bottom:18px}
.sidebar .group-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--color-gray-500);padding:0 12px 6px}
.sidebar a{display:block;padding:7px 12px;color:var(--color-gray-700);text-decoration:none;font-size:13px;border-radius:var(--radius-sm)}
.sidebar a:hover{background:var(--color-gray-100);color:var(--color-gray-900)}
.content{margin-left:240px;margin-top:60px;padding:40px 48px;max-width:1040px}
section{margin-bottom:64px;scroll-margin-top:80px}
.section-header{padding-bottom:12px;border-bottom:1px solid var(--color-gray-200);margin-bottom:24px;display:flex;align-items:center;gap:10px}
.section-header h2{font-size:24px;font-weight:600}
.section-header .pill{background:var(--color-success-subtle);color:#166534;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:500}
h3{font-size:16px;font-weight:600;margin:20px 0 10px}
p{margin-bottom:10px;color:var(--color-gray-700)}
.swatch{display:inline-block;width:96px;height:64px;border-radius:var(--radius-md);border:1px solid var(--color-gray-200)}
.swatch-row{display:flex;gap:14px;flex-wrap:wrap;margin:12px 0}
.swatch-card{font-size:12px}
.swatch-card .label{margin-top:6px;font-weight:500}
.swatch-card .hex{color:var(--color-gray-500)}
table{width:100%;border-collapse:collapse;margin:12px 0;background:var(--color-surface);border:1px solid var(--color-gray-200);border-radius:var(--radius-md);overflow:hidden}
th,td{text-align:left;padding:10px 14px;border-bottom:1px solid var(--color-gray-200);font-size:14px}
tr:last-child td{border-bottom:none}
th{font-weight:600;background:var(--color-gray-50);font-size:13px}
code{background:var(--color-gray-100);padding:2px 6px;border-radius:4px;font-size:12.5px;font-family:ui-monospace,monospace}
pre{background:var(--color-black);color:var(--color-primary);padding:16px;border-radius:var(--radius-md);font-size:12.5px;overflow-x:auto;font-family:ui-monospace,monospace;margin:10px 0}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:9px 18px;border-radius:var(--radius-md);font-size:14px;font-weight:500;border:none;cursor:pointer;transition:all .2s;font-family:inherit}
.btn-primary{background:var(--color-primary);color:var(--color-black)}
.btn-primary:hover{background:var(--color-primary-hover);box-shadow:0 0 20px rgba(219,236,98,.3)}
.btn-secondary{background:var(--color-surface);color:var(--color-gray-900);border:1px solid var(--color-gray-300)}
.btn-ghost{background:transparent;color:var(--color-gray-700)}
.btn-danger{background:var(--color-error-subtle);color:var(--color-black)}
.btn-glass{background:rgba(255,255,255,0.1);color:#fff;backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.15)}
.badge{display:inline-flex;padding:3px 10px;border-radius:9999px;font-size:12px;font-weight:500}
.row{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:12px 0}
.brand-card{padding:24px;border-radius:var(--radius-card);display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:140px;gap:12px}
.brand-card.light{background:var(--color-surface);border:1px solid var(--color-gray-200);color:var(--color-black)}
.brand-card.dark{background:var(--color-black);color:#fff}
.brand-card svg.iso{height:56px;width:auto}
.brand-card svg.logo{height:32px;width:auto}
.brand-card .caption{font-size:12px;opacity:.7}
.brand-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin:12px 0}
.tone-good{color:#166534}
.tone-bad{color:#991B1B}
.principle-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin:12px 0}
.principle-card{background:var(--color-surface);border:1px solid var(--color-gray-200);border-radius:var(--radius-card);padding:16px}
.principle-card h4{font-size:15px;font-weight:600;margin-bottom:6px}
.principle-card p{font-size:13.5px;margin-bottom:6px}
.principle-card em{font-size:12.5px;color:var(--color-gray-500);font-style:italic}
.material-frosted{background:rgba(5,5,5,.6);backdrop-filter:blur(20px);padding:16px 20px;color:#fff}
.material-stage{background:#050505;border-radius:var(--radius-card);overflow:hidden;margin:10px 0}
.material-content{height:80px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.3);font-size:13px}
.gradient-text{font-size:36px;font-weight:700;background:linear-gradient(135deg,#DBEC62,#8BC34A);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:inline-block}
.shadow-card{width:120px;height:80px;background:#fff;border-radius:var(--radius-card);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:500}
.layout-mock{position:relative;height:340px;background:#EAEAEB;border-radius:var(--radius-card);overflow:hidden;border:1px solid var(--color-gray-200);margin:12px 0;padding:10px}
.layout-mock .body-card{background:#F3F4F6;border-radius:18px;height:100%;margin-left:calc(13.1875rem + 0.625rem);padding:24px}
.layout-mock .ds-sidebar{position:absolute;left:10px;top:10px;bottom:10px;width:13.1875rem;background:rgba(234,234,235,.6);backdrop-filter:blur(60px);border-radius:18px 0 0 18px;border-right:1px solid rgba(0,0,0,.06);padding:20px;font-size:13px;font-weight:500;color:#050505}
.ix-group{margin-bottom:28px}
.ix-group-header{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--color-gray-200)}
.ix-group-title{font-size:16px;font-weight:600;margin:0;color:var(--color-gray-900)}
.ix-group-count{font-size:12px;color:var(--color-gray-500)}
.ix-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px}
.ix-item{display:grid;grid-template-columns:1fr auto auto auto;align-items:center;gap:10px;padding:8px 12px;background:var(--color-surface);border:1px solid var(--color-gray-200);border-radius:var(--radius-md)}
.ix-link{font-size:13.5px;font-weight:500;color:var(--color-gray-900);text-decoration:none}
.ix-link:hover{text-decoration:underline}
.ix-id{font-family:ui-monospace,monospace;font-size:11.5px;color:var(--color-gray-500);background:var(--color-gray-100);padding:2px 6px;border-radius:4px}
.ix-pill{font-size:10.5px;font-weight:600;padding:2px 8px;border-radius:9999px;text-transform:uppercase;letter-spacing:.04em}
.ix-date{font-size:11.5px;color:var(--color-gray-500);font-variant-numeric:tabular-nums}
.export-meta{font-size:12px;color:var(--color-gray-500);margin-left:auto}
@media(max-width:700px){.ix-item{grid-template-columns:1fr;gap:4px}.ix-id,.ix-pill,.ix-date{justify-self:start}}
@media(max-width:900px){.sidebar{display:none}.content{margin-left:0;padding:24px}}
</style>
</head>
<body>
<header class="topbar">
  <span class="brand">${ISOTIPO_SVG}<h1>licénciame</h1></span>
  <span class="badge">Design System</span>
  <span class="export-meta">Generado ${generatedAt} · ${totalSections} secciones</span>
</header>
<nav class="sidebar">
${sidebarHTML}
  <div class="group"><div class="group-label">Catálogo</div>
    <a href="#catalog-index">Todas las secciones</a>
  </div>
</nav>
<main class="content">

<section id="intro"><div class="section-header"><h2>Introducción</h2><span class="pill">stable</span></div>
<p>El Design System de Licénciame es la única fuente de verdad para construir interfaces del producto. Define tokens, componentes y patrones que todos los equipos deben usar para mantener una experiencia coherente, accesible y eficiente.</p>
<p>Está pensado para diseñadores y desarrolladores que trabajan en cualquier superficie del producto: dashboard, marketing, panel admin o herramientas internas.</p>
<p>Para usarlo: importa los componentes desde sus rutas oficiales, consume tokens en lugar de valores hardcoded, y propón cambios al sistema antes de hacer one-offs en features.</p>
</section>

<section id="principles"><div class="section-header"><h2>Principios de diseño</h2><span class="pill">stable</span></div>
<div class="principle-grid">
<div class="principle-card"><h4>1. Claridad legal primero</h4><p>Toda acción que implique consumo de créditos o emisión de licencia debe ser inequívoca, explícita y trazable.</p><em>Ejemplo: el botón "Licenciar" siempre muestra créditos a consumir antes de confirmar.</em></div>
<div class="principle-card"><h4>2. Eficiencia operativa</h4><p>El usuario debe poder licenciar una canción en máximo 3 clicks desde el catálogo.</p><em>Ejemplo: catálogo → preview → licenciar, sin pantallas intermedias innecesarias.</em></div>
<div class="principle-card"><h4>3. Confianza auditable</h4><p>Los estados de licencias y créditos siempre están visibles, con historial y trazabilidad.</p><em>Ejemplo: cada licencia muestra fecha, créditos consumidos, estado y autor.</em></div>
<div class="principle-card"><h4>4. Accesibilidad por defecto</h4><p>Todo componente cumple WCAG AA sin configuración adicional.</p><em>Ejemplo: contraste, focus visible y navegación por teclado vienen incluidos.</em></div>
<div class="principle-card"><h4>5. Modernidad sin fricción</h4><p>Los efectos visuales (glass, glow, blur) están al servicio de la jerarquía, nunca de la decoración.</p><em>Ejemplo: el frosted del sidebar refuerza la separación vertical, no compite con el contenido.</em></div>
</div>
</section>

<section id="changelog"><div class="section-header"><h2>Changelog</h2><span class="pill">stable</span></div>
<table><tr><th>Versión</th><th>Fecha</th><th>Tipo</th><th>Cambio</th></tr>
<tr><td>v1.1.0</td><td>${generatedAt}</td><td>Update</td><td>Export regenerado con catálogo completo (${totalSections} secciones) — driven by NAV_GROUPS + DS_LAST_UPDATED.</td></tr>
<tr><td>v1.0.0</td><td>2026-04-17</td><td>Release</td><td>Lanzamiento inicial del Design System de Licénciame.</td></tr>
</table></section>

<section id="contributing"><div class="section-header"><h2>Cómo contribuir</h2><span class="pill">stable</span></div>
<p>El Design System evoluciona con el producto. Para proponer cambios:</p>
<ol style="padding-left:24px;line-height:1.9;color:var(--color-gray-700)">
<li>Identifica si tu necesidad ya está cubierta. Si lo está, úsala.</li>
<li>Si no, abre una propuesta describiendo el caso de uso real (no la solución).</li>
<li>Discute con el equipo de diseño antes de implementar.</li>
<li>Implementa dentro del Design System (nunca como one-off en un feature).</li>
<li>Documenta el componente con su ficha completa antes de mergear.</li>
</ol>
</section>

<section id="brand"><div class="section-header"><h2>00 — Brand</h2><span class="pill">stable</span></div>
<div class="brand-grid">
<div class="brand-card light"><span class="iso">${ISOTIPO_SVG}</span><span class="caption">Isotipo — claro</span></div>
<div class="brand-card dark"><span class="iso" style="color:#fff">${ISOTIPO_SVG}</span><span class="caption">Isotipo — oscuro</span></div>
<div class="brand-card light"><span class="logo">${LOGOTIPO_SVG}</span><span class="caption">Logotipo — claro</span></div>
<div class="brand-card dark"><span class="logo" style="color:#fff">${LOGOTIPO_SVG}</span><span class="caption">Logotipo — oscuro</span></div>
</div>
<p style="margin-top:12px"><strong>Reglas:</strong> tamaño mínimo isotipo 24px, logotipo 80px ancho. Clear space: 1× altura de "l".</p>
</section>

<section id="voice-tone"><div class="section-header"><h2>Voz y tono</h2><span class="pill">beta</span></div>
<p>Cómo escribimos en cada contexto del producto. Consistencia en el copy es parte del sistema.</p>
<table><tr><th>Contexto</th><th>Tono</th><th>Ejemplo correcto</th><th>A evitar</th></tr>
<tr><td>Onboarding</td><td>Amable, guiado</td><td class="tone-good">Conecta tu primera red social para empezar</td><td class="tone-bad">Debe conectar una red social</td></tr>
<tr><td>Error crítico</td><td>Claro, sin jerga</td><td class="tone-good">No pudimos procesar tu pago. Intenta de nuevo en unos minutos.</td><td class="tone-bad">Error 402: payment declined</td></tr>
<tr><td>Éxito</td><td>Celebratorio pero sobrio</td><td class="tone-good">Licencia emitida. Ya puedes usar esta canción.</td><td class="tone-bad">¡Éxito!</td></tr>
<tr><td>Confirmación legal</td><td>Preciso, sin ambigüedad</td><td class="tone-good">Al continuar, aceptas los términos de uso.</td><td class="tone-bad">Dale click para continuar</td></tr>
</table></section>

<section id="colors"><div class="section-header"><h2>01 — Colors</h2><span class="pill">stable</span></div>
<h3>Core</h3>
<div class="swatch-row">
<div class="swatch-card"><div class="swatch" style="background:#DBEC62"></div><div class="label">Primary</div><div class="hex">#DBEC62</div></div>
<div class="swatch-card"><div class="swatch" style="background:#C8D855"></div><div class="label">Primary Hover</div><div class="hex">#C8D855</div></div>
<div class="swatch-card"><div class="swatch" style="background:#050505"></div><div class="label">Black</div><div class="hex">#050505</div></div>
<div class="swatch-card"><div class="swatch" style="background:#E7E7E9"></div><div class="label">BG 1</div><div class="hex">#E7E7E9</div></div>
<div class="swatch-card"><div class="swatch" style="background:#F3F4F6"></div><div class="label">BG 2</div><div class="hex">#F3F4F6</div></div>
<div class="swatch-card"><div class="swatch" style="background:#FFF"></div><div class="label">Surface</div><div class="hex">#FFFFFF</div></div>
</div>
<h3>Neutrales</h3>
<div class="swatch-row">
<div class="swatch-card"><div class="swatch" style="background:#F9FAFB"></div><div class="label">Gray 50</div></div>
<div class="swatch-card"><div class="swatch" style="background:#F3F4F6"></div><div class="label">Gray 100</div></div>
<div class="swatch-card"><div class="swatch" style="background:#E5E7EB"></div><div class="label">Gray 200</div></div>
<div class="swatch-card"><div class="swatch" style="background:#D1D5DB"></div><div class="label">Gray 300</div></div>
<div class="swatch-card"><div class="swatch" style="background:#9CA3AF"></div><div class="label">Gray 400</div></div>
<div class="swatch-card"><div class="swatch" style="background:#6B7280"></div><div class="label">Gray 500</div></div>
<div class="swatch-card"><div class="swatch" style="background:#3D3D3D"></div><div class="label">Gray 700</div></div>
<div class="swatch-card"><div class="swatch" style="background:#121212"></div><div class="label">Gray 900</div></div>
</div>
<h3>Semánticos</h3>
<div class="swatch-row">
<div class="swatch-card"><div class="swatch" style="background:#BAC374"></div><div class="label">Success</div><div class="hex">#BAC374</div></div>
<div class="swatch-card"><div class="swatch" style="background:#E0AE74"></div><div class="label">Warning</div><div class="hex">#E0AE74</div></div>
<div class="swatch-card"><div class="swatch" style="background:#C37474"></div><div class="label">Error</div><div class="hex">#C37474</div></div>
<div class="swatch-card"><div class="swatch" style="background:#7478C3"></div><div class="label">Info</div><div class="hex">#7478C3</div></div>
</div></section>

<section id="typography"><div class="section-header"><h2>02 — Typography</h2><span class="pill">stable</span></div>
<table><tr><th>Token</th><th>Size</th><th>Weight</th><th>Tailwind</th><th>Specimen</th></tr>
<tr><td>Display</td><td>36px</td><td>700</td><td><code>text-4xl font-bold</code></td><td style="font-size:36px;font-weight:700">Aa</td></tr>
<tr><td>Heading 1</td><td>24px</td><td>600</td><td><code>text-2xl font-semibold</code></td><td style="font-size:24px;font-weight:600">Aa</td></tr>
<tr><td>Heading 2</td><td>20px</td><td>600</td><td><code>text-xl font-semibold</code></td><td style="font-size:20px;font-weight:600">Aa</td></tr>
<tr><td>Heading 3</td><td>18px</td><td>500</td><td><code>text-lg font-medium</code></td><td style="font-size:18px;font-weight:500">Aa</td></tr>
<tr><td>Body</td><td>16px</td><td>400</td><td><code>text-base</code></td><td style="font-size:16px">Aa</td></tr>
<tr><td>Body SM</td><td>14px</td><td>400</td><td><code>text-sm</code></td><td style="font-size:14px">Aa</td></tr>
<tr><td>Caption</td><td>12px</td><td>500</td><td><code>text-xs font-medium</code></td><td style="font-size:12px;font-weight:500">Aa</td></tr>
<tr><td>Overline</td><td>12px</td><td>600</td><td><code>uppercase tracking-wider</code></td><td style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">OVERLINE</td></tr>
</table></section>

<section id="radius"><div class="section-header"><h2>03 — Border Radius</h2><span class="pill">stable</span></div>
<table><tr><th>Token</th><th>Value</th><th>Demo</th></tr>
<tr><td>sm</td><td>6px</td><td><div style="width:48px;height:48px;background:var(--color-primary);border-radius:6px"></div></td></tr>
<tr><td>md</td><td>8px</td><td><div style="width:48px;height:48px;background:var(--color-primary);border-radius:8px"></div></td></tr>
<tr><td>lg</td><td>12px</td><td><div style="width:48px;height:48px;background:var(--color-primary);border-radius:12px"></div></td></tr>
<tr><td>full</td><td>9999px</td><td><div style="width:48px;height:48px;background:var(--color-primary);border-radius:9999px"></div></td></tr>
</table></section>

<section id="spacing"><div class="section-header"><h2>04 — Spacing</h2><span class="pill">stable</span></div>
<p>Base 4px. Escala: 4, 8, 12, 16, 24, 32, 40, 48, 64px.</p>
<table><tr><th>Token</th><th>Value</th><th>Tailwind</th></tr>
<tr><td>space-1</td><td>4px</td><td><code>p-1</code></td></tr>
<tr><td>space-2</td><td>8px</td><td><code>p-2</code></td></tr>
<tr><td>space-3</td><td>12px</td><td><code>p-3</code></td></tr>
<tr><td>space-4</td><td>16px</td><td><code>p-4</code></td></tr>
<tr><td>space-6</td><td>24px</td><td><code>p-6</code></td></tr>
<tr><td>space-8</td><td>32px</td><td><code>p-8</code></td></tr>
<tr><td>space-10</td><td>40px</td><td><code>p-10</code></td></tr>
<tr><td>space-12</td><td>48px</td><td><code>p-12</code></td></tr>
<tr><td>space-16</td><td>64px</td><td><code>p-16</code></td></tr>
</table></section>

<section id="borders"><div class="section-header"><h2>05 — Borders & Dividers</h2><span class="pill">stable</span></div>
<p>Default: <code>1px solid var(--color-gray-200)</code>. Divider: <code>border-top</code>.</p>
<div style="border-top:1px solid var(--color-gray-200);margin:16px 0"></div>
</section>

<section id="animations"><div class="section-header"><h2>06 — Animations</h2><span class="pill">stable</span></div>
<table><tr><th>Name</th><th>Duration</th><th>Easing</th><th>Use</th></tr>
<tr><td>fade-in</td><td>0.3s</td><td>ease-out</td><td>Page transitions</td></tr>
<tr><td>scale-in</td><td>0.2s</td><td>ease-out</td><td>Modals, popovers</td></tr>
<tr><td>slide-in-right</td><td>0.3s</td><td>ease-out</td><td>Sidesheets</td></tr>
</table></section>

<section id="shadows"><div class="section-header"><h2>07 — Shadows</h2><span class="pill">stable</span></div>
<div class="row">
<div class="shadow-card" style="box-shadow:0 1px 2px rgba(0,0,0,.05)">sm</div>
<div class="shadow-card" style="box-shadow:0 4px 6px -1px rgba(0,0,0,.1)">md</div>
<div class="shadow-card" style="box-shadow:0 10px 15px -3px rgba(0,0,0,.1)">lg</div>
<div class="shadow-card" style="box-shadow:0 0 20px rgba(219,236,98,.4)">glow</div>
</div></section>

<section id="icons"><div class="section-header"><h2>08 — Icons</h2><span class="pill">stable</span></div>
<p>Lucide React — outline, stroke 1.5px. Tamaños: 16px (inline), 20px (nav), 24px (headers).</p>
</section>

<section id="catalog-index"><div class="section-header"><h2>09 — Catálogo completo de secciones</h2><span class="pill">live</span></div>
<p>Cada sección está documentada en vivo en <code>${PUBLIC_DS_URL}#&lt;id&gt;</code> con anatomía, variantes, estados, tokens, accesibilidad, do/don't y código. Esta tabla se regenera automáticamente desde la navegación del Design System cada vez que descargas el documento.</p>
${catalogHTML}
</section>

</main>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar legacy spec (kept for backward compatibility)
// ─────────────────────────────────────────────────────────────────────────────

export function generateSidebarSpec(): string {
  return `# Sidebar — Licénciame Design System

## Anatomía
- SidebarShell (frosted container, 211px, blur 60px)
- SidebarLogo (isotipo h-7)
- SidebarNavItem (active/default/hover)
- SidebarNav (lista de items)
- SidebarUser (avatar + nombre + rol)

## Specs
- Width: 13.1875rem (211px)
- Background: rgba(234, 234, 235, 0.6)
- Backdrop filter: blur(60px)
- Border-right: 1px solid rgba(0, 0, 0, 0.06)
- Z-index: 50
- Active pill: bg #DBEC62, rounded-r-full, text #050505
- Inactive text: #050505 @ 60%
- Hover: bg-black/5 + text @ 80%
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Prompt template for LLMs
// ─────────────────────────────────────────────────────────────────────────────

export function generatePromptTemplate(): string {
  const total = totalSectionCount();
  const groupsList = NAV_GROUPS.map(
    (g) => `- **${groupLabel(g)}** (${g.sections.length}): ${g.sections.map((s) => sectionLabel(s)).join(", ")}`,
  ).join("\n");

  return `# PROMPT — Construir el Design System de Licénciame

Construye una página \`/design-system\` que sirva como referencia visual completa del sistema. El DS actual documenta **${total} secciones** organizadas en estos grupos:

${groupsList}

Debe incluir:
- Top bar con búsqueda + botones "Descargar HTML / Markdown / Copy Prompt".
- Sidebar fijo a la izquierda con todos los grupos del listado anterior.
- Cada sección se documenta con DSComponentSpec (anatomía, variantes, estados, tokens, accesibilidad, do/don't y código), en layout split 5/7 cuando es un component-spec o secuencial cuando es una guía/layout.

## Tokens core

\`\`\`css
--color-primary:#DBEC62; --color-primary-hover:#C8D855; --color-black:#050505;
--color-bg-1:#E7E7E9; --color-bg-2:#F3F4F6; --color-surface:#FFFFFF;
--color-success-subtle:#BAC374; --color-warning-subtle:#E0AE74; --color-error-subtle:#C37474; --color-info-subtle:#7478C3;
--radius-sm:6px; --radius-md:8px; --radius-card:12px; --radius-pill:9999px;
\`\`\`

## Tipografía
Inter (Google Fonts). Pesos: 400, 500, 600, 700. Escala Display 36/700 → Overline 12/600 uppercase.

## Materiales
- Frosted: \`rgba(5,5,5,0.6) + blur(20px)\`
- Glass button: \`rgba(255,255,255,0.1) + blur(12px)\`
- Blur card: \`rgba(255,255,255,0.85) + blur(50px)\`

## Componentes
Buttons (Primary/Secondary/Ghost/Danger/Glass), Cards (Default/Dark/Glass), Forms (Default/Error/Disabled), Badges (Vigente/Consumida/Expirada/Pendiente/Info/Primary/Género), Sidebar frosted 211px, Layout Dashboard v2 (PageShell + AppSidebar + BodyCard).

## Reglas
- Cero hex hardcoded en componentes — solo tokens.
- Strings en español agrupados por feature.
- Código en inglés (variables, props, archivos).
- Componentes <300 líneas.
- Estados visuales: loading, empty, error, success.
- Accesibilidad: WCAG AA, focus visible, navegación por teclado, contraste verificado.
`;
}
