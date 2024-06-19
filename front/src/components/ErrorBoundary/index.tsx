import React from "react";
import ErrorPage from "./ErrorPage";

interface ErrorBoundaryProps {
  children: any;
  moduleName?: string;
}

interface ErrorBoundaryState {
  error: any;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDeriverStateFromError(error: Error): ErrorBoundaryState {
    return { error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error, errorInfo });
  }

  render(): React.ReactNode {
    if (this.state.error) {
      return (
        <ErrorPage
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          moduleName={this.props.moduleName}
        />
      );
    }

    return this.props.children;
  }
}
