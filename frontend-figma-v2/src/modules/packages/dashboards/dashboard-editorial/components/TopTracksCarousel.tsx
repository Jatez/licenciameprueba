import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { TrackCardLarge } from "./TrackCardLarge";
import { editorialStrings } from "../strings";

interface TopTrack {
  rank: number;
  title: string;
  artist: string;
  licenses: number;
  reach: string;
  coverClassName: string;
}

const TRACKS: TopTrack[] = [
  {
    rank: 1,
    title: "Cat Eyes",
    artist: "Kinna Mora",
    licenses: 5,
    reach: "12.3k",
    coverClassName: "bg-gradient-to-br from-primary via-primary to-lm-black",
  },
  {
    rank: 2,
    title: "VITAMIN C",
    artist: "Millkjind",
    licenses: 4,
    reach: "9.8k",
    coverClassName: "bg-gradient-to-tr from-lm-black via-lm-gray-700 to-primary",
  },
  {
    rank: 3,
    title: "I Like The Way",
    artist: "Jane & The Boy",
    licenses: 3,
    reach: "7.1k",
    coverClassName: "bg-gradient-to-bl from-primary via-lm-gray-200 to-card",
  },
  {
    rank: 4,
    title: "Love Gets Me High",
    artist: "Sunny Fruit",
    licenses: 3,
    reach: "5.6k",
    coverClassName: "bg-gradient-to-br from-lm-black via-primary to-lm-black",
  },
  {
    rank: 5,
    title: "What Dreams Are M",
    artist: "Sunny Fruit",
    licenses: 2,
    reach: "4.2k",
    coverClassName: "bg-gradient-to-tl from-lm-gray-700 via-lm-gray-300 to-primary",
  },
];

const SCROLL_STEP = 320;

/**
 * Editorial top tracks carousel: header + horizontal scroll of large track cards.
 * Scroll is contained — does not trigger global horizontal scroll.
 */
export function TopTracksCarousel() {
  const t = editorialStrings.topTracks;
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({
      left: SCROLL_STEP * direction,
      behavior: "smooth",
    });
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-serif text-2xl text-foreground md:text-3xl">
            {t.title}
          </h2>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-pill px-3 py-2 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
          >
            {t.seeAll}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label={t.prevAria}
              className="grid h-9 w-9 place-items-center rounded-pill border border-border bg-card text-foreground transition-colors hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label={t.nextAria}
              className="grid h-9 w-9 place-items-center rounded-pill border border-border bg-card text-foreground transition-colors hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={scrollerRef}
        className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:thin]"
      >
        {TRACKS.map((track) => (
          <TrackCardLarge key={track.rank} {...track} />
        ))}
      </div>
    </section>
  );
}
