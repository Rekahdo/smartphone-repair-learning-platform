import { useState, useMemo, useEffect, useRef } from "react";
import { levels, tools, certificates } from "../data/curriculum";
import { useApp, useDerivedStats } from "../state/AppContext";
import { Button, Card, StatCard, ProgressBar, Badge, SectionTitle } from "./ui";
import { downloadCurriculumPDF, downloadCertificatePDF, downloadProgressReport } from "../utils/pdf";
import {
  DeviceExplorer,
  WorkflowSimulator,
  DiagnosticEngine,
  MultimeterSimulator,
  ComponentGame,
  SchematicReader,
  RepairChecklist,
} from "./Simulators";

// ============================================================
// DASHBOARD
// ============================================================
export function Dashboard({ onNavigate }: { onNavigate: (page: string, levelId?: string) => void }) {
  const totalLessons = useMemo(() => levels.reduce((a, l) => a + l.modules.reduce((b, m) => b + m.lessons.length, 0), 0), []);
  const stats = useDerivedStats(totalLessons, tools.length);
  const { progress, xp, streak, repairsCompleted, diagnosticsSolved, tools: toolState } = useApp();

  const lessonNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    levels.forEach((l) => l.modules.forEach((m) => m.lessons.forEach((ls) => { map[ls.id] = ls.title; })));
    return map;
  }, []);

  const recentLessons = Object.entries(progress)
    .filter(([, v]) => v.completed)
    .slice(-5)
    .reverse();

  const summary = {
    name: "Student Technician",
    date: new Date().toLocaleDateString(),
    xp,
    streak,
    repairs: repairsCompleted,
    diagnostics: diagnosticsSolved,
    completed: stats.completed,
    totalLessons,
    toolsMastered: stats.mastered,
    currentLevel: stats.level,
    progress,
    toolState,
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-900/40 via-navy-900 to-indigo-900/40 p-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative">
          <Badge color="bg-sky-500/15 text-sky-300 border-sky-500/30">Welcome back, Technician 👋</Badge>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-white">RepairMaster Academy</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Transform from complete beginner to advanced board-level smartphone repair technician. Your journey is tracked automatically — resume where you left off.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => onNavigate("learning")}>Continue Learning →</Button>
            <Button variant="secondary" onClick={() => onNavigate("practice")}>Open Practice Lab</Button>
            <Button variant="secondary" onClick={() => downloadCurriculumPDF()}>⬇ Download Curriculum PDF</Button>
            <Button variant="secondary" onClick={() => downloadProgressReport(summary)}>📄 Progress Report PDF</Button>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: "learning", label: "Learning Path", icon: "📚", accent: "from-sky-500 to-blue-600" },
            { id: "practice", label: "Practice Lab", icon: "🧪", accent: "from-emerald-500 to-teal-600" },
            { id: "diagnostics", label: "Diagnostics", icon: "🔍", accent: "from-indigo-500 to-violet-600" },
            { id: "tools", label: "Tool Bench", icon: "🧰", accent: "from-fuchsia-500 to-pink-600" },
            { id: "schematics", label: "Schematics", icon: "📐", accent: "from-amber-500 to-orange-600" },
            { id: "certificates", label: "Certificates", icon: "🏆", accent: "from-rose-500 to-red-600" },
          ].map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onNavigate(q.id)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center transition hover:border-sky-400/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className={`absolute -right-5 -top-5 h-16 w-16 rounded-full bg-gradient-to-br ${q.accent} opacity-20 blur-2xl transition group-hover:opacity-40`} />
              <div className="text-2xl">{q.icon}</div>
              <div className="mt-2 text-xs font-semibold text-slate-200">{q.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard onClick={() => onNavigate("learning")} label="Current Level" value={`L${stats.level}`} icon="🎯" accent="from-sky-500 to-blue-600" sub={levels[stats.level - 1]?.title.split("—")[1]?.trim() ?? "Foundation"} />
        <StatCard onClick={() => onNavigate("learning")} label="Overall Progress" value={`${stats.pct}%`} icon="📊" accent="from-emerald-500 to-teal-600" sub={`${stats.completed} lessons`} />
        <StatCard onClick={() => onNavigate("profile")} label="Current Streak" value={`${stats.streak}d`} icon="🔥" accent="from-amber-500 to-orange-600" sub="Keep it going!" />
        <StatCard onClick={() => onNavigate("tools")} label="Tools Mastered" value={`${stats.mastered}/${tools.length}`} icon="🧰" accent="from-fuchsia-500 to-pink-600" sub={`${stats.toolsPct}%`} />
        <StatCard onClick={() => onNavigate("diagnostics")} label="Repairs Logged" value={stats.repairsCompleted} icon="🔧" accent="from-indigo-500 to-violet-600" sub={`${stats.diagnosticsSolved} diagnostics`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <SectionTitle eyebrow="Learning Path" title="Your Progression" description="Each level unlocks new modules. Complete lessons to earn XP and advance." />
          <div className="space-y-4">
            {levels.map((lvl, i) => {
              const totalL = lvl.modules.reduce((a, m) => a + m.lessons.length, 0);
              const doneL = lvl.modules.reduce(
                (a, m) => a + m.lessons.filter((ls) => progress[ls.id]?.completed).length,
                0,
              );
              const pct = Math.round((doneL / totalL) * 100);
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onNavigate("learning", lvl.id)}
                  className="block w-full text-left rounded-2xl border border-white/10 bg-white/5 p-4 transition cursor-pointer hover:border-sky-400/40 hover:bg-white/[0.08] active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${lvl.color} text-2xl`}>{lvl.badge}</div>
                    <div className="flex-1">
                      <div className="font-bold text-white">{lvl.title}</div>
                      <div className="text-xs text-slate-400">{lvl.tagline}</div>
                    </div>
                    <Badge color="bg-white/10 text-slate-200 border-white/20">{doneL}/{totalL} lessons · {pct}%</Badge>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={pct} color={i === 0 ? "bg-sky-500" : i === 1 ? "bg-violet-500" : "bg-amber-500"} />
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle eyebrow="Activity" title="Recent XP" description="Earn XP by completing lessons, quizzes & simulations." />
          <div className="space-y-3">
            <div className="text-center py-6 rounded-2xl border border-sky-500/30 bg-sky-500/5">
              <div className="text-xs uppercase tracking-wider text-sky-400">Total XP Earned</div>
              <div className="mt-2 text-5xl font-bold text-white">{stats.xp.toLocaleString()}</div>
              <div className="mt-2 text-sm text-slate-400">Level {Math.floor(stats.xp / 500) + 1} Technician</div>
            </div>
            {recentLessons.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No lessons completed yet. Start your journey!</p>
            ) : (
              recentLessons.map(([id, v]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate("learning")}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-left transition hover:border-sky-400/40 hover:bg-white/[0.08]"
                >
                  <span className="text-slate-200 truncate">{lessonNameMap[id] ?? id}</span>
                  <Badge color="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">{v.score}%</Badge>
                </button>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <SectionTitle eyebrow="Roadmap" title="Recommended Learning Timeline" description="Follow this realistic progression plan to become a job-ready repair technician." />
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { stage: "Stage 1", period: "0–30 Days", goal: "Comfortable opening & assembling phones.", color: "from-sky-500 to-blue-600", icon: "🌱" },
            { stage: "Stage 2", period: "1–3 Months", goal: "Master software repairs & flashing.", color: "from-indigo-500 to-violet-600", icon: "💻" },
            { stage: "Stage 3", period: "3–6 Months", goal: "Competent hardware repair technician.", color: "from-emerald-500 to-teal-600", icon: "🔧" },
            { stage: "Stage 4", period: "6–12 Months", goal: "Board-level diagnosis & schematics.", color: "from-amber-500 to-orange-600", icon: "📐" },
            { stage: "Stage 5", period: "12–24 Months", goal: "Advanced micro-soldering technician.", color: "from-rose-500 to-pink-600", icon: "🏆" },
          ].map((s) => (
            <button
              key={s.stage}
              type="button"
              onClick={() => onNavigate("learning")}
              className="text-left rounded-2xl border border-white/10 bg-white/5 p-4 relative overflow-hidden transition cursor-pointer hover:border-sky-400/40 hover:bg-white/[0.08] hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl`} />
              <div className="text-3xl">{s.icon}</div>
              <div className="mt-2 text-xs uppercase tracking-wider text-slate-400">{s.stage} · {s.period}</div>
              <p className="mt-1 text-sm text-white font-semibold">{s.goal}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// LEARNING PATH
// ============================================================
export function LearningPath({
  focusLevel = null,
  onFocusHandled,
}: {
  focusLevel?: string | null;
  onFocusHandled?: () => void;
} = {}) {
  const [activeLesson, setActiveLesson] = useState<{ level: string; module: string; lesson: string } | null>(null);
  const [highlightLevel, setHighlightLevel] = useState<string | null>(null);
  const { progress, markLesson, addXP } = useApp();
  const levelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (focusLevel) {
      // Make sure we're in the curriculum list view, not a lesson detail view
      setActiveLesson(null);
      setHighlightLevel(focusLevel);
      const node = levelRefs.current[focusLevel];
      if (node) {
        // Defer to allow layout to settle before scrolling
        requestAnimationFrame(() => {
          node.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      const timer = setTimeout(() => {
        setHighlightLevel(null);
        onFocusHandled?.();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [focusLevel, onFocusHandled]);

  const active = activeLesson
    ? levels
        .find((l) => l.id === activeLesson.level)
        ?.modules.find((m) => m.id === activeLesson.module)
        ?.lessons.find((ls) => ls.id === activeLesson.lesson)
    : null;

  const activeModule = activeLesson
    ? levels.find((l) => l.id === activeLesson.level)?.modules.find((m) => m.id === activeLesson.module)
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionTitle eyebrow="Curriculum" title="Complete Learning Path" description="3 levels, 12 modules, 70+ lessons. Click any lesson to open it." />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => downloadCurriculumPDF()}>⬇ Full Curriculum PDF</Button>
        </div>
      </div>

      {activeLesson && active ? (
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Badge color="bg-sky-500/15 text-sky-300 border-sky-500/30">
                {activeModule?.title} · {active.type.toUpperCase()}
              </Badge>
              <h2 className="mt-2 text-2xl font-bold text-white">{active.title}</h2>
              <p className="mt-2 text-slate-400 max-w-2xl">{active.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                <span>⏱ {active.duration}</span>
                <span>·</span>
                <span>⭐ +{active.xp} XP</span>
                {progress[active.id]?.completed && <span>·</span>}
                {progress[active.id]?.completed && <span className="text-emerald-400">✓ Completed ({progress[active.id].score}%)</span>}
              </div>
            </div>
            <Button variant="ghost" onClick={() => setActiveLesson(null)}>← Back to curriculum</Button>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-wider text-slate-400">Lesson Video</div>
              <div className="mt-3 aspect-video rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl">▶</div>
                  <div className="mt-2 text-sm text-slate-400">HD Training Video</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-2">
              <div className="text-xs uppercase tracking-wider text-slate-400">Key Concepts</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li className="flex gap-2"><span className="text-sky-400">•</span> Understand the theory and safety background.</li>
                <li className="flex gap-2"><span className="text-sky-400">•</span> Watch the instructor demonstrate the correct procedure.</li>
                <li className="flex gap-2"><span className="text-sky-400">•</span> Practice on a real device in your lab.</li>
                <li className="flex gap-2"><span className="text-sky-400">•</span> Complete the quiz to lock in your knowledge.</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  variant="success"
                  onClick={() => {
                    markLesson(active.id, 100);
                    addXP(active.xp);
                  }}
                >
                  ✓ Mark Complete (+{active.xp} XP)
                </Button>
                <Button variant="secondary" onClick={() => setActiveLesson(null)}>Continue browsing</Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {levels.map((lvl) => (
            <div
              key={lvl.id}
              ref={(el) => { levelRefs.current[lvl.id] = el; }}
              className={`scroll-mt-24 rounded-3xl transition-all duration-500 ${
                highlightLevel === lvl.id
                  ? "ring-2 ring-sky-400/70 bg-sky-500/[0.06] shadow-lg shadow-sky-500/10 p-4 -m-4"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${lvl.color} text-2xl`}>{lvl.badge}</div>
                <div>
                  <h2 className="text-xl font-bold text-white">{lvl.title}</h2>
                  <p className="text-sm text-slate-400">{lvl.tagline}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {lvl.modules.map((m) => (
                  <Card key={m.id} className="p-5 hover:border-white/20 transition">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{m.icon}</div>
                      <div className="flex-1">
                        <div className="font-bold text-white">{m.title}</div>
                        <div className="text-xs text-slate-400">{m.subtitle}</div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1">
                      {m.lessons.map((ls) => {
                        const done = progress[ls.id]?.completed;
                        return (
                          <button
                            key={ls.id}
                            onClick={() => setActiveLesson({ level: lvl.id, module: m.id, lesson: ls.id })}
                            className="flex w-full items-center justify-between rounded-lg border border-transparent px-2 py-1.5 text-left text-sm hover:border-white/10 hover:bg-white/5"
                          >
                            <span className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${done ? "bg-emerald-400" : "bg-slate-600"}`} />
                              <span className={done ? "text-slate-400 line-through" : "text-slate-200"}>{ls.title}</span>
                            </span>
                            <span className="text-xs text-slate-500">+{ls.xp}</span>
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PRACTICE LAB
// ============================================================
export function PracticeLab() {
  return (
    <div className="space-y-8">
      <SectionTitle eyebrow="Hands-On" title="Practice Lab" description="Interactive simulators to build muscle memory before touching real hardware." />
      <DeviceExplorer />
      <WorkflowSimulator />
      <RepairChecklist />
      <MultimeterSimulator />
      <ComponentGame />
      <SchematicReader />
    </div>
  );
}

// ============================================================
// DIAGNOSTICS
// ============================================================
export function DiagnosticsPage() {
  return (
    <div className="space-y-8">
      <SectionTitle eyebrow="Troubleshooting" title="Diagnostic Engine" description="Real technician flowcharts for common phone faults. Answer YES/NO to isolate the problem." />
      <DiagnosticEngine />
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-3">🩺 Common Fault Categories</h3>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { name: "No Power", icon: "🔋", symptoms: "Dead phone, no vibration, no heat." },
            { name: "No Charging", icon: "⚡", symptoms: "Plugged in but 0% current." },
            { name: "Boot Loop", icon: "🔄", symptoms: "Restarts at logo, never boots." },
            { name: "No Network", icon: "📡", symptoms: "No IMEI, no bars, emergency calls only." },
            { name: "No Sound", icon: "🔇", symptoms: "Speaker dead, no ringtone." },
            { name: "Camera Failure", icon: "📷", symptoms: "Black screen, can't connect." },
            { name: "Touch Failure", icon: "👆", symptoms: "Dead touch, ghost touches." },
            { name: "No Display", icon: "📺", symptoms: "Black screen, phone vibrates." },
          ].map((f) => (
            <div key={f.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl">{f.icon}</div>
              <div className="mt-2 font-bold text-white">{f.name}</div>
              <div className="text-xs text-slate-400 mt-1">{f.symptoms}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// TOOL BENCH
// ============================================================
export function ToolBench() {
  const { tools: toolState, toggleTool } = useApp();
  const masteredCount = Object.values(toolState).filter((t) => t.mastered).length;

  return (
    <div className="space-y-8">
      <SectionTitle eyebrow="Equipment" title="Tool Bench Checklist" description={`Track which tools you own, have practiced with, and have mastered. ${masteredCount}/${tools.length} mastered.`} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((t) => {
          const state = toolState[t.id] ?? { owned: false, practiced: false, mastered: false };
          return (
            <Card key={t.id} className="p-5 hover:border-white/20 transition">
              <div className="flex items-start gap-3">
                <div className="text-4xl">{t.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{t.purpose}</div>
                  <div className="mt-2">
                    <ProgressBar value={t.difficulty * 20} color="bg-amber-500" />
                    <div className="text-[10px] text-slate-500 mt-1">Difficulty {t.difficulty}/5</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                {([
                  { key: "owned", label: "Purchased", color: "sky" },
                  { key: "practiced", label: "Practiced", color: "amber" },
                  { key: "mastered", label: "Mastered", color: "emerald" },
                ] as const).map((row) => {
                  const on = state[row.key];
                  return (
                    <button
                      key={row.key}
                      onClick={() => toggleTool(t.id, row.key)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-1.5 text-xs transition ${
                        on
                          ? `border-${row.color}-500/40 bg-${row.color}-500/10 text-${row.color}-300`
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/30"
                      }`}
                      style={
                        on
                          ? {
                              borderColor:
                                row.color === "sky" ? "rgba(56,189,248,0.4)" : row.color === "amber" ? "rgba(251,191,36,0.4)" : "rgba(16,185,129,0.4)",
                              backgroundColor:
                                row.color === "sky" ? "rgba(56,189,248,0.1)" : row.color === "amber" ? "rgba(251,191,36,0.1)" : "rgba(16,185,129,0.1)",
                              color: row.color === "sky" ? "#7dd3fc" : row.color === "amber" ? "#fcd34d" : "#6ee7b7",
                            }
                          : undefined
                      }
                    >
                      <span>{row.label}</span>
                      <span>{on ? "✓" : "○"}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// SCHEMATICS
// ============================================================
export function SchematicsPage() {
  return (
    <div className="space-y-8">
      <SectionTitle eyebrow="Board-Level" title="Schematics & Board View" description="Learn to read phone schematics, locate power rails, and trace signal lines." />
      <SchematicReader />
      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-3">📚 Schematic Reference</h3>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 text-sm">
          {[
            { rail: "PP_BATT_VCC", desc: "Direct battery voltage (3.7–4.4V)" },
            { rail: "PP_VCC_MAIN", desc: "Main system rail after PMIC (often ~4V)" },
            { rail: "PP1V8", desc: "1.8V auxiliary rail for logic" },
            { rail: "PP3V0", desc: "3.0V rail for storage & sensors" },
            { rail: "PP_LCM_BL", desc: "Backlight boost (12–24V)" },
            { rail: "GND", desc: "Ground reference plane" },
          ].map((r) => (
            <div key={r.rail} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="font-mono font-bold text-sky-300">{r.rail}</div>
              <div className="text-xs text-slate-400 mt-1">{r.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// CERTIFICATES
// ============================================================
export function CertificatesPage() {
  const { xp, streak, repairsCompleted, diagnosticsSolved, progress, tools: toolState } = useApp();
  const totalLessons = useMemo(() => levels.reduce((a, l) => a + l.modules.reduce((b, m) => b + m.lessons.length, 0), 0), []);
  const stats = useDerivedStats(totalLessons, tools.length);
  const completed = Object.values(progress).filter((p) => p.completed).length;

  const summary = {
    name: "Student Technician",
    date: new Date().toLocaleDateString(),
    xp,
    streak,
    repairs: repairsCompleted,
    diagnostics: diagnosticsSolved,
    completed: stats.completed,
    totalLessons,
    toolsMastered: stats.mastered,
    currentLevel: stats.level,
    progress,
    toolState,
  };

  return (
    <div className="space-y-8">
      <SectionTitle eyebrow="Achievements" title="Certifications" description="Earn industry-recognized certificates by completing each level with ≥80% score. Download your certificate as PDF." />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {certificates.map((c, i) => {
          const unlocked = completed >= (i + 1) * 8;
          return (
            <Card key={c.id} className={`p-6 relative overflow-hidden ${unlocked ? "" : "opacity-60"}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-10`} />
              <div className="relative">
                <div className="text-5xl">{c.icon}</div>
                <div className="mt-3 text-xs uppercase tracking-wider text-slate-400">Certificate</div>
                <div className="mt-1 text-xl font-bold text-white">{c.name}</div>
                <div className="mt-2 text-sm text-slate-400">{c.requirement}</div>
                <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs text-slate-400">Awarded to</div>
                  <div className="font-bold text-white mt-1">Student Technician</div>
                  <div className="text-xs text-slate-400 mt-2">Date: {new Date().toLocaleDateString()}</div>
                  <div className="text-xs text-slate-400">XP: {xp.toLocaleString()}</div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
                  {unlocked ? (
                    <Badge color="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">✓ Unlocked</Badge>
                  ) : (
                    <Badge color="bg-white/10 text-slate-300 border-white/20">🔒 Locked</Badge>
                  )}
                  <Button
                    variant="secondary"
                    className="!px-3 !py-1.5 !text-xs"
                    onClick={() => downloadCertificatePDF(c.name, summary)}
                  >
                    ⬇ PDF
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-3">🏅 Skill Badges</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { icon: "🔋", name: "Battery Pro" },
            { icon: "📺", name: "Screen Master" },
            { icon: "🔌", name: "Charging Fixer" },
            { icon: "💻", name: "Flash Expert" },
            { icon: "⚡", name: "Multimeter" },
            { icon: "🔬", name: "Microscope" },
            { icon: "🔥", name: "Soldering" },
            { icon: "📐", name: "Schematics" },
            { icon: "🧠", name: "Diagnostics" },
            { icon: "🧰", name: "Tool Master" },
            { icon: "🎯", name: "Precision" },
            { icon: "🏆", name: "Grand Master" },
          ].map((b) => (
            <div key={b.name} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-3xl">{b.icon}</div>
              <div className="mt-2 text-xs font-semibold text-white">{b.name}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// PROFILE
// ============================================================
export function ProfilePage() {
  const { resetAll, xp, repairsCompleted, diagnosticsSolved, streak } = useApp();
  const totalLessons = useMemo(() => levels.reduce((a, l) => a + l.modules.reduce((b, m) => b + m.lessons.length, 0), 0), []);
  const stats = useDerivedStats(totalLessons, tools.length);
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="space-y-8">
      <SectionTitle eyebrow="Account" title="Technician Profile" description="Your complete learning profile and progress history." />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-5xl">
            🛠️
          </div>
          <h2 className="mt-4 text-xl font-bold text-white">Student Technician</h2>
          <p className="text-sm text-slate-400">Level {Math.floor(xp / 500) + 1} · RepairMaster Academy</p>
          <div className="mt-5 flex justify-center gap-2">
            <Badge color="bg-sky-500/15 text-sky-300 border-sky-500/30">🎓 Student</Badge>
            <Badge color="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">🔥 {streak} day streak</Badge>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4">Career Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Total XP", value: xp.toLocaleString(), icon: "⭐" },
              { label: "Lessons Completed", value: `${stats.completed} / ${totalLessons}`, icon: "📚" },
              { label: "Tools Mastered", value: `${stats.mastered} / ${tools.length}`, icon: "🧰" },
              { label: "Repairs Logged", value: repairsCompleted, icon: "🔧" },
              { label: "Diagnostics Solved", value: diagnosticsSolved, icon: "🩺" },
              { label: "Current Streak", value: `${streak} days`, icon: "🔥" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl">{s.icon}</div>
                <div className="mt-2 text-xs uppercase tracking-wider text-slate-400">{s.label}</div>
                <div className="mt-1 text-xl font-bold text-white">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
            <h4 className="font-bold text-white">Reset Progress</h4>
            <p className="text-sm text-slate-400 mt-1">Start fresh — this clears all lessons, tools, and XP.</p>
            <div className="mt-3 flex items-center gap-3">
              {!confirm ? (
                <Button variant="danger" onClick={() => setConfirm(true)}>Reset All Progress</Button>
              ) : (
                <>
                  <Button variant="danger" onClick={() => { resetAll(); setConfirm(false); }}>Confirm Reset — Are you sure?</Button>
                  <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-white mb-3">💡 Recommended Practice Devices</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-wider text-sky-400">Beginner</div>
            <div className="mt-2 font-bold text-white">Start with these</div>
            <ul className="mt-2 text-sm text-slate-300 space-y-1">
              <li>• Tecno Spark / Camon series</li>
              <li>• Infinix Hot / Note series</li>
              <li>• Samsung A0x / A1x series</li>
              <li>• Xiaomi Redmi 9 / 10 / 12 series</li>
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-wider text-amber-400">Advanced</div>
            <div className="mt-2 font-bold text-white">Once you're confident</div>
            <ul className="mt-2 text-sm text-slate-300 space-y-1">
              <li>• Samsung S20 / S21 / S22 series</li>
              <li>• iPhone 11 / 12 / 13 / 14 / 15 series</li>
              <li>• Google Pixel 6 / 7 / 8 series</li>
              <li>• OnePlus / Huawei flagships</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
