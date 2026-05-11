/**
 * Build an SVG path `d` attribute for a sparkline polyline.
 * Returns also the area path (closed) for optional fill.
 */
export function buildSparklinePath(
  values: number[],
  width: number,
  height: number,
  padding = 2,
): { line: string; area: string } {
  if (values.length === 0) return { line: "", area: "" };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = width - padding * 2;
  const h = height - padding * 2;
  const stepX = values.length > 1 ? w / (values.length - 1) : 0;

  const coords = values.map((v, i) => {
    const x = padding + i * stepX;
    const y = padding + h - ((v - min) / range) * h;
    return [x, y] as const;
  });

  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const lastX = coords[coords.length - 1][0].toFixed(2);
  const firstX = coords[0][0].toFixed(2);
  const area = `${line} L${lastX},${(padding + h).toFixed(2)} L${firstX},${(padding + h).toFixed(2)} Z`;

  return { line, area };
}
