import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { trackingSimulator } from "@/shared/tracking-simulator";
import { trackingStrings } from "@/modules/monitoring/tracking/strings";

export function DevSimulatorControls() {
  const [config, setConfig] = useState(() => trackingSimulator.getConfig());
  const [running, setRunning] = useState(() => trackingSimulator.isRunning());
  const t = trackingStrings.devPanel.controls;

  useEffect(() => {
    const id = window.setInterval(() => {
      setRunning(trackingSimulator.isRunning());
      setConfig(trackingSimulator.getConfig());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const handleToggle = (next: boolean) => {
    if (next) void trackingSimulator.start();
    else trackingSimulator.stop();
    setRunning(next);
  };

  const handleConfigChange = (partial: Partial<typeof config>) => {
    const merged = { ...config, ...partial };
    setConfig(merged);
    trackingSimulator.updateConfig(partial);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Label htmlFor="sim-toggle" className="text-sm">
          {t.simulatorActive}
        </Label>
        <Switch id="sim-toggle" checked={running} onCheckedChange={handleToggle} />
      </div>

      <SliderField
        label={t.intervalLabel}
        value={[config.autoDetectIntervalMs / 1000]}
        min={15}
        max={300}
        step={5}
        formatValue={(v) => t.intervalUnit.replace("{seconds}", String(v))}
        onChange={(v) => handleConfigChange({ autoDetectIntervalMs: v * 1000 })}
      />
      <SliderField
        label={t.noMatchRateLabel}
        value={[Math.round(config.forceNoMatchRate * 100)]}
        min={0}
        max={100}
        step={5}
        formatValue={(v) => t.percent.replace("{value}", String(v))}
        onChange={(v) => handleConfigChange({ forceNoMatchRate: v / 100 })}
      />
      <SliderField
        label={t.errorRateLabel}
        value={[Math.round(config.forceErrorRate * 100)]}
        min={0}
        max={50}
        step={5}
        formatValue={(v) => t.percent.replace("{value}", String(v))}
        onChange={(v) => handleConfigChange({ forceErrorRate: v / 100 })}
      />
    </div>
  );
}

interface SliderFieldProps {
  label: string;
  value: number[];
  min: number;
  max: number;
  step: number;
  formatValue: (v: number) => string;
  onChange: (v: number) => void;
}

function SliderField({ label, value, min, max, step, formatValue, onChange }: SliderFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {formatValue(value[0])}
        </span>
      </div>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}
