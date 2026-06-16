import { useState } from "react";
import { AppProvider, useDerivedStats } from "./state/AppContext";
import { levels, tools } from "./data/curriculum";
import {
  Dashboard,
  LearningPath,
  PracticeLab,
  DiagnosticsPage,
  ToolBench,
  SchematicsPage,
  CertificatesPage,
  ProfilePage,
} from "./components/Pages";
import { Badge } from "./components/ui";
import { InstallBanner, InstallButton } from "./components/PWAInstaller";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "learning", label: "Learning Path", icon: "📚" },
  { id: "practice", label: "Practice Lab", icon: "🧪" },
  { id: "diagnostics", label: "Diagnostics", icon: "🔍" },
  { id: "tools", label: "Tool Bench", icon: "🧰" },
  { id: "schematics", label: "Schematics", icon: "📐" },
  { id: "certificates", label: "Certificates", icon: "🏆" },
  { id: "profile", label: "Profile", icon: "👤" },
];

function Shell() {
  const [page, setPage] = useState<string>("dashboard");
  const [focusLevel, setFocusLevel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalLessons = levels.reduce((a, l) => a + l.modules.reduce((b, m) => b + m.lessons.length, 0), 0);
  const stats = useDerivedStats(totalLessons, tools.length);

  const navigate = (target: string, levelId?: string) => {
    setPage(target);
    setFocusLevel(levelId ?? null);
    setMobileOpen(false);
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard onNavigate={navigate} />;
      case "learning": return <LearningPath focusLevel={focusLevel} onFocusHandled={() => setFocusLevel(null)} />;
      case "practice": return <PracticeLab />;
      case "diagnostics": return <DiagnosticsPage />;
      case "tools": return <ToolBench />;
      case "schematics": return <SchematicsPage />;
      case "certificates": return <CertificatesPage />;
      case "profile": return <ProfilePage />;
      default: return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Top bar (mobile) */}
      <InstallBanner />
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-950/90 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-lg">🛠️</div>
          <div>
            <div className="text-sm font-bold text-white">RepairMaster</div>
            <div className="text-[10px] text-slate-400">Academy</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <InstallButton className="!px-2.5" />
          <Badge color="bg-sky-500/15 text-sky-300 border-sky-500/30">⭐ {stats.xp}</Badge>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            mobileOpen ? "fixed inset-y-0 left-0 z-40 w-72" : "hidden"
          } lg:sticky lg:top-0 lg:z-10 lg:flex lg:h-screen lg:w-72 lg:shrink-0 flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur`}
        >
          <div className="hidden lg:flex items-center gap-3 border-b border-white/10 px-5 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-xl glow-blue">🛠️</div>
            <div>
              <div className="text-base font-bold text-white">RepairMaster</div>
              <div className="text-xs text-slate-400">Academy · Technician Training</div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
            <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Navigation</div>
            <div className="space-y-1">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => navigate(n.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    page === n.id
                      ? "bg-gradient-to-r from-sky-500/20 to-blue-600/10 text-white border border-sky-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{n.icon}</span>
                  <span>{n.label}</span>
                  {page === n.id && <span className="ml-auto h-2 w-2 rounded-full bg-sky-400" />}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-blue-600/5 p-4">
              <div className="text-xs uppercase tracking-wider text-sky-400">Quick Stats</div>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Level</span><span className="font-bold text-white">L{stats.level}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Progress</span><span className="font-bold text-white">{stats.pct}%</span></div>
                <div className="flex justify-between"><span className="text-slate-400">XP</span><span className="font-bold text-white">{stats.xp.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Streak</span><span className="font-bold text-amber-400">🔥 {stats.streak}d</span></div>
              </div>
            </div>
          </nav>

          <div className="border-t border-white/10 p-4 space-y-2">
            <InstallButton className="w-full" />
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-lg">🛠️</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">Student Tech</div>
                <div className="text-[10px] text-slate-400">Level {Math.floor(stats.xp / 500) + 1} · Auto-saved</div>
              </div>
            </div>
          </div>
        </aside>

        {mobileOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            {renderPage()}
            <footer className="mt-16 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
              RepairMaster Academy · Interactive Smartphone Repair Curriculum · Progress auto-saves locally
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

import { Component, ErrorInfo, ReactNode } from "react";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
          <div className="max-w-xl bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-rose-400">Something went wrong</h2>
            <p className="text-sm text-slate-300 mt-2">{this.state.error?.message}</p>
            <pre className="mt-4 p-4 bg-black/50 text-[10px] text-rose-300 rounded-xl overflow-x-auto">
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 hover:opacity-90 font-semibold rounded-xl text-sm"
            >
              Reload Website
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Shell />
      </AppProvider>
    </ErrorBoundary>
  );
}
