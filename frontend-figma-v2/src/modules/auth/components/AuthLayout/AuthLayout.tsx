import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Music, Sparkles } from "lucide-react";
import brandLogotipo from "@/assets/brand-logotipo.svg";
import { authStrings } from "../../strings";

type AuthLayoutProps = {
  children: ReactNode;
  /** Optional override for the right-panel footer. */
  footer?: ReactNode;
};

const bullets = [
  { icon: ShieldCheck, key: "secure" as const },
  { icon: Music, key: "traceable" as const },
  { icon: Sparkles, key: "fast" as const },
];

/**
 * Split-screen auth layout, mirroring the visual pattern used in Register.
 * The branding panel sits on the LEFT (lime) for visual consistency with
 * Licénciame's brand presence on the marketing surface.
 */
export function AuthLayout({ children, footer }: AuthLayoutProps) {
  const t = authStrings.login.branding;
  const logoAlt = authStrings.register.branding.logoAlt;

  return (
    <main className="grid min-h-screen lg:grid-cols-[45%_55%]">
      {/* Branding panel — desktop only */}
      <aside className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-lm-black to-lm-gray-900 p-12 xl:p-16">
        <div>
          <Link to="/" aria-label="Licénciame">
            <img
              src={brandLogotipo}
              alt={logoAlt}
              className="h-8 w-auto"
              style={{ filter: "invert(1)" }}
            />
          </Link>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight text-background leading-[1.1]">
              {t.headline}
            </h1>
            <p className="text-base text-lm-gray-300 max-w-md">{t.subtitle}</p>
          </div>

          <ul className="space-y-4">
            {bullets.map(({ icon: Icon, key }) => (
              <li key={key} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-metric-subtle/[0.63]">
                  <Icon className="h-5 w-5 text-metric" aria-hidden="true" />
                </span>
                <span className="text-sm text-background">{t.bullets[key]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-lm-gray-500">© Licénciame</div>
      </aside>

      {/* Form panel */}
      <section className="flex flex-col justify-center bg-background px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" aria-label="Licénciame">
              <img src={brandLogotipo} alt={logoAlt} className="h-7 w-auto" />
            </Link>
          </div>
          {children}
          {footer ? <div className="mt-8">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}
