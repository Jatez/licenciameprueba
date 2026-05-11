interface ConsumptionRowProps {
  label: string;
  percent: number;
  credits: number;
  highlighted?: boolean;
}

/**
 * Single consumption-by-type row: label · progress bar · credits.
 * Highlighted rows render the bar in primary lime.
 */
export function ConsumptionRow({
  label,
  percent,
  credits,
  highlighted = false,
}: ConsumptionRowProps) {
  return (
    <div className="grid grid-cols-12 items-center gap-4 py-3">
      <span className="col-span-4 text-sm text-foreground sm:col-span-3">
        {label}
      </span>

      <div className="col-span-5 sm:col-span-7">
        <div className="h-2 w-full overflow-hidden rounded-pill bg-lm-gray-200">
          <div
            className={`h-full rounded-pill ${
              highlighted ? "bg-primary" : "bg-lm-gray-400"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <span className="col-span-3 text-right font-serif text-lg text-foreground sm:col-span-2">
        {credits} cr
      </span>
    </div>
  );
}
