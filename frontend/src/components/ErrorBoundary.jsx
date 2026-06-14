import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 shadow-lg max-w-md">
            <h1 className="text-xl font-bold text-[#1e293b] mb-2">Something went wrong</h1>
            <p className="text-[#64748b] mb-4">An unexpected error occurred. Please try refreshing the page.</p>
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4 font-mono break-all">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
