import { Component, type ErrorInfo, type ReactNode } from "react";
import { captureError } from "@/stores/errorStore";
import { reportToSentry } from "@/lib/sentryAdapter";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AsyncErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[AsyncErrorBoundary]", error, info.componentStack);
    captureError({
      severity: "error",
      message: error.message,
      source: "AsyncErrorBoundary",
      stack: error.stack,
      componentStack: info.componentStack ?? undefined,
    });
    reportToSentry(error, { componentStack: info.componentStack });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    const message =
      (this.state.error as unknown as { message?: string })?.message ??
      "Error al comunicarse con el servidor. Intenta de nuevo.";

    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 max-w-md">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Error de comunicación con la API
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{message}</p>
          <button
            onClick={this.handleReset}
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
}
