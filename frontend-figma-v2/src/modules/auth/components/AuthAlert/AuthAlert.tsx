import { AlertCircle, Info, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type AuthAlertProps = {
  tone?: "error" | "warning" | "info";
  title?: string;
  description: string;
  className?: string;
};

const ICONS = {
  error: AlertCircle,
  warning: ShieldAlert,
  info: Info,
} as const;

export function AuthAlert({ tone = "error", title, description, className }: AuthAlertProps) {
  const Icon = ICONS[tone];
  const variant = tone === "error" ? "destructive" : "default";
  return (
    <Alert
      variant={variant}
      className={cn(
        tone === "warning" && "border-warning/40 text-warning [&>svg]:text-warning",
        tone === "info" && "border-foreground/20 text-foreground [&>svg]:text-foreground",
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
