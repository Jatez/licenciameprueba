import { ConsumptionRow } from "./ConsumptionRow";
import { ConsumptionInsightCard } from "./ConsumptionInsightCard";
import { editorialStrings } from "../strings";

interface ConsumptionType {
  label: string;
  percent: number;
  credits: number;
  highlighted?: boolean;
}

const TYPES: ConsumptionType[] = [
  { label: "Uso único", percent: 60, credits: 24 },
  { label: "Stories", percent: 40, credits: 16 },
  { label: "Extendido mensual", percent: 50, credits: 20 },
  { label: "Video largo", percent: 75, credits: 30, highlighted: true },
  { label: "Pauta paga", percent: 20, credits: 8 },
  { label: "Colaborativo", percent: 30, credits: 12 },
];

/**
 * Section "Cómo usas tus créditos": 60/40 layout — list left, insight card right.
 */
export function ConsumptionSection() {
  const t = editorialStrings.consumption;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-serif text-2xl text-foreground md:text-3xl">
        {t.title}
      </h2>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-lg border border-border bg-card p-6 md:p-8 lg:col-span-3">
          <div className="flex flex-col divide-y divide-border">
            {TYPES.map((type) => (
              <ConsumptionRow key={type.label} {...type} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <ConsumptionInsightCard />
        </div>
      </div>
    </section>
  );
}
