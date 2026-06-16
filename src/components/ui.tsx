import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  accent = "from-sky-500 to-blue-600",
  sub,
  onClick,
}: {
  label: string;
  value: string | number;
  icon: string;
  accent?: string;
  sub?: string;
  onClick?: () => void;
}) {
  const clickable = typeof onClick === "function";
  return (
    <Card
      onClick={onClick}
      className={`p-5 relative overflow-hidden group transition ${
        clickable
          ? "cursor-pointer hover:border-sky-400/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/10 active:translate-y-0"
          : "hover:border-white/20"
      }`}
    >
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl group-hover:opacity-40 transition`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      {clickable && (
        <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-sky-400 opacity-0 group-hover:opacity-100 transition">
          View details <span className="transition group-hover:translate-x-0.5">→</span>
        </div>
      )}
    </Card>
  );
}

export function ProgressBar({ value, max = 100, color = "bg-sky-500" }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
      <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Badge({ children, color = "bg-sky-500/15 text-sky-300 border-sky-500/30" }: { children: ReactNode; color?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled,
  type = "button",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "success" | "danger";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
}) {
  const styles: Record<string, string> = {
    primary: "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/30",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10",
    ghost: "text-slate-300 hover:bg-white/5",
    success: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/30",
    danger: "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:shadow-lg hover:shadow-rose-500/30",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">{eyebrow}</p>
      <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-slate-400">{description}</p>}
    </div>
  );
}
