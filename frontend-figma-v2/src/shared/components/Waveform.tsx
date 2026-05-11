interface WaveformProps {
  bars?: number;
  activeCount?: number;
  className?: string;
}

function seededHeight(index: number): number {
  const x = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  const normalized = x - Math.floor(x); // 0–1
  return 6 + normalized * 16; // 6–22px
}

export function Waveform({ bars = 30, activeCount = 0, className = '' }: WaveformProps) {
  return (
    <div className={`flex items-end gap-[1px] h-6 ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-[2px] rounded-full ${i < activeCount ? 'bg-primary' : 'bg-lm-gray-300'}`}
          style={{ height: `${seededHeight(i)}px` }}
        />
      ))}
    </div>
  );
}
