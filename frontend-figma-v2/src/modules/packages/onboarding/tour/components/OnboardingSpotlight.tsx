import { useMemo } from "react";
import { useSpotlightTarget } from "../hooks/useSpotlightTarget";
import { OnboardingTooltipCard } from "./OnboardingTooltipCard";
import type { OnboardingTourStep } from "../types";

interface OnboardingSpotlightProps {
  step: OnboardingTourStep;
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

const PADDING = 8;
const TOOLTIP_WIDTH = 320;
const TOOLTIP_GAP = 16;

/**
 * Renders a full-screen dim overlay with a transparent cutout around the
 * step's target element + an anchored tooltip card.
 *
 * Implementation note: we use a single fixed div with a giant box-shadow trick
 * (a transparent rect + outer shadow that fills the viewport) to avoid SVG.
 */
export function OnboardingSpotlight(props: OnboardingSpotlightProps) {
  const { step } = props;
  const { rect } = useSpotlightTarget(step.targetSelector, step.fallbackSelector);

  // Tooltip position. If we don't have a rect yet, center it.
  const tooltipStyle = useMemo<React.CSSProperties>(() => {
    if (!rect) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }
    const placement = step.placement ?? "right";
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let top = 0;
    let left = 0;

    switch (placement) {
      case "right":
        top = rect.top + rect.height / 2;
        left = rect.left + rect.width + TOOLTIP_GAP;
        break;
      case "left":
        top = rect.top + rect.height / 2;
        left = rect.left - TOOLTIP_GAP - TOOLTIP_WIDTH;
        break;
      case "bottom":
        top = rect.top + rect.height + TOOLTIP_GAP;
        left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
        break;
      case "top":
      default:
        top = rect.top - TOOLTIP_GAP;
        left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
        break;
    }

    // Clamp within viewport.
    left = Math.max(16, Math.min(left, viewportW - TOOLTIP_WIDTH - 16));
    top = Math.max(16, Math.min(top, viewportH - 220));

    const transform =
      placement === "right" || placement === "left"
        ? "translateY(-50%)"
        : undefined;

    return { top, left, transform };
  }, [rect, step.placement]);

  // No target found yet → render a centered tooltip + dim overlay (no cutout).
  if (!rect) {
    return (
      <div className="fixed inset-0 z-[95] pointer-events-none">
        <div
          className="absolute inset-0 bg-foreground/50 pointer-events-auto"
          aria-hidden="true"
        />
        <div className="absolute pointer-events-auto" style={tooltipStyle}>
          <OnboardingTooltipCard {...props} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[95] pointer-events-none">
      {/* Cutout: transparent rect with massive outer shadow that paints the dim overlay. */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-auto rounded-xl ring-2 ring-primary/80 transition-all duration-300 ease-out"
        style={{
          top: rect.top - PADDING,
          left: rect.left - PADDING,
          width: rect.width + PADDING * 2,
          height: rect.height + PADDING * 2,
          boxShadow: "0 0 0 9999px hsl(var(--foreground) / 0.55)",
        }}
      />
      <div className="absolute pointer-events-auto" style={tooltipStyle}>
        <OnboardingTooltipCard {...props} />
      </div>
    </div>
  );
}
