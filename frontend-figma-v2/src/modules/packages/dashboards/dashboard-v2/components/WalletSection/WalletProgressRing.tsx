interface WalletProgressRingProps {
  value: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  /** Track CSS color (defaults to muted). */
  trackColor?: string;
  /** Active stroke CSS color (defaults to primary). */
  activeColor?: string;
}

export function WalletProgressRing({
  value,
  total,
  size = 180,
  strokeWidth = 14,
  trackColor = "hsl(var(--color-gray-100))",
  activeColor = "hsl(var(--color-primary))",
}: WalletProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = Math.max(total, 1);
  const pct = Math.min(value / safeTotal, 1);
  const dashOffset = circumference * (1 - pct);
  const center = size / 2;
  const percentLabel = Math.round(pct * 100);

  return (
    <svg
      width={size}
      height={size}
      role="img"
      aria-label={`${value} de ${total} créditos, ${percentLabel}%`}
      className="-rotate-90"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={activeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
    </svg>
  );
}
