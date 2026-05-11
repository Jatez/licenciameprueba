import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authStrings } from "@/modules/auth/strings";

export default function Landing() {
  const t = authStrings.landing;
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <section className="mx-auto max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {t.title}
          </h1>
          <p className="mx-auto max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
            {t.subtitle}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/register">{t.ctaPrimary}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link to="/login">{t.ctaSecondary}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
