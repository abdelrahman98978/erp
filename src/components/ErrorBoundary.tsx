import React from 'react';
import * as Sentry from '@sentry/react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Auto-recover from stale chunks after a new Vercel deployment
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

    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
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
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: '#f7faf9',
            fontFamily: 'Tajawal, Cairo, sans-serif',
          }}
        >
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px 32px',
            boxShadow: '0 12px 32px rgba(0, 56, 59, 0.08)',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#fef2f2',
              color: '#ba1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '28px',
            }}>
              <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            </div>

            <h2 style={{
              fontFamily: 'Cairo, sans-serif',
              fontSize: '24px',
              fontWeight: 800,
              color: '#181c1c',
              margin: '0 0 12px 0',
            }}>
              حدث خطأ غير متوقع
            </h2>

            <p style={{
              fontSize: '14.5px',
              color: '#3f4849',
              margin: '0 0 24px 0',
              lineHeight: 1.7,
            }}>
              نأسف للإزعاج. حدث خطأ أثناء تحميل هذه الصفحة. يمكنك محاولة استعادة الصفحة أو إعادة تحميل التطبيق بالكامل.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details style={{
                textAlign: 'start',
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#f1f4f3',
                marginBottom: '20px',
                fontSize: '12.5px',
                fontFamily: 'monospace',
                color: '#3f4849',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 700, marginBottom: '8px' }}>
                  تفاصيل الخطأ (وضع التطوير)
                </summary>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack ?? ''}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  height: '44px',
                  padding: '0 24px',
                  borderRadius: '12px',
                  border: '1px solid #bec9c8',
                  background: '#ffffff',
                  color: '#181c1c',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                حاول مرة أخرى
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  height: '44px',
                  padding: '0 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#005154',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0, 81, 84, 0.25)',
                }}
              >
                إعادة تحميل الصفحة
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
