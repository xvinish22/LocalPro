// FIX: Extended `React.Component` to make `this.props` available, resolving the error "Property 'props' does not exist on type 'ErrorBoundary'".
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh', 
            padding: '2rem', 
            textAlign: 'center',
            fontFamily: 'sans-serif'
        }}>
          <h1 style={{ color: '#333', fontSize: '1.5rem' }}>Something went wrong.</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            We've been notified of the issue. Please try refreshing the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
