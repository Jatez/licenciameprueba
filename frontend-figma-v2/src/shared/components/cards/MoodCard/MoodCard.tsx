import { ArrowUpRight } from "lucide-react";
import { ImageOverlayCard } from "@/shared/components/ds/ImageOverlayCard";
import type { MoodCardProps } from "./MoodCard.types";

/**
 * MoodCard — horizontal 8:5 image card with white blur panel at the bottom.
 *
 * Thin adapter over <ImageOverlayCard /> — public API preserved.
 * Visual preset:
 * - aspectRatio: 8/5
 * - overlayStyle: blur-panel
 * - hoverEffect: scale
 * - cta: <ArrowUpRight />
 *
 * Functionally identical to <CategoryCard /> with a wider aspect ratio.
 * Kept as a separate export for backwards compatibility; new code should
 * prefer <ImageOverlayCard /> directly.
 */
export function MoodCard({ title, description, image }: MoodCardProps) {
  return (
    <div className="flex-shrink-0 snap-start w-[420px]">
      <ImageOverlayCard
        image={image}
        title={title}
        description={description}
        aspectRatio="8/5"
        overlayStyle="blur-panel"
        hoverEffect="scale"
        cta={<ArrowUpRight size={20} className="text-lm-gray-700" />}
      />
    </div>
  );
}
