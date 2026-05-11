interface ColorSwatchProps {
  name: string;
  tokenClass: string;
  swatchClass: string;
  usage: string;
}

export function ColorSwatch({ name, tokenClass, swatchClass, usage }: ColorSwatchProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-surface">
      <div className={`h-20 ${swatchClass}`} />
      <div className="p-3">
        <p className="font-semibold text-foreground">{name}</p>
        <code className="block mt-1 text-xs text-muted-foreground font-mono">{tokenClass}</code>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{usage}</p>
      </div>
    </div>
  );
}
