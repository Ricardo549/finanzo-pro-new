import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import App from './src/App';

console.log('🚀 Index.tsx executing...');

// Error Boundary to catch render crashes
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 React Error Boundary Caught Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'white', background: '#990000', fontFamily: 'monospace', height: '100vh', overflow: 'auto' }}>
          <h1>🛑 CRITICAL APP CRASH</h1>
          <p>{this.state.error?.toString()}</p>
          <pre>{this.state.error?.stack}</pre>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: 20, fontSize: 16, cursor: 'pointer' }}>Reload App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element NOT found');
  throw new Error("Could not find root element to mount to");
}
console.log('✅ Root element found');

const root = ReactDOM.createRoot(rootElement);
console.log('🎨 Mounting App...');

try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('🏁 Render called');
} catch (e) {
  console.error("🔥 Error calling root.render:", e);
}
