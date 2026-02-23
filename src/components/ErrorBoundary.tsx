"use client";

import React from "react";
import { toast } from "@/components/ui/use-toast";

type Props = { children: React.ReactNode; onReset?: () => void };

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // log to console and show a non-blocking toast
    // integrate Sentry or another provider here if desired
    // eslint-disable-next-line no-console
    console.error("Uncaught error:", error, info);
    toast({ title: "An unexpected error occurred", description: error?.message || "Unknown error" });
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground">The app encountered an unexpected error.</p>
          <pre className="mt-4 text-sm whitespace-pre-wrap">{this.state.error?.message}</pre>
          <div className="mt-4 flex gap-2">
            <button className="btn" onClick={this.reset}>Try again</button>
            <button className="btn" onClick={() => location.reload()}>Reload page</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
