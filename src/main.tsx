import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/index.css';

// Global Safe Console Filter for Clean Console Output
if (typeof window !== 'undefined' && !(window as any).__erp_console_wrapped) {
  (window as any).__erp_console_wrapped = true;
  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);

  const IGNORED_MESSAGES = [
    'ResizeObserver loop',
    'chrome-extension',
    'moz-extension',
    'safari-extension',
    'WebSocket',
    'Download the React DevTools',
    'dummy-supabase',
    'Supabase fetch notice',
    'cross-world service worker',
    'preloaded using link preload',
    'localhost:8081',
    'loopback address space',
    'content script loaded',
  ];

  console.warn = (...args: any[]) => {
    const firstArg = typeof args[0] === 'string' ? args[0] : '';
    if (IGNORED_MESSAGES.some(msg => firstArg.includes(msg))) {
      return;
    }
    originalWarn(...args);
  };

  console.error = (...args: any[]) => {
    const firstArg = typeof args[0] === 'string' ? args[0] : '';
    if (IGNORED_MESSAGES.some(msg => firstArg.includes(msg))) {
      return;
    }
    originalError(...args);
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason.message === 'string') {
      if (IGNORED_MESSAGES.some(msg => event.reason.message.includes(msg))) {
        event.preventDefault();
      }
    }
  });

  // Auto-recover from stale chunks after new deployments
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('Vite preload chunk mismatch detected, reloading newest version...', event);
    const url = new URL(window.location.href);
    url.searchParams.set('_v', Date.now().toString());
    window.location.replace(url.toString());
  });
}

// Initialize Sentry Real-Time Error Monitoring & Performance Tracking
const sentryDsn =
  import.meta.env.VITE_SENTRY_DSN ||
  'https://b69e19d51630b496bddff0b2a6941225@o4511880996323328.ingest.de.sentry.io/4511891719127120';

if (sentryDsn) {
  try {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
      environment: import.meta.env.MODE || 'production',
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'NetworkError when attempting to fetch resource',
        'Failed to fetch',
        'Load failed',
        'Loading chunk',
        'dynamically imported module',
        'WebSocket connection',
        'ChunkLoadError',
        'The operation was aborted',
      ],
      beforeSend(event) {
        if (event.exception?.values?.some(v => v.value?.includes('WebSocket') || v.value?.includes('extension'))) {
          return null;
        }
        return event;
      },
    });
  } catch (err) {
    // Sentry initialization skipped gracefully
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
