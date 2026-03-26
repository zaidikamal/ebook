import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from './components/Toast'
import { AuthProvider } from './contexts/AuthContext'
import { isFirebaseReady } from './lib/firebase'
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
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0, 
  });
};

if (typeof window !== 'undefined') {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => initSentry());
  } else {
    setTimeout(initSentry, 2000);
  }
}

const queryClient = new QueryClient();

const Root = () => {
  if (!isFirebaseReady) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center p-6" dir="rtl">
        <h1 className="text-4xl font-amiri font-black gold-text mb-6">تنبيه ملكي: إعدادات مفقودة</h1>
        <p className="text-slate-400 text-xl mb-10 max-w-lg leading-loose">
          عذراً، يبدو أن مفاتيح الاتصال بالخزانة الملكية (Firebase) لم يتم ضبطها بشكل صحيح في Vercel. 
          <br/>
          <span className="text-gold-500/80 text-sm font-bold">يرجى إضافة VITE_FIREBASE_API_KEY والمتطلبات الأخرى في إعدادات البيئة.</span>
        </p>
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="gold-button px-10 py-4 rounded-2xl font-black text-lg shadow-2xl"
          >
            إعادة المحاولة 🔄
          </button>
          <a 
            href="https://vercel.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-gold-500 transition-colors font-bold underline underline-offset-8"
          >
            فتح لوحة تحكم Vercel
          </a>
        </div>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthProvider>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </AuthProvider>
          </ToastProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
