"use client";

import { use, useRef } from "react";
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
import { getLiveCounters, getHistoricalSeries, getRawEvents, getProjects } from "@/lib/api";
import { StatSkeleton, ChartSkeleton } from "@/components/ui/SkeletonLoader";
import { AlertTriangle, Activity, Terminal, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/store";
import { EventLog } from "@/components/dashboard/EventLog";
import { StatCard } from "@/components/dashboard/StatCard";
import { EventTypeBar } from "@/components/dashboard/EventTypeBreakdown";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function ProjectDashboardPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const chartRef = useRef<ChartJS<"line"> | null>(null);
  const { user } = useAuth();

  const { data: projects } = useSWR(
    user?.userId ? `projects-${user.userId}` : null,
    () => getProjects(user!.userId)
  );
  const project = projects?.find(p => p.id === projectId);

  const {
    data: counters,
    error: countersError,
    isLoading: countersLoading,
  } = useSWR(
    projectId ? `counters-${projectId}` : null,
    () => getLiveCounters(projectId),
    { refreshInterval: 3000 }
  );

  const {
    data: series,
    error: seriesError,
    isLoading: seriesLoading,
  } = useSWR(
    projectId ? `series-${projectId}` : null,
    () => getHistoricalSeries(projectId),
    { refreshInterval: 10000 }
  );

  const {
    data: rawEvents,
    isLoading: eventsLoading
  } = useSWR(
    projectId ? `raw-events-${projectId}` : null,
    () => getRawEvents(projectId),
    { refreshInterval: 3000 }
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
        borderColor: "rgba(0,255,136,0.6)",
        borderWidth: 1.5,
        fill: true,
        backgroundColor: (context: { chart: ChartJS }) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "transparent";
          const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          grad.addColorStop(0, "rgba(0,255,136,0.08)");
          grad.addColorStop(1, "rgba(0,255,136,0.0)");
          return grad;
        },
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#fff",
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
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: "rgba(255,255,255,0.2)", font: { size: 10 }, maxTicksLimit: 10 },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: { color: "rgba(255,255,255,0.2)", font: { size: 10 } },
        grid: { color: "rgba(255,255,255,0.03)" },
        border: { display: false },
      },
    },
  };

  return (
    <div className="max-w-[1300px]">
      {/* Breadcrumbs / Header */}
      <div className="mb-9">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-sm text-white/30 no-underline mb-3.5 transition-colors duration-200 hover:text-white"
        >
          <ArrowLeft size={13} /> Back to Projects
        </Link>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
              <Activity size={20} className="text-accent-green" />
            </div>
            <div>
              <h1 className="text-2xl md:text-[1.7rem] font-extrabold text-white tracking-tight mb-0.5">
                {project?.name ?? "Project Dashboard"}
              </h1>
              <span className="font-mono text-[0.7rem] text-white/25">
                {projectId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-accent-green/[0.05] border border-accent-green/15 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_var(--accent-green)]" />
            <span className="font-mono text-[0.68rem] text-accent-green tracking-wider">LIVE STREAMING</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {countersLoading ? (
          [0, 1, 2, 3].map(i => (
            <div key={i} className="p-6 bg-white/[0.01] border border-white/[0.05] rounded-[14px]">
              <StatSkeleton />
            </div>
          ))
        ) : (
          <>
            <StatCard label="Total Events" value={(counters?.totalEvents ?? 0).toLocaleString()} sub="All time project traffic" />
            <StatCard label="Error Events" value={(counters?.errorEvents ?? 0).toLocaleString()} sub={`${counters?.totalEvents ? ((counters.errorEvents / counters.totalEvents) * 100).toFixed(1) : "0.0"}% error rate`} dimmed={(counters?.errorEvents ?? 0) > 0} />
            <StatCard label="Event Types" value={Object.keys(counters?.eventsByType ?? {}).length} sub="Distinct signals identified" />
            <StatCard label="Ingestion Health" value="100%" sub="Node status: OPTIMAL" />
          </>
        )}
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 mb-6">
        {/* Chart Section */}
        <div className="flex flex-col gap-6">
          <div className="p-6 bg-white/[0.02] border border-border-subtle rounded-2xl">
            <div className="mb-5">
              <h3 className="text-[0.95rem] font-bold text-white mb-1">Historical Activity</h3>
              <p className="text-xs text-white/30">Aggregated event counts over the last 100 buckets</p>
            </div>
            {seriesLoading ? <ChartSkeleton /> : (
              <div className="w-full overflow-x-auto pb-4 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                <div style={{ height: "300px", minWidth: "100%", width: series && series.length > 40 ? `${series.length * 28}px` : "100%" }}>
                  <Line ref={chartRef} data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
          </div>

          {/* Event Inspector Section */}
          <div className="p-6 bg-white/[0.02] border border-border-subtle rounded-2xl">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h3 className="text-[0.95rem] font-bold text-white mb-1">Event Inspector</h3>
                <p className="text-xs text-white/30">Real-time audit log and raw payload inspection</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-lg border border-white/[0.05]">
                <Terminal size={12} className="text-accent-green" />
                <span className="text-[0.65rem] text-accent-green font-mono font-semibold">MONITOR_ACTIVE</span>
              </div>
            </div>
            <EventLog events={rawEvents ?? []} isLoading={eventsLoading} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="p-6 bg-white/[0.02] border border-border-subtle rounded-2xl">
            <h3 className="text-[0.9rem] font-bold text-white mb-5">Event Type Breakdown</h3>
            {countersLoading ? <div className="h-[200px] skeleton" /> : <EventTypeBar typeMap={counters?.eventsByType ?? {}} />}
          </div>

          <div className="p-6 bg-gradient-to-br from-electric/[0.05] to-cyber/[0.05] border border-indigo-400/15 rounded-2xl">
            <h3 className="text-[0.9rem] font-bold text-white mb-3">Developer Access</h3>
            <p className="text-[0.78rem] text-white/40 leading-relaxed mb-5">
              Route your telemetry to this scoped dashboard using your project&apos;s unique API key.
            </p>
            <Link
              href="/dashboard/projects"
              className="block text-center py-2.5 bg-white/[0.08] rounded-lg text-white text-[0.82rem] font-semibold no-underline transition-colors duration-200 hover:bg-white/[0.12]"
            >
              Manage API Keys
            </Link>
          </div>

          <div className="p-5 rounded-2xl border border-amber-400/10 bg-amber-400/[0.02]">
            <div className="flex gap-2.5">
              <AlertTriangle size={15} className="text-amber-400 shrink-0" />
              <p className="text-[0.72rem] text-amber-400/60 leading-relaxed">
                Large payloads may be truncated in the preview. Use the Inspector for full expansion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
