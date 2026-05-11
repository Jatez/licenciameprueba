import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorState } from "./ErrorState";
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

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
    captureError({
      severity: "fatal",
      message: error.message,
      source: "ErrorBoundary",
      stack: error.stack,
      componentStack: info.componentStack ?? undefined,
    });
    reportToSentry(error, { componentStack: info.componentStack });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <ErrorState
          title="Algo salió mal"
          message="Ocurrió un error inesperado. Intenta recargar la página."
          onRetry={this.handleReset}
          retryLabel="Recargar"
        />
      </div>
    );
  }
}
