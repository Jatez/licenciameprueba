import { BarChart3, Music, Plus, ShieldCheck } from "lucide-react";
import brandLogotipo from "@/assets/brand-logotipo.svg";
import { RegisterForm } from "@/modules/auth/components/RegisterForm";
import { authStrings } from "@/modules/auth/strings";

export default function Register() {
  const t = authStrings.register.branding;

  const bullets = [
    { icon: Music, label: t.bullets.catalog },
    { icon: ShieldCheck, label: t.bullets.legal },
    { icon: BarChart3, label: t.bullets.metrics },
  ];

  return (
    <main className="grid min-h-screen lg:grid-cols-[45%_55%]">
      {/* Branding panel — desktop only */}
      <aside className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-lm-black to-lm-gray-900 p-12 xl:p-16">
        <div>
          <img
            src={brandLogotipo}
            alt={t.logoAlt}
            className="h-8 w-auto"
            style={{ filter: "invert(1)" }}
          />
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight text-background leading-[1.1]">
              {t.headline}
            </h1>
            <p className="text-base text-lm-gray-300 max-w-md">{t.subtitle}</p>
          </div>

          <ul className="space-y-4">
            {bullets.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-metric-subtle/[0.63]">
                  <Icon className="h-5 w-5 text-metric" aria-hidden="true" />
                </span>
                <span className="text-sm text-background">{label}</span>
              </li>
            ))}
          </ul>

          <div className="inline-flex items-center gap-3 rounded-full border border-lm-gray-700 bg-lm-black/40 px-4 py-2">
            <div className="flex -space-x-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-lm-black ring-2 ring-lm-black">
                MG
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-lm-black ring-2 ring-lm-black">
                AC
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lm-gray-700 text-lm-gray-300 ring-2 ring-lm-black">
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </div>
            <span className="text-xs text-lm-gray-300">{t.socialProof}</span>
          </div>
        </div>

        <div className="text-xs text-lm-gray-500">© Licénciame</div>
      </aside>

      {/* Form panel */}
      <section className="flex flex-col justify-center bg-background px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <img src={brandLogotipo} alt={t.logoAlt} className="h-7 w-auto" />
          </div>
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
