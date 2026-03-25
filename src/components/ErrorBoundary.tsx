import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-center p-6" dir="rtl">
          <h1 className="text-6xl font-amiri font-black gold-text mb-6">عذراً، حدث خطأ ملكي</h1>
          <p className="text-slate-400 text-xl mb-12 max-w-lg">
            لقد واجهنا مشكلة تقنية غير متوقعة في الخزانة الملكية. يرجى إعادة تحميل الصفحة أو العودة للرئيسية.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="gold-button px-12 py-4 rounded-2xl font-black text-xl shadow-2xl"
          >
            العودة للرئيسية 👑
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
