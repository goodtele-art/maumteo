import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { SAVE_KEY } from "@/lib/constants.ts";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("MaumTeo Error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleClearAndReset = () => {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-base text-theme-primary flex items-center justify-center p-4">
          <div className="bg-surface-disabled border border-red-800 rounded-xl p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-red-400 mb-2">오류가 발생했습니다</h1>
            <p className="text-sm text-theme-tertiary mb-4">
              {this.state.error?.message ?? "알 수 없는 오류"}
            </p>
            <div className="space-y-2">
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 bg-floor-counseling hover:bg-sky-600 text-white text-sm rounded-lg transition-colors"
              >
                다시 시도
              </button>
              <button
                onClick={this.handleClearAndReset}
                className="w-full py-2.5 bg-surface-card hover:bg-surface-card-hover text-sm rounded-lg transition-colors"
              >
                저장 데이터 초기화 후 재시작
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
