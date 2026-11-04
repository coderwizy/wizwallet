import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('WizWallet Runtime Error caught by Boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F7F2] text-[#22251F] flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white border border-[#EAE8DF] rounded-2xl p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FCEEED] text-[#C66D65] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#22251F]">Terminal Interface Notice</h2>
              <p className="text-xs text-[#77786F] mt-1">
                A component error was safely intercepted to protect your portfolio data.
              </p>
            </div>
            {this.state.error?.message && (
              <div className="p-3 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl text-left text-xs font-mono text-[#C66D65] break-words max-h-32 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#526B56] text-white text-xs font-bold hover:bg-[#435746] transition-colors cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

