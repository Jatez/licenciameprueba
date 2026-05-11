interface TrackCardLargeProps {
  rank: number;
  title: string;
  artist: string;
  licenses: number;
  reach: string;
  /** Pre-built Tailwind gradient classes applied to the cover surface. */
  coverClassName: string;
}

/**
 * Large editorial track card: 280×360 with cover gradient + rank pill + meta.
 */
export function TrackCardLarge({
  rank,
  title,
  artist,
  licenses,
  reach,
  coverClassName,
}: TrackCardLargeProps) {
  return (
    <article className="group flex w-[260px] shrink-0 snap-start flex-col gap-4 sm:w-[280px]">
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-lg shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md ${coverClassName}`}
      >
        <span className="absolute left-3 top-3 inline-flex items-center rounded-pill bg-lm-black px-2.5 py-1 text-xs font-medium text-white">
          #{rank}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="font-serif text-xl leading-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{artist}</p>
        <p className="pt-1 text-xs text-muted-foreground">
          {licenses} licencias · {reach} de alcance
        </p>
      </div>
    </article>
  );
}
