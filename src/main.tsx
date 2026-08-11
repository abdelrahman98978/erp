import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/index.css';

// Initialize Sentry Real-Time Error Monitoring & Performance Tracking
const sentryDsn =
  import.meta.env.VITE_SENTRY_DSN ||
  'https://b69e19d51630b496bddff0b2a6941225@o4511880996323328.ingest.de.sentry.io/4511891719127120';

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE || 'production',
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
