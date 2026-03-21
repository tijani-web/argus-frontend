"use client";

import { useRef } from "react";
import useSWR from "swr";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getLiveCounters, getHistoricalSeries, getHealth, getProjects } from "@/lib/api";
import { StatSkeleton, ChartSkeleton } from "@/components/ui/SkeletonLoader";
import { AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { EventTypeBar } from "@/components/dashboard/EventTypeBreakdown";
import Link from "next/link";
import { useAuth } from "@/lib/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// ──────────────────────────────────────────────
// Health badge
// ──────────────────────────────────────────────
function HealthBadge() {
  const { data, error } = useSWR("health", () => getHealth(), {
    refreshInterval: 15000,
  });
  const checking = !data && !error;
  const ok = data?.status === "UP" || data?.status === "up";

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/[0.08] rounded-full bg-white/[0.02]">
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          checking
            ? "bg-white/25"
            : ok
              ? "bg-green-400/90"
              : "bg-red-400/90"
        }`}
      />
      <span className="font-mono text-[0.68rem] text-white/[0.35] tracking-wider">
        {checking
          ? "CHECKING"
          : ok
            ? "BACKEND UP"
            : error
              ? "BACKEND DOWN"
              : data?.status?.toUpperCase()}
      </span>
    </div>
  );
}

export default function DashboardOverviewPage() {
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const { user } = useAuth();
  const userId = user?.userId ?? "";

  const { data: projects } = useSWR(
    userId ? `projects-${userId}` : null,
    () => getProjects(userId),
    { revalidateOnFocus: false }
  );

  const {
    data: counters,
    error: countersError,
    isLoading: countersLoading,
  } = useSWR(
    "global-counters",
    () => getLiveCounters(),
    { refreshInterval: 3000 }
  );

  const {
    data: series,
    error: seriesError,
    isLoading: seriesLoading,
  } = useSWR(
    "global-series",
    () => getHistoricalSeries(),
    { refreshInterval: 30000 }
  );

  const chartLabels =
    series?.map((b) => {
      const d = new Date(b.time);
      return `${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }) ?? [];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Events",
        data: series?.map((b) => b.eventCount) ?? [],
        borderColor: "rgba(255,255,255,0.6)",
        borderWidth: 1.5,
        fill: true,
        backgroundColor: (context: { chart: ChartJS }) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "transparent";
          const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          grad.addColorStop(0, "rgba(255,255,255,0.08)");
          grad.addColorStop(1, "rgba(255,255,255,0.0)");
          return grad;
        },
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(255,255,255,0.8)",
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(8,8,12,0.95)",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        titleColor: "rgba(255,255,255,0.7)",
        bodyColor: "rgba(255,255,255,0.5)",
        titleFont: { family: "var(--font-mono)", size: 11 },
        bodyFont: { family: "var(--font-mono)", size: 11 },
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: "rgba(255,255,255,0.2)", font: { family: "var(--font-mono)", size: 10 }, maxTicksLimit: 10 },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: { color: "rgba(255,255,255,0.2)", font: { family: "var(--font-mono)", size: 10 } },
        grid: { color: "rgba(255,255,255,0.03)" },
        border: { display: false },
      },
    },
  };

  return (
    <div className="max-w-[1300px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-9 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white/90 mb-1">
            Network Overview
          </h1>
          <p className="text-sm text-white/30">
            Aggregated traffic across all active projects.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <HealthBadge />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {countersLoading ? (
          [0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-[14px] border border-white/[0.06] bg-white/[0.01]"
            >
              <StatSkeleton />
            </div>
          ))
        ) : countersError ? (
          <div className="col-span-full p-7 rounded-[14px] border border-red-400/15 bg-red-400/[0.04] flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-400/70" />
            <p className="text-sm text-red-400/70 font-mono">
              Cannot reach statistics engine. Verify backend is operational.
            </p>
          </div>
        ) : (
          <>
            <StatCard
              label="Total Network Traffic"
              value={(counters?.totalEvents ?? 0).toLocaleString()}
              sub="Events processed platform-wide"
            />
            <StatCard
              label="System Errors"
              value={(counters?.errorEvents ?? 0).toLocaleString()}
              sub={`${counters?.totalEvents ? ((counters.errorEvents / counters.totalEvents) * 100).toFixed(1) : "0.0"}% aggregate failure`}
              dimmed={(counters?.errorEvents ?? 0) > 0}
            />
            <StatCard
              label="Active Projects"
              value={projects?.length ?? 0}
              sub="Provisioned workspaces"
            />
            <StatCard
              label="Unique Event Signals"
              value={Object.keys(counters?.eventsByType ?? {}).length}
              sub="Categorized event variants"
            />
          </>
        )}
      </div>

      {/* Chart + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 mb-5">
        {/* Line Chart */}
        <div className="p-6 rounded-[14px] border border-white/[0.07] bg-white/[0.02]">
          <div className="mb-5">
            <p className="text-[0.88rem] font-bold text-white/85 mb-1">
              Network Activity
            </p>
            <p className="text-xs text-white/25">
              Real-time platform throughput
            </p>
          </div>
          {seriesLoading ? (
            <ChartSkeleton />
          ) : seriesError ? (
            <div className="h-[220px] flex items-center justify-center">
              <p className="font-mono text-[0.78rem] text-red-400/60">
                Series data temporarily unavailable
              </p>
            </div>
          ) : (
            <div className="h-[300px]">
              <Line ref={chartRef} data={chartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="p-6 rounded-[14px] border border-white/[0.07] bg-white/[0.02]">
          <p className="text-[0.88rem] font-bold text-white/85 mb-1">
            Signal Distribution
          </p>
          <p className="text-xs text-white/25 mb-5">
            Traffic composition by type
          </p>
          {countersLoading ? (
            <div className="flex flex-col gap-3 skeleton" />
          ) : (
            <EventTypeBar typeMap={counters?.eventsByType ?? {}} />
          )}
        </div>
      </div>

      {/* Projects CTA */}
      <div className="p-5 rounded-[14px] border border-white/[0.06] bg-gradient-to-r from-white/[0.01] to-white/[0.03] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <p className="text-[0.88rem] font-semibold text-white/80 mb-1">Deep Dive into Projects</p>
          <p className="text-sm text-white/30">
            View granular telemetry and raw event logs for individual workspaces.
          </p>
        </div>
        <Link
          href="/dashboard/projects"
          className="px-5 py-2 bg-white rounded-[9px] text-black no-underline text-[0.85rem] font-bold transition-opacity duration-200 hover:opacity-85 shrink-0"
        >
          Manage Projects →
        </Link>
      </div>
    </div>
  );
}
