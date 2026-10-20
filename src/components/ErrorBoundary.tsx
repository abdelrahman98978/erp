import React from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  resetKey?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  domRetryCount: number;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, domRetryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        domRetryCount: 0,
      });
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Self-heal once from transient DOM reconciliation errors (e.g. browser extensions or external DOM mutations)
    const isTransientDomError =
      error.name === 'NotFoundError' ||
      error.message?.includes('removeChild') ||
      error.message?.includes('insertBefore');

    if (isTransientDomError && this.state.domRetryCount < 2) {
      this.setState((prev) => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        domRetryCount: prev.domRetryCount + 1,
      }));
      return;
    }

    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Auto-recover from stale chunks after a new deployment
    const isChunkError =
      error.message?.includes('dynamically imported module') ||
      error.message?.includes('Expected a JavaScript-or-Wasm module script') ||
      error.message?.includes('Loading chunk') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      const reloadKey = 'erp_auto_chunk_reload';
      const lastReload = sessionStorage.getItem(reloadKey);
      if (!lastReload || Date.now() - Number(lastReload) > 10000) {
        sessionStorage.setItem(reloadKey, String(Date.now()));
        window.location.reload();
        return;
      }
    }

    try {
      Sentry.captureException(error, {
        extra: {
          componentStack: errorInfo.componentStack,
        },
      });
    } catch (sentryErr) {
      console.warn('Sentry report failed silently:', sentryErr);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      domRetryCount: 0,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          aria-live="assertive"
          dir="rtl"
          className="min-h-[70vh] flex items-center justify-center p-6 bg-[#FBFBF5] font-sans"
        >
          <div className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#CFA64A]/60 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1D2428] border border-[#CFA64A] text-[#CFA64A] flex items-center justify-center mx-auto mb-5 shadow-md">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-black text-[#1D2428] mb-2">
              تنبيه استعادة جلسة العرض المؤسسية
            </h2>

            <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
              حدث تحديث طارئ أثناء عرض هذا القسم. يمكنك استعادة الشاشة فوراً بنقرة واحدة مع الاحتفاظ بكافة بياناتك وسجلاتك المحفوظة.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="text-right p-3.5 rounded-xl bg-zinc-100 border border-zinc-200 mb-5 text-xs font-mono text-zinc-700">
                <summary className="cursor-pointer font-bold mb-2">
                  تفاصيل الخطأ التشخيصية (وضع التطوير)
                </summary>
                <pre className="m-0 whitespace-pre-wrap overflow-x-auto text-left" dir="ltr">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack ?? ''}
                </pre>
              </details>
            )}

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="h-11 px-6 rounded-xl border border-[#CFA64A] bg-[#1D2428] hover:bg-[#273136] text-[#CFA64A] text-sm font-black inline-flex items-center gap-2 cursor-pointer transition-all shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>استعادة الشاشة فوراً</span>
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="h-11 px-6 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-[#1D2428] text-sm font-bold inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>تحديث الصفحة بالكامل</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return <React.Fragment key={this.state.domRetryCount}>{this.props.children}</React.Fragment>;
  }
}

export default ErrorBoundary;
