import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback } = this.props;

    if (hasError) {
      return fallback
        ? fallback({ error, resetErrorBoundary: this.resetErrorBoundary })
        : null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
