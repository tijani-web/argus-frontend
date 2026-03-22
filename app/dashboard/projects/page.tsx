"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useAuth } from "@/lib/store";
import Link from "next/link";
import { createProject, getProjects } from "@/lib/api";
import { CopyButton } from "@/components/ui/CopyButton";
import { ProjectRowSkeleton } from "@/components/ui/SkeletonLoader";
import { Plus, Eye, EyeOff, Key, Calendar, AlertTriangle, X, FolderOpen, Activity } from "lucide-react";

// ──────────────────────────────────────────────────────
// Masked API key row
// ──────────────────────────────────────────────────────
function RevealKey({ apiKey }: { apiKey: string }) {
  const [visible, setVisible] = useState(false);
  const masked = apiKey.slice(0, 14) + "••••••••" + apiKey.slice(-4);

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <span className="font-mono text-[0.8rem] text-white/50 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-[7px] flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        {visible ? apiKey : masked}
      </span>
      <button
        onClick={() => setVisible((v) => !v)}
        className="w-8 h-8 rounded-[7px] border border-white/[0.08] bg-transparent text-white/30 cursor-pointer flex items-center justify-center shrink-0 transition-all duration-150 hover:border-white/20 hover:text-white/70"
      >
        {visible ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
      <CopyButton text={apiKey} />
    </div>
  );
}

// ──────────────────────────────────────────────────────
// New project modal
// ──────────────────────────────────────────────────────
function NewProjectModal({ onClose, userId }: { onClose: () => void; userId: string }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ name: string; apiKey: string } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Project name is required."); return; }
    setError("");
    setLoading(true);
    try {
      const project = await createProject(userId, name.trim());
      setCreated({ name: project.name, apiKey: project.apiKey });
      mutate(`projects-${userId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-[10px] flex items-center justify-center p-6"
    >
      <div className="w-full max-w-[460px] p-8 bg-[rgba(12,12,18,0.98)] border border-white/10 rounded-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-white/90 mb-1">
              {created ? "Project created" : "New project"}
            </h2>
            <p className="text-sm text-white/30">
              {created ? "Copy your API key before closing." : "Give your project a name to get an API key."}
            </p>
          </div>
          <button onClick={onClose} className="w-[30px] h-[30px] rounded-[7px] border border-white/[0.08] bg-transparent cursor-pointer text-white/40 flex items-center justify-center hover:border-white/20 hover:text-white/60 transition-all">
            <X size={14} />
          </button>
        </div>

        {created ? (
          <div className="flex flex-col gap-3.5">
            <div className="p-4 bg-white/[0.03] border border-white/[0.07] rounded-[10px]">
              <p className="font-mono text-[0.65rem] text-white/25 tracking-wider mb-1.5">PROJECT</p>
              <p className="font-semibold text-white/80 mb-4 text-[0.95rem]">{created.name}</p>
              <p className="font-mono text-[0.65rem] text-white/25 tracking-wider mb-2">API KEY</p>
              <div className="flex gap-2">
                <span className="font-mono text-[0.78rem] text-white/60 flex-1 break-all leading-relaxed">
                  {created.apiKey}
                </span>
                <CopyButton text={created.apiKey} />
              </div>
            </div>
            <p className="text-[0.77rem] text-amber-400/70 px-3 py-2.5 bg-amber-400/[0.05] border border-amber-400/10 rounded-lg flex gap-2 items-start">
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              This key won&apos;t be shown again after you close this window.
            </p>
            <button onClick={onClose} className="w-full py-3 bg-white border-none rounded-[10px] font-bold text-[0.9rem] cursor-pointer text-black hover:opacity-90 transition-opacity">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs text-white/[0.35] mb-1.5 tracking-wide">Project name</label>
              <input type="text" className="input-field" placeholder="e.g. Production API" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            {error && <p className="text-sm text-red-400/80 m-0">{error}</p>}
            <div className="flex gap-2 mt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-white/10 rounded-[9px] bg-transparent text-white/50 cursor-pointer font-medium text-[0.88rem] hover:border-white/20 hover:text-white/70 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={loading} className={`flex-1 py-2.5 bg-white border-none rounded-[9px] font-bold text-[0.88rem] text-black ${loading ? "cursor-not-allowed opacity-60" : "cursor-pointer opacity-100 hover:opacity-90"} transition-opacity`}>
                {loading ? "Creating..." : "Create →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const userId = user?.userId ?? "";

  const { data: projects, error, isLoading } = useSWR(
    userId ? `projects-${userId}` : null,
    () => getProjects(userId),
    { revalidateOnFocus: false }
  );

  return (
    <div className="max-w-[860px]">
      {showModal && user && (
        <NewProjectModal userId={user.userId} onClose={() => setShowModal(false)} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-9 flex-wrap gap-3.5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white/90 mb-1">
            Projects
          </h1>
          <p className="text-sm text-white/30">
            Each project gets a unique <span className="font-mono text-white/[0.45]">argus_live_</span> API key.
          </p>
        </div>
        {user && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-none rounded-[9px] text-black font-bold text-[0.86rem] cursor-pointer transition-opacity duration-200 hover:opacity-85"
          >
            <Plus size={14} /> New Project
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="border border-white/[0.07] rounded-[14px] px-6 py-5">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <ProjectRowSkeleton />
              {i < 2 && <div className="h-px bg-white/[0.05] my-1" />}
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-6 rounded-[14px] border border-red-400/15 bg-red-400/[0.04] flex gap-3 items-center">
          <AlertTriangle size={16} className="text-red-400/70" />
          <p className="font-mono text-sm text-red-400/70">
            {error?.message ?? "Failed to load projects."}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && (!projects || projects.length === 0) && (
        <div className="py-16 px-10 rounded-[14px] border border-dashed border-white/[0.08] text-center">
          <FolderOpen size={32} className="text-white/15 mx-auto mb-4" />
          <p className="text-[0.95rem] font-semibold text-white/40 mb-2">No projects yet</p>
          <p className="text-[0.82rem] text-white/20 max-w-[320px] mx-auto mb-6">
            Create a project to get your first API key and start ingesting events.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white border-none rounded-[9px] font-bold text-[0.88rem] cursor-pointer text-black hover:opacity-90 transition-opacity"
          >
            <Plus size={14} /> Create First Project
          </button>
        </div>
      )}

      {/* Projects list */}
      {!isLoading && !error && projects && projects.length > 0 && (
        <>
          <div className="rounded-[14px] border border-white/[0.07] overflow-hidden">
            {projects.map((project, idx) => (
              <div key={project.id}>
                  <div className="p-4 md:px-5 flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
                    {/* Top Row on Mobile: Icon + Info + Status */}
                    <div className="flex items-center justify-between lg:w-48 shrink-0 w-full lg:w-auto">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-9 h-9 rounded-[9px] bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0">
                          <FolderOpen size={15} className="text-white/40" />
                        </div>
                        <div className="shrink-0">
                          <p className="font-semibold text-[0.9rem] text-white/85 mb-0.5">{project.name}</p>
                          <div className="flex items-center gap-1.5 text-white/[0.22] text-[0.72rem] font-mono">
                            <Calendar size={10} />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {/* Status dot (moved next to name on mobile) */}
                      <div className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 border border-white/[0.07] rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400/80" />
                        <span className="font-mono text-[0.65rem] text-white/30 truncate">Active</span>
                      </div>
                    </div>

                    {/* API Key (Takes remaining space) */}
                    <div className="flex-1 flex items-center gap-2 min-w-0 w-full bg-white/[0.01] sm:bg-transparent p-2 sm:p-0 rounded-lg border border-white/[0.03] sm:border-none">
                      <Key size={12} className="text-white/20 shrink-0 hidden sm:block" />
                      <RevealKey apiKey={project.apiKey} />
                    </div>

                    {/* Actions & Status Desktop */}
                    <div className="flex items-center gap-3 w-full lg:w-auto justify-end sm:justify-start lg:justify-end mt-1 lg:mt-0">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 lg:px-3 py-2 lg:py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-white/80 no-underline text-[0.8rem] font-medium transition-all duration-200 hover:border-white/30 hover:bg-white/[0.08]"
                      >
                        View Dashboard <Activity size={13} />
                      </Link>
                      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 border border-white/[0.07] rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400/80" />
                        <span className="font-mono text-[0.65rem] text-white/30">Active</span>
                      </div>
                    </div>
                  </div>
                  {idx < projects.length - 1 && (
                    <div className="h-px bg-white/[0.05]" />
                  )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3.5 rounded-[10px] border border-white/[0.05] flex gap-2.5 items-start">
            <Key size={13} className="text-white/20 shrink-0 mt-0.5" />
            <p className="text-sm text-white/25 leading-relaxed">
              Send your API key in the <span className="font-mono text-white/40">X-API-Key</span> header when posting to{" "}
              <span className="font-mono text-white/40">POST /api/events</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
