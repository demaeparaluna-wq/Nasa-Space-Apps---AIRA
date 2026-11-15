import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  handleReload = () => {
    try {
      this.setState({ hasError: false });
    } catch {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const isPt =
        typeof document !== 'undefined' &&
        document.documentElement.lang.toLowerCase().startsWith('pt');

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1221] px-6 text-center text-white">
          <div className="w-full max-w-md rounded-2xl border border-orange-500/40 bg-[#10182E] p-6 shadow-2xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
              {isPt ? 'Telemetria em Recuperação' : 'Telemetry Recovery'}
            </p>
            <h1 className="text-xl font-extrabold">
              {isPt
                ? 'Ops! A nave encontrou uma turbulência.'
                : 'Oops! The ship hit a minor glitch.'}
            </h1>
            <p className="text-xs leading-relaxed text-slate-300">
              {isPt
                ? 'Sem problemas — clique abaixo para reiniciar os painéis da Base Ares com segurança.'
                : 'No worries — click below to safely reload the Ares Base control panels.'}
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-slate-950 hover:bg-orange-400"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{isPt ? 'Reiniciar Missão' : 'Reload Mission'}</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
