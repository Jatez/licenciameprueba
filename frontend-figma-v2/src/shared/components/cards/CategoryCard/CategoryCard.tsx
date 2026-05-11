import { ArrowUpRight } from "lucide-react";
import { ImageOverlayCard } from "@/shared/components/ds/ImageOverlayCard";
import type { CategoryCardProps } from "./CategoryCard.types";

/**
 * CategoryCard — vertical 1:1 image card with white blur panel at the bottom.
 *
 * Thin adapter over <ImageOverlayCard /> — public API preserved.
 * Visual preset:
 * - aspectRatio: 1/1
 * - overlayStyle: blur-panel (white 60% + 100px backdrop-blur)
 * - hoverEffect: scale
 * - cta: <ArrowUpRight />
 */
export function CategoryCard({ title, description, image }: CategoryCardProps) {
  return (
    <div className="flex-shrink-0 snap-start w-[280px]">
      <ImageOverlayCard
        image={image}
        title={title}
        description={description}
        aspectRatio="1/1"
        overlayStyle="blur-panel"
        hoverEffect="scale"
        cta={<ArrowUpRight size={20} className="text-lm-gray-700" />}
      />
    </div>
  );
}
