"use client";

export function StatCard({
  label,
  value,
  sub,
  dimmed,
}: {
  label: string;
  value: string | number;
  sub?: string;
  dimmed?: boolean;
}) {
  return (
    <div className="p-6 rounded-[14px] border border-white/[0.07] bg-white/[0.02]">
      <p className="font-mono text-[0.68rem] text-white/30 tracking-wider uppercase mb-3">
        {label}
      </p>
      <p
        className={`font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold tracking-tight leading-none mb-2 ${
          dimmed ? "text-red-400/90" : "text-white/[0.92]"
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[0.77rem] text-white/25">
          {sub}
        </p>
      )}
    </div>
  );
}
