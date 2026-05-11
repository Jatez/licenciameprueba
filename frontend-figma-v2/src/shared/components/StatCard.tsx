interface StatCardProps {
  value: number;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="bg-surface border border-lm-gray-200 rounded-lg p-4">
      <p className="text-2xl font-bold text-lm-gray-900">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
