import { Component, type ErrorInfo, type ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro ao renderizar o site:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'Montserrat, sans-serif', color: '#10245f' }}>
          <h1 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Não foi possível carregar o site</h1>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>{this.state.error.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

// #region agent log
fetch('http://127.0.0.1:7615/ingest/e1503208-6096-42e6-82f7-77583d7d4b9e', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '92786d' },
  body: JSON.stringify({
    sessionId: '92786d',
    runId: 'post-fix',
    hypothesisId: 'G',
    location: 'main.tsx:before-render',
    message: 'main.tsx executing, about to mount React',
    data: { hasRoot: Boolean(rootElement) },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

if (!rootElement) {
  throw new Error('Elemento #root não encontrado.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
