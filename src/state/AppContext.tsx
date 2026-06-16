import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Progress = Record<string, { completed: boolean; score: number }>;
export type Tools = Record<string, { owned: boolean; practiced: boolean; mastered: boolean }>;

type State = {
  xp: number;
  streak: number;
  lastActive: string;
  progress: Progress;
  tools: Tools;
  repairsCompleted: number;
  diagnosticsSolved: number;
  addXP: (n: number) => void;
  markLesson: (id: string, score?: number) => void;
  toggleTool: (id: string, field: "owned" | "practiced" | "mastered") => void;
  incrementRepairs: () => void;
  incrementDiagnostics: () => void;
  resetAll: () => void;
};

const Ctx = createContext<State | null>(null);

const DEFAULT_TOOLS: Tools = {};
["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11","t12","t13","t14","t15"].forEach(id => {
  DEFAULT_TOOLS[id] = { owned: false, practiced: false, mastered: false };
});

const STORAGE_KEY = "repairmaster_state_v1";

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = loadInitial();
  const [xp, setXp] = useState<number>(initial?.xp ?? 0);
  const [streak, setStreak] = useState<number>(initial?.streak ?? 1);
  const [lastActive, setLastActive] = useState<string>(initial?.lastActive ?? new Date().toDateString());
  const [progress, setProgress] = useState<Progress>(initial?.progress ?? {});
  const [tools, setTools] = useState<Tools>(initial?.tools ?? DEFAULT_TOOLS);
  const [repairsCompleted, setRepairs] = useState<number>(initial?.repairsCompleted ?? 0);
  const [diagnosticsSolved, setDiagnostics] = useState<number>(initial?.diagnosticsSolved ?? 0);

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      setStreak(lastActive === yesterday ? streak + 1 : 1);
      setLastActive(today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const payload = { xp, streak, lastActive, progress, tools, repairsCompleted, diagnosticsSolved };
    const id = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
    }, 500);
    return () => clearTimeout(id);
  }, [xp, streak, lastActive, progress, tools, repairsCompleted, diagnosticsSolved]);

  const value: State = {
    xp,
    streak,
    lastActive,
    progress,
    tools,
    repairsCompleted,
    diagnosticsSolved,
    addXP: (n) => setXp((v) => v + n),
    markLesson: (id, score = 100) =>
      setProgress((p) => ({ ...p, [id]: { completed: true, score: Math.max(p[id]?.score ?? 0, score) } })),
    toggleTool: (id, field) =>
      setTools((t) => ({ ...t, [id]: { ...t[id], [field]: !t[id][field] } })),
    incrementRepairs: () => setRepairs((v) => v + 1),
    incrementDiagnostics: () => setDiagnostics((v) => v + 1),
    resetAll: () => {
      setXp(0);
      setStreak(1);
      setProgress({});
      setTools(DEFAULT_TOOLS);
      setRepairs(0);
      setDiagnostics(0);
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}

export function useDerivedStats(totalLessons: number, totalTools: number) {
  const { xp, progress, tools, streak, repairsCompleted, diagnosticsSolved } = useApp();
  return useMemo(() => {
    const completed = Object.values(progress).filter((p) => p.completed).length;
    const pct = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
    const mastered = Object.values(tools).filter((t) => t.mastered).length;
    const level = Math.min(3, 1 + Math.floor(pct / 34));
    return {
      completed,
      pct,
      mastered,
      toolsPct: totalTools ? Math.round((mastered / totalTools) * 100) : 0,
      level,
      xp,
      streak,
      repairsCompleted,
      diagnosticsSolved,
    };
  }, [progress, tools, xp, streak, repairsCompleted, diagnosticsSolved, totalLessons, totalTools]);
}
