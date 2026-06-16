import { useState } from "react";
import { phoneComponents, components, diagnosticFlow } from "../data/curriculum";
import { Button, Card, Badge } from "./ui";
import { useApp } from "../state/AppContext";

// ============================================================
// 3D Device Explorer (Module 1)
// ============================================================
export function DeviceExplorer() {
  const [selected, setSelected] = useState(phoneComponents[0]);
  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">📱 3D Device Explorer</h3>
          <p className="text-sm text-slate-400 mb-4">Click any component to learn its function, common failures, and repair difficulty.</p>
          <div className="relative mx-auto aspect-[9/16] w-full max-w-sm rounded-[3rem] border-4 border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl overflow-hidden">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-5 w-24 rounded-full bg-black" />
            {phoneComponents.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 px-3 py-2 text-xs font-bold transition ${
                  selected.id === c.id
                    ? "border-sky-400 bg-sky-500/30 text-white scale-110 glow-blue"
                    : "border-white/20 bg-white/5 text-slate-200 hover:border-sky-400/60 hover:bg-sky-500/10"
                }`}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                <span className="text-lg">{c.icon}</span>
                <div className="mt-1">{c.name}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 lg:max-w-sm">
          <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5">
            <div className="text-5xl">{selected.icon}</div>
            <h4 className="mt-3 text-xl font-bold text-white">{selected.name}</h4>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Function</p>
                <p className="text-slate-200">{selected.function}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Common Failures</p>
                <p className="text-slate-200">{selected.common}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Repair Difficulty</p>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className={`h-2 flex-1 rounded-full ${n <= selected.difficulty ? "bg-sky-500" : "bg-white/10"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// Disassembly Workflow (drag-to-order)
// ============================================================
const STEPS = [
  { id: "s1", text: "Remove SIM tray" },
  { id: "s2", text: "Apply heat to soften adhesive" },
  { id: "s3", text: "Separate back cover / display" },
  { id: "s4", text: "Disconnect battery FIRST" },
  { id: "s5", text: "Disconnect flex cables" },
  { id: "s6", text: "Remove shielding screws & shields" },
  { id: "s7", text: "Replace target component" },
  { id: "s8", text: "Reassemble in reverse order" },
];

export function WorkflowSimulator() {
  const [order, setOrder] = useState<string[]>(() => [...STEPS].sort(() => Math.random() - 0.5).map((s) => s.id));
  const [checked, setChecked] = useState(false);
  const { addXP } = useApp();

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...order];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setOrder(next);
    setChecked(false);
  };

  const correct = order.every((id, i) => id === STEPS[i].id);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-1">🔧 Disassembly Workflow Simulator</h3>
      <p className="text-sm text-slate-400 mb-5">Arrange the steps into the correct repair order. Battery must be disconnected early!</p>
      <div className="space-y-2">
        {order.map((id, idx) => {
          const step = STEPS.find((s) => s.id === id)!;
          const isCorrect = checked && id === STEPS[idx].id;
          const isWrong = checked && id !== STEPS[idx].id;
          return (
            <div
              key={id}
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                isCorrect
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : isWrong
                  ? "border-rose-500/50 bg-rose-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-white">{idx + 1}</div>
              <div className="flex-1 text-sm text-white">{step.text}</div>
              <div className="flex gap-1">
                <Button variant="ghost" className="!px-2 !py-1" onClick={() => move(idx, -1)} disabled={idx === 0}>▲</Button>
                <Button variant="ghost" className="!px-2 !py-1" onClick={() => move(idx, 1)} disabled={idx === order.length - 1}>▼</Button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <Button onClick={() => setChecked(true)}>Check Order</Button>
        <Button variant="secondary" onClick={() => { setOrder([...STEPS].sort(() => Math.random() - 0.5).map((s) => s.id)); setChecked(false); }}>Shuffle</Button>
        {checked && correct && (
          <Badge color="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">+120 XP — Perfect! 🎉</Badge>
        )}
      </div>
      {checked && correct && (
        <p className="mt-3 text-sm text-emerald-400">Great job — you understand the correct repair sequence. Click below to log XP.</p>
      )}
      {checked && correct && (
        <div className="mt-3">
          <Button variant="success" onClick={() => addXP(120)}>Claim 120 XP</Button>
        </div>
      )}
    </Card>
  );
}

// ============================================================
// Diagnostic Flowchart (Module 6)
// ============================================================
type NodeKey = keyof typeof diagnosticFlow;
export function DiagnosticEngine() {
  const [node, setNode] = useState<NodeKey>("start");
  const [history, setHistory] = useState<NodeKey[]>(["start"]);
  const { addXP, incrementDiagnostics } = useApp();

  const current = diagnosticFlow[node] as any;
  const isResult = !!current.result;

  const go = (next: NodeKey) => {
    setNode(next);
    setHistory((h) => [...h, next]);
  };

  const reset = () => {
    setNode("start");
    setHistory(["start"]);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-1">🔍 Interactive Diagnostic Engine</h3>
      <p className="text-sm text-slate-400 mb-5">Answer YES or NO to walk through a real technician's troubleshooting flowchart.</p>

      <div className="flex flex-wrap gap-2 mb-5 text-xs">
        {history.map((_, i) => (
          <span key={i} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
            Step {i + 1}
          </span>
        ))}
      </div>

      <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6 text-center">
        {!isResult ? (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-400">Question</p>
            <p className="mt-3 text-xl font-bold text-white">{current.question}</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Button variant="success" className="sm:w-40" onClick={() => go(current.yes)}>
                ✅ YES
              </Button>
              <Button variant="danger" className="sm:w-40" onClick={() => go(current.no)}>
                ❌ NO
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Diagnosis</p>
            <p className="mt-3 text-2xl font-bold text-white">{current.result}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={reset}>Start New Diagnosis</Button>
              <Button variant="success" onClick={() => { addXP(50); incrementDiagnostics(); }}>
                Log Diagnosis (+50 XP)
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

// ============================================================
// Multimeter Simulator (Module 7)
// ============================================================
const MM_TEST_POINTS = [
  { id: "batt", name: "Battery Connector", expected: 3.85, unit: "V", mode: "V", tolerance: 0.3 },
  { id: "cap", name: "Decoupling Capacitor", expected: 1.8, unit: "V", mode: "V", tolerance: 0.2 },
  { id: "fuse", name: "PTC Fuse (continuity)", expected: 0, unit: "Ω", mode: "Ω", tolerance: 1 },
  { id: "chg", name: "Charging Line", expected: 5.0, unit: "V", mode: "V", tolerance: 0.3 },
];

export function MultimeterSimulator() {
  const [mode, setMode] = useState<"V" | "Ω" | "🔔">("V");
  const [probe, setProbe] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const { addXP } = useApp();

  const measure = (id: string) => {
    const tp = MM_TEST_POINTS.find((t) => t.id === id)!;
    setProbe(id);
    setAttempts((a) => a + 1);
    const correctMode = tp.mode === mode;
    const value = correctMode ? tp.expected + (Math.random() - 0.5) * tp.tolerance : 0;
    if (correctMode) {
      setScore((s) => s + 1);
    }
    return { value, unit: tp.unit, correctMode };
  };

  const [reading, setReading] = useState<{ value: number; unit: string; correctMode: boolean } | null>(null);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-1">⚡ Multimeter Simulator</h3>
      <p className="text-sm text-slate-400 mb-5">Select the correct mode, then click a test point to take a measurement.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Multimeter UI */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-800 to-slate-900 p-6">
          <div className="rounded-xl bg-black p-4 text-center font-mono">
            <div className="text-xs text-emerald-400">MODE: {mode}</div>
            <div className="mt-1 text-4xl font-bold text-emerald-400 tabular-nums">
              {reading ? reading.value.toFixed(2) : "0.00"} <span className="text-lg">{reading?.unit ?? "--"}</span>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Mode Dial</p>
            <div className="flex gap-2">
              {(["V", "Ω", "🔔"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setReading(null); setProbe(null); }}
                  className={`flex-1 rounded-xl border-2 py-3 text-lg font-bold transition ${
                    mode === m ? "border-sky-400 bg-sky-500/20 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex justify-between text-xs text-slate-400">
            <div>Red Probe: <span className="text-rose-400">{probe ?? "—"}</span></div>
            <div>Black Probe: <span className="text-slate-300">GND</span></div>
          </div>
        </div>

        {/* Test points */}
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Circuit Board — Test Points</p>
          <div className="grid grid-cols-2 gap-3">
            {MM_TEST_POINTS.map((tp) => (
              <button
                key={tp.id}
                onClick={() => {
                  const r = measure(tp.id);
                  setReading(r);
                }}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  probe === tp.id ? "border-sky-400 bg-sky-500/10" : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <div className="text-xs text-slate-400">TP{tp.id.toUpperCase()}</div>
                <div className="mt-1 font-bold text-white">{tp.name}</div>
                <div className="mt-2 text-xs text-slate-400">Expected: ~{tp.expected} {tp.unit} (use {tp.mode} mode)</div>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Score</span>
              <span className="font-bold text-white">{score} / {attempts || 0}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-slate-400">Accuracy</span>
              <span className="font-bold text-emerald-400">{attempts ? Math.round((score / attempts) * 100) : 0}%</span>
            </div>
            {attempts >= 4 && score / attempts >= 0.75 && (
              <div className="mt-4">
                <Button variant="success" onClick={() => addXP(100)}>Claim +100 XP</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// Component Identification Game (Module 9)
// ============================================================
export function ComponentGame() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const { addXP } = useApp();

  const current = components[idx % components.length];
  const options = [...components].sort(() => Math.random() - 0.5).slice(0, 4);
  if (!options.find((o) => o.id === current.id)) options[0] = current;

  const pick = (id: string) => {
    if (answered) return;
    setSelected(id);
    setAnswered(true);
    if (id === current.id) setScore((s) => s + 1);
  };

  const next = () => {
    setIdx((i) => i + 1);
    setAnswered(false);
    setSelected(null);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-1">🔬 Component Identification Game</h3>
      <p className="text-sm text-slate-400 mb-5">Look at the component symbol and choose its correct name.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className={`rounded-2xl border-2 p-8 text-center ${current.color}`}>
          <div className="text-7xl font-mono font-bold text-white">{current.symbol}</div>
          <div className="mt-4 text-xs uppercase tracking-wider text-slate-300">SMD Package on Logic Board</div>
          <div className="mt-6 text-sm text-slate-200 italic">"{current.function}"</div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">Which component is this?</p>
          <div className="space-y-2">
            {options.sort(() => Math.random() - 0.5).map((opt) => {
              const isCorrect = opt.id === current.id;
              const isPicked = selected === opt.id;
              let cls = "border-white/10 bg-white/5 hover:border-white/30";
              if (answered) {
                if (isCorrect) cls = "border-emerald-500/50 bg-emerald-500/10";
                else if (isPicked) cls = "border-rose-500/50 bg-rose-500/10";
                else cls = "border-white/10 bg-white/5 opacity-60";
              }
              return (
                <button key={opt.id} onClick={() => pick(opt.id)} className={`w-full rounded-xl border-2 p-3 text-left transition ${cls}`}>
                  <div className="font-bold text-white">{opt.name}</div>
                  <div className="text-xs text-slate-400">{opt.function}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
            <div>
              <div className="text-xs text-slate-400">Score</div>
              <div className="text-xl font-bold text-white">{score} / {idx + (answered ? 1 : 0)}</div>
            </div>
            {answered && <Button onClick={next}>Next Component →</Button>}
          </div>

          {score >= 5 && (
            <div className="mt-4">
              <Button variant="success" onClick={() => addXP(150)}>Claim +150 XP (5 correct!)</Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// Schematic Reader (Module 10)
// ============================================================
const SCHEMATIC_TASKS = [
  { id: "sch1", label: "Locate PP_BATT_VCC", hint: "Main battery voltage rail — usually near battery connector.", color: "bg-rose-500" },
  { id: "sch2", label: "Locate Charging IC (U2)", hint: "Manages battery charging — look near USB connector.", color: "bg-amber-500" },
  { id: "sch3", label: "Trace Power Path", hint: "Battery → Fuse → PMIC → Main rails.", color: "bg-emerald-500" },
  { id: "sch4", label: "Find Backlight Driver", hint: "Generates high voltage for display backlight.", color: "bg-sky-500" },
];

export function SchematicReader() {
  const [found, setFound] = useState<Record<string, boolean>>({});
  const { addXP } = useApp();
  const foundCount = Object.values(found).filter(Boolean).length;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-1">📐 Schematic Reading Practice</h3>
      <p className="text-sm text-slate-400 mb-5">Click highlighted nodes on the virtual schematic to trace power paths.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-slate-900 p-4 grid-bg relative overflow-hidden">
          <svg viewBox="0 0 600 400" className="w-full h-auto">
            {/* Rails */}
            <line x1="40" y1="40" x2="560" y2="40" stroke="#38bdf8" strokeWidth="2" />
            <text x="40" y="30" fill="#7dd3fc" fontSize="12" fontFamily="monospace">PP_BATT_VCC</text>
            <line x1="40" y1="360" x2="560" y2="360" stroke="#64748b" strokeWidth="2" />
            <text x="40" y="380" fill="#94a3b8" fontSize="12" fontFamily="monospace">GND</text>

            {/* Components */}
            <g>
              <rect x="100" y="100" width="80" height="50" fill={found.sch1 ? "rgba(244,63,94,0.3)" : "rgba(255,255,255,0.05)"} stroke={found.sch1 ? "#f43f5e" : "#475569"} strokeWidth="2" />
              <text x="140" y="130" textAnchor="middle" fill="white" fontSize="11" fontFamily="monospace">BAT_CONN</text>
              <line x1="140" y1="100" x2="140" y2="40" stroke="#f43f5e" strokeWidth="2" />
            </g>
            <g>
              <rect x="260" y="100" width="100" height="60" fill={found.sch2 ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.05)"} stroke={found.sch2 ? "#fbbf24" : "#475569"} strokeWidth="2" />
              <text x="310" y="135" textAnchor="middle" fill="white" fontSize="11" fontFamily="monospace">U2 CHG_IC</text>
              <line x1="180" y1="125" x2="260" y2="125" stroke="#fbbf24" strokeWidth="2" />
            </g>
            <g>
              <rect x="420" y="100" width="100" height="60" fill={found.sch3 ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.05)"} stroke={found.sch3 ? "#10b981" : "#475569"} strokeWidth="2" />
              <text x="470" y="135" textAnchor="middle" fill="white" fontSize="11" fontFamily="monospace">PMIC</text>
              <line x1="360" y1="130" x2="420" y2="130" stroke="#10b981" strokeWidth="2" />
            </g>
            <g>
              <rect x="260" y="240" width="100" height="60" fill={found.sch4 ? "rgba(14,165,233,0.3)" : "rgba(255,255,255,0.05)"} stroke={found.sch4 ? "#0ea5e9" : "#475569"} strokeWidth="2" />
              <text x="310" y="275" textAnchor="middle" fill="white" fontSize="11" fontFamily="monospace">BL_DRV</text>
              <line x1="310" y1="160" x2="310" y2="240" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4" />
            </g>
            {/* Hotspots */}
            {SCHEMATIC_TASKS.map((t, i) => {
              const positions = [
                { x: 140, y: 125 }, { x: 310, y: 130 }, { x: 470, y: 130 }, { x: 310, y: 270 },
              ];
              const p = positions[i];
              return (
                <g key={t.id} onClick={() => setFound((f) => ({ ...f, [t.id]: true }))} style={{ cursor: "pointer" }}>
                  <circle cx={p.x} cy={p.y} r="18" fill="transparent" stroke={found[t.id] ? "#10b981" : "#38bdf8"} strokeWidth="2" strokeDasharray="4">
                    <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-slate-400">Tasks ({foundCount}/{SCHEMATIC_TASKS.length})</p>
          {SCHEMATIC_TASKS.map((t) => (
            <div key={t.id} className={`rounded-xl border p-3 ${found[t.id] ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 bg-white/5"}`}>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${t.color}`} />
                <div className="font-bold text-white text-sm">{t.label}</div>
                {found[t.id] && <span className="ml-auto text-emerald-400 text-sm">✓</span>}
              </div>
              <p className="mt-1 text-xs text-slate-400">{t.hint}</p>
            </div>
          ))}
          {foundCount === SCHEMATIC_TASKS.length && (
            <Button variant="success" className="w-full" onClick={() => addXP(250)}>Claim +250 XP — Schematic Mastered! 🎉</Button>
          )}
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// Repair Checklist (Module 4)
// ============================================================
const REPAIR_STEPS = [
  "Prepare all required tools",
  "Power off the phone & discharge capacitors",
  "Disassemble device following workflow",
  "Replace faulty component with tested replacement",
  "Reassemble device & reapply adhesive",
  "Power on & run full functional test",
];

export function RepairChecklist() {
  const [done, setDone] = useState<boolean[]>(() => REPAIR_STEPS.map(() => false));
  const { addXP, incrementRepairs } = useApp();
  const allDone = done.every(Boolean);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-1">✅ Repair Checklist Simulator</h3>
      <p className="text-sm text-slate-400 mb-5">Check off each step as you complete a real repair in your practice lab.</p>
      <div className="space-y-2">
        {REPAIR_STEPS.map((step, i) => (
          <button
            key={i}
            onClick={() => {
              const next = [...done];
              next[i] = !next[i];
              setDone(next);
            }}
            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
              done[i] ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 bg-white/5 hover:border-white/30"
            }`}
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-md border-2 ${done[i] ? "border-emerald-500 bg-emerald-500" : "border-white/30"}`}>
              {done[i] && <span className="text-xs text-white">✓</span>}
            </div>
            <span className={`text-sm ${done[i] ? "text-emerald-300 line-through" : "text-white"}`}>{step}</span>
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm text-slate-300">
          {allDone ? "🎉 Repair completed successfully!" : `${done.filter(Boolean).length} / ${REPAIR_STEPS.length} steps`}
        </div>
        <Button variant="success" disabled={!allDone} onClick={() => { addXP(150); incrementRepairs(); setDone(REPAIR_STEPS.map(() => false)); }}>
          Log Completed Repair (+150 XP)
        </Button>
      </div>
    </Card>
  );
}
