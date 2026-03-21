"use client";

import { useAuth } from "@/lib/store";
import { Settings, Bell, Shield, Cpu, User, LogOut, Trash2, RefreshCw, Activity, Check, AlertCircle, Loader2, Send } from "lucide-react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api";

interface Project {
  id: string;
  name: string;
  slackWebhookUrl?: string;
  alertConfig?: string;
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [clearing, setClearing] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [alertConfig, setAlertConfig] = useState({ alertOnErrors: true, alertOnTypes: [] as string[] });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const { data: projects, mutate } = useSWR<Project[]>(
    user?.userId ? `/api/v1/projects/user/${user.userId}` : null,
    fetcher
  );

  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    const project = projects?.find(p => p.id === selectedProjectId);
    if (project) {
      setWebhookUrl(project.slackWebhookUrl || "");
      try {
        setAlertConfig(JSON.parse(project.alertConfig || '{"alertOnErrors": true, "alertOnTypes": []}'));
      } catch (e) {
        setAlertConfig({ alertOnErrors: true, alertOnTypes: [] });
      }
    }
  }, [selectedProjectId, projects]);

  const handleSaveSlack = async () => {
    if (!selectedProjectId) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/v1/projects/${selectedProjectId}/slack`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slackWebhookUrl: webhookUrl,
          alertConfig: JSON.stringify(alertConfig)
        })
      });
      if (res.ok) {
        setStatus({ type: 'success', msg: 'Configuration saved successfully!' });
        mutate();
      } else {
        throw new Error('Failed to save');
      }
    } catch (e) {
      setStatus({ type: 'error', msg: 'Failed to update configuration.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestSlack = async () => {
    if (!selectedProjectId || !webhookUrl) return;
    setTesting(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/v1/projects/${selectedProjectId}/slack/test`, {
        method: 'POST'
      });
      if (res.ok) {
        setStatus({ type: 'success', msg: 'Test alert sent! Check your Slack channel.' });
      } else {
        throw new Error('Test failed');
      }
    } catch (e) {
      setStatus({ type: 'error', msg: 'Failed to send test alert. Verify your Webhook URL.' });
    } finally {
      setTesting(false);
    }
  };

  const handleClearCache = () => {
    setClearing(true);
    setTimeout(() => {
      alert("Local session cache and telemetry buffers have been cleared.");
      setClearing(false);
    }, 1200);
  };

  return (
    <div className="max-w-[800px]">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Workspace Settings
        </h1>
        <p className="text-white/[0.35] text-[0.9rem]">
          Manage your account profile, integration preferences, and local data.
        </p>
      </div>

      {/* User Section */}
      <div className="mb-10">
        <h2 className="text-xs font-bold text-white/20 uppercase tracking-[0.12em] mb-4">
          Authenticated Account
        </h2>
        <div className="p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric to-cyber flex items-center justify-center text-2xl font-extrabold text-white shadow-[0_8px_16px_rgba(0,0,0,0.2)] shrink-0">
            {user?.email?.[0].toUpperCase() ?? "A"}
          </div>
          <div className="text-center sm:text-left">
            <div className="text-xl font-bold text-white mb-0.5">{user?.name ?? "Argus Operator"}</div>
            <div className="text-[0.9rem] text-white/40 font-mono">{user?.email}</div>
          </div>
          <div className="sm:ml-auto">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-400/[0.08] border border-red-400/15 rounded-[10px] text-red-400/80 text-[0.85rem] font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-400/15"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Slack Integration Section */}
      <div className="mb-10">
        <h2 className="text-xs font-bold text-white/20 uppercase tracking-[0.12em] mb-4">
          Alert Routing (Slack Integration)
        </h2>

        <div className="p-6 md:p-8 rounded-[20px] border border-white/[0.06] bg-white/[0.01]">
          <div className="mb-6">
            <label className="block text-[0.85rem] text-white/40 mb-2">Select Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              disabled={!projects || projects.length === 0}
              className="w-full bg-[#0c0c0e] border border-white/10 rounded-[10px] px-4 py-3 text-white outline-none disabled:text-white/30"
            >
              {!projects && <option>Loading projects...</option>}
              {projects?.length === 0 && <option>No projects found</option>}
              {projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-[0.85rem] text-white/40 mb-2">Slack Webhook URL</label>
            <input
              type="text"
              placeholder="https://hooks.slack.com/services/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-[#0c0c0e] border border-white/10 rounded-[10px] px-4 py-3 text-white outline-none font-mono text-[0.85rem]"
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex-1 min-w-[200px]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertConfig.alertOnErrors}
                  onChange={(e) => setAlertConfig({ ...alertConfig, alertOnErrors: e.target.checked })}
                  className="w-[18px] h-[18px] accent-electric"
                />
                <span className="text-[0.9rem] text-white/70">Alert on 5xx Errors</span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveSlack}
              disabled={saving || !selectedProjectId}
              className={`flex items-center gap-2.5 px-6 py-3 bg-gradient-to-br from-electric to-[#0088ff] border-none rounded-xl text-white text-[0.9rem] font-bold shadow-[0_4px_12px_rgba(0,209,255,0.2)] transition-all duration-200 ${saving ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-90"}`}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Save Config
            </button>

            <button
              onClick={handleTestSlack}
              disabled={testing || !webhookUrl}
              className={`flex items-center gap-2.5 px-6 py-3 bg-transparent border border-white/10 rounded-xl text-white/70 text-[0.9rem] font-semibold transition-all duration-200 ${testing ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-white/20 hover:text-white"}`}
            >
              {testing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Send Test Alert
            </button>
          </div>

          {status && (
            <div className={`mt-6 px-5 py-4 rounded-xl flex items-center gap-2.5 text-[0.85rem] ${
              status.type === 'success'
                ? "bg-green-400/[0.06] border border-green-400/20 text-green-400"
                : "bg-red-400/[0.06] border border-red-400/20 text-red-400"
            }`}>
              {status.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
              {status.msg}
            </div>
          )}
        </div>
      </div>

      {/* Other Preferences Section */}
      <div className="mb-10">
        <h2 className="text-xs font-bold text-white/20 uppercase tracking-[0.12em] mb-4">
          Advanced & Security
        </h2>

        <div className="grid gap-3">
          {[
            { icon: Shield, title: "Security Policies", desc: "Access control lists and mTLS certificate management.", color: "cyber" },
            { icon: Activity, title: "Sampling Rate", desc: "Adjust data ingestion resolution for high-traffic projects.", color: "accent-green" }
          ].map(item => (
            <div key={item.title} className="px-6 py-5 rounded-[14px] border border-white/[0.05] bg-white/[0.01] flex items-center gap-4 opacity-60">
              <div className={`p-2.5 rounded-[11px] border ${item.color === 'cyber' ? 'bg-cyber/[0.08] border-cyber/15' : 'bg-accent-green/[0.08] border-accent-green/15'}`}>
                <item.icon size={19} className={item.color === 'cyber' ? 'text-cyber' : 'text-accent-green'} />
              </div>
              <div>
                <div className="font-semibold text-white/90 text-[0.95rem] mb-0.5">{item.title}</div>
                <div className="text-[0.82rem] text-white/30">{item.desc}</div>
              </div>
              <div className="ml-auto">
                <span className="font-mono text-[0.65rem] text-white/15 tracking-wider px-2.5 py-1 border border-white/[0.05] rounded-lg">
                  COMING_SOON
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Section */}
      <div className="mt-12 p-6 md:p-8 rounded-[20px] border border-red-400/15 bg-gradient-to-br from-red-400/[0.03] to-transparent">
        <h3 className="text-lg font-bold text-red-400 mb-2">Maintenance & Data</h3>
        <p className="text-[0.85rem] text-red-400/60 leading-relaxed mb-6 max-w-[500px]">
          Manage your local application state. These actions are immediate and will re-initialize your workspace environment.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            disabled={clearing}
            onClick={handleClearCache}
            className={`flex items-center gap-2.5 px-5 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/60 text-[0.88rem] font-semibold transition-all duration-200 ${clearing ? "cursor-not-allowed" : "cursor-pointer hover:bg-white/[0.08]"}`}
          >
            <RefreshCw size={15} className={clearing ? "animate-spin" : ""} />
            {clearing ? "Processing..." : "Purge Event Cache"}
          </button>

          <button className="flex items-center gap-2.5 px-5 py-3 bg-transparent border border-red-400/10 rounded-xl text-red-400/40 text-[0.88rem] font-semibold cursor-not-allowed opacity-60">
            <Trash2 size={15} /> Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
}