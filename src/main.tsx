import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from './components/Toast'
import * as Sentry from '@sentry/react'
import ErrorBoundary from './components/ErrorBoundary'

// Lower Sentry overhead for production performance
const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || "https://0bf6fb977e846f4cc83c5ae51dbec0ca@o4511084450611200.ingest.us.sentry.io/4511084731105280",
    sendDefaultPii: true,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1, // Reduced from 1.0
    replaysSessionSampleRate: 0.0, // Disabled standard replays for performance
    replaysOnErrorSampleRate: 1.0, 
  });
};

// Defer Sentry to not block initial LCP render
if (typeof window !== 'undefined') {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => initSentry());
  } else {
    setTimeout(initSentry, 2000);
  }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ToastProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
