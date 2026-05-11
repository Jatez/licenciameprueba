import { ImageOverlayCard } from "@/shared/components/ds/ImageOverlayCard";

interface ThemedCardProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}

/**
 * ThemedCard — catalog filter preset tile.
 *
 * Thin adapter over <ImageOverlayCard /> — public API preserved.
 * Visual preset:
 * - aspectRatio: 8/5
 * - overlayStyle: gradient-bottom (ink-900 fade)
 * - hoverEffect: scale (1.04)
 */
export function ThemedCard({ title, description, image, onClick }: ThemedCardProps) {
  return (
    <ImageOverlayCard
      image={image}
      title={title}
      description={description}
      aspectRatio="8/5"
      overlayStyle="gradient-bottom"
      overlayIntensity="default"
      hoverEffect="scale"
      onClick={onClick}
      className="rounded-xl border-white/20 bg-white/10 backdrop-blur-md"
    />
  );
}
