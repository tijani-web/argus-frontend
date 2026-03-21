"use client";

export function EventTypeBar({ typeMap }: { typeMap: Record<string, number> }) {
  const entries = Object.entries(typeMap).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  if (entries.length === 0) {
    return (
      <div className="py-5 text-center text-white/15">
        <p className="text-xs font-mono">No event types detected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.slice(0, 10).map(([type, count]) => (
        <div key={type}>
          <div className="flex justify-between mb-1">
            <span className="font-mono text-[0.73rem] text-white/[0.45]">
              {type}
            </span>
            <span className="font-mono text-[0.73rem] text-white/[0.35]">
              {count.toLocaleString()}
            </span>
          </div>
          <div className="h-[3px] bg-white/[0.06] rounded-sm">
            <div
              className="h-full bg-white/[0.35] rounded-sm transition-[width] duration-700 ease-out"
              style={{ width: `${Math.round((count / total) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
