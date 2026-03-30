"use client";

import Link from "next/link";
import { ChevronRight, Copy, CheckCheck, BookOpen, Terminal, Code, MessageSquare, Shield, Activity, Menu, User, LogOut, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/store";

function CodeBlock({ code, lang = "" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden mb-6">
      {lang && (
        <div className="px-4 py-2 border-b border-white/[0.06] font-mono text-[0.65rem] text-white/25 tracking-widest flex justify-between items-center">
          <span>{lang.toUpperCase()}</span>
          <button
            onClick={copy}
            className={`bg-transparent border-none cursor-pointer flex items-center gap-1.5 text-[0.65rem] font-mono tracking-wider transition-colors duration-200 ${copied ? "text-green-400/90" : "text-white/30 hover:text-white/60"
              }`}
          >
            {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>
      )}
      <pre className="m-0 p-5 overflow-x-auto font-mono text-[0.78rem] md:text-[0.82rem] leading-[1.7] text-white/75 whitespace-pre scrollbar-hide">
        {code}
      </pre>
    </div>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="mb-12 md:mb-[72px]">
      <p className="font-mono text-[0.65rem] text-white/25 tracking-[0.12em] uppercase mb-2.5">
        {sub}
      </p>
      <h2 className="text-[clamp(1.3rem,2.5vw,1.8rem)] font-extrabold tracking-tight text-white/[0.92] mb-5">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 md:gap-5 mb-8 md:mb-10">
      <div className="shrink-0">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/[0.12] flex items-center justify-center font-mono text-[0.7rem] md:text-[0.78rem] font-bold text-white/50">
          {n}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold text-white/85 mb-2.5 tracking-tight">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

const JS_SNIPPET = `// argus.js — non-blocking fetch wrapper
const ARGUS_API_KEY = "argus_live_YOUR_KEY_HERE";
const ARGUS_ENDPOINT = "https://argus-bt.duckdns.org:8443/api/events";

function getSessionId() {
  let id = sessionStorage.getItem("argus_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("argus_sid", id);
  }
  return id;
}

export async function track(eventType, extra = {}) {
  try {
    // We use "keepalive: true" so events reach the server even if the page unloads
    fetch(ARGUS_ENDPOINT, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": ARGUS_API_KEY,
      },
      body: JSON.stringify({
        eventId: crypto.randomUUID(),
        eventType,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
        url: window.location.pathname,
        service: "web-frontend", // YOUR SERVICE NAME
        data: extra, // Safely nests custom properties
      }),
    });
  } catch (e) {
    // Fail silently in production to protect user experience
  }
}`;

const JS_USAGE = `import { track } from "./argus.js";

// 1. Tracks initial page load
track("page_view", { title: document.title, theme: "dark" });

// 2. Track specific user interactions
document.getElementById("signup-btn").addEventListener("click", () => {
  track("signup_click", { device: "desktop", plan: "pro" });
});

// 3. Track performance metrics
window.addEventListener("load", () => {
  const [navigation] = performance.getEntriesByType("navigation");
  track("performance_metric", {
    latency: Math.round(navigation.domInteractive)
  });
});`;

const PYTHON_SNIPPET = `# Standard requests library integration
import requests, uuid, os
from datetime import datetime, timezone

ARGUS_KEY = "argus_live_YOUR_KEY_HERE"
ARGUS_URL = "https://argus-bt.duckdns.org:8443/api/events"

def track_event(event_type: str, service_name="python-backend", **kwargs):
    """Asynchronous-style fire-and-forget ingestion"""
    payload = {
        "eventId": str(uuid.uuid4()),
        "eventType": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "sessionId": "backend-worker",
        "service": service_name,
        "data": kwargs, # Safely nests all custom **kwargs here
    }
    try:
        requests.post(
            ARGUS_URL,
            headers={"X-API-Key": ARGUS_KEY, "Content-Type": "application/json"},
            json=payload,
            timeout=1, # Keep timeouts short to avoid blocking workers
        )
    except requests.exceptions.RequestException:
        pass

# Example: Track a successful database operation
track_event("api_call", statusCode=201, latency=12, endpoint="/v1/users")`;

const NODE_SNIPPET = `// Node.js backend integration
const fetch = require("node-fetch");

const ARGUS_KEY = "argus_live_YOUR_KEY_HERE";
const ARGUS_URL = "https://argus-bt.duckdns.org:8443/api/events";

const track = (eventType, options = {}, serviceName = "node-api") => {
  fetch(ARGUS_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      "X-API-Key": ARGUS_KEY 
    },
    body: JSON.stringify({
      eventId: require("crypto").randomUUID(),
      eventType,
      timestamp: new Date().toISOString(),
      sessionId: "server-runtime",
      service: serviceName,
      data: options, // Safely nests custom options here
    }),
  }).catch(() => {});
};

// Example Express middleware for automated monitoring
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    track("api_call", {
      url: req.path,
      statusCode: res.statusCode,
      latency: Date.now() - start
    }, "inventory-svc");
  });
  next();
});`;

const CURL_SNIPPET = `curl -s -X POST https://argus-bt.duckdns.org:8443/api/events \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: argus_live_YOUR_KEY_HERE" \\
  -d '{
    "eventId": "550e8400-e29b-41d4-a716-446655440000",
    "eventType": "api_call",
    "timestamp": "2026-03-16T12:00:00Z",
    "sessionId": "test-session",
    "service": "cli-test",
    "statusCode": 200,
    "latency": 5,
    "data": {
      "cli_version": "1.0.4",
      "os": "linux"
    }
  }'
# Expected Output: 202 Accepted`;

export default function DocsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("setup");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [
    { id: "setup", title: "Quick Start", icon: Terminal },
    { id: "schema", title: "Event Schema", icon: BookOpen },
    { id: "js", title: "JavaScript", icon: Code },
    { id: "python", title: "Python", icon: Activity },
    { id: "node", title: "Node.js", icon: Code },
    { id: "slack", title: "Slack Alerts", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-black text-white scroll-smooth">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-[70px] flex items-center justify-between px-4 md:px-10 bg-black/80 backdrop-blur-xl border-b border-zinc-800/80">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-[30px] h-[30px] rounded-lg bg-white flex items-center justify-center font-black text-black">A</div>
          <span className="font-mono font-bold text-[0.9rem] text-white tracking-wider">ARGUS docs</span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-white/70 bg-transparent cursor-pointer hover:text-white hover:border-white/20 transition-all"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-[0.85rem] text-white/50 no-underline font-medium hover:text-white/80 transition-colors">Dashboard</Link>
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white/[0.05] rounded-[10px] border border-white/10">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-electric to-cyber flex items-center justify-center text-[0.7rem] font-extrabold">
                  {user.email[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold">{user.name}</span>
                <button
                  onClick={logout}
                  className="bg-transparent border-none cursor-pointer text-white/30 flex items-center transition-colors duration-200 hover:text-red-400"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-5 py-2 bg-white rounded-[10px] text-black no-underline text-[0.85rem] font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              Get Started <ChevronRight size={14} />
            </Link>
          )}
        </div>
      </nav>

      <div className="flex max-w-[1200px] mx-auto px-4 md:px-5 pt-[100px]">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-[70px] lg:top-[100px] left-0 z-50 lg:z-auto w-64 h-[calc(100vh-70px)] lg:h-[calc(100vh-120px)] bg-black lg:bg-transparent border-r border-white/[0.06] lg:border-r-0 lg:pr-10 p-4 lg:p-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="grid gap-1">
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => { setActiveTab(s.id); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-[10px] no-underline text-[0.88rem] font-medium transition-all duration-200 ${activeTab === s.id
                    ? "text-white bg-white/[0.06]"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                  }`}
              >
                <s.icon size={16} strokeWidth={activeTab === s.id ? 2.5 : 2} />
                {s.title}
              </a>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-16 pb-24">
          {/* Hero */}
          <div className="mb-[72px]">
            <p className="font-mono text-[0.65rem] text-white/25 tracking-[0.12em] uppercase mb-3.5">
              Documentation
            </p>
            <h1 className="text-[clamp(1.8rem,5vw,3rem)] font-black tracking-tighter text-white leading-[1.1] mb-5">
              Integrate in minutes,
              <br />
              <span className="text-white/30">not hours.</span>
            </h1>
            <p className="text-lg text-white/40 leading-[1.75] max-w-[560px]">
              One endpoint. One header. Every event you send is validated,
              GeoIP-enriched, streamed through Kafka, and queryable from your
              dashboard in real time.
            </p>
          </div>

          {/* Quick start */}
          <div id="setup">
            <Section title="Quick Start" sub="Setup">
              <Step n={1} title="Create an account">
                <p className="text-[0.9rem] text-white/40 leading-[1.7] mb-3">
                  Go to the{" "}
                  <Link href="/auth" className="text-white/70 underline">
                    sign up page
                  </Link>
                  , enter your email and a password (min 8 characters). Your account is created instantly.
                </p>
              </Step>

              <Step n={2} title="Provision a New Project">
                <p className="text-[0.9rem] text-white/40 leading-[1.7] mb-3">
                  Navigate to the{" "}
                  <Link href="/dashboard/projects" className="text-white/70 underline">
                    Projects &amp; Keys
                  </Link>{" "}
                  hub and click <strong className="text-white/70">New Project</strong>. ARGUS will instantly generate a
                  globally unique API key. This key is your project&apos;s identity; the ingestion engine uses it to
                  automatically route telemetry to your isolated workspace.
                </p>
                <CodeBlock code={`argus_live_aBcDeFgHiJkLmNoPqRsTuVwXyZ_0123456789`} />
              </Step>

              <Step n={3} title="Ingest & Verify">
                <p className="text-[0.9rem] text-white/40 leading-[1.7] mb-3">
                  Execute a test event using the curl snippet below. Once you receive the
                  <code className="font-mono bg-white/[0.06] px-1.5 rounded mx-1.5">202 Accepted</code>
                  response, visit your project-specific dashboard to see the data point in the
                  <strong> Event Inspector</strong> (real-time audit log).
                </p>
                <CodeBlock code={CURL_SNIPPET} lang="bash" />
              </Step>
            </Section>
          </div>

          {/* Event Schema */}
          <div id="schema">
            <Section title="Event Schema" sub="API Reference">
              <p className="text-[0.9rem] text-white/40 leading-[1.7] mb-5">
                All events are sent to <code className="font-mono bg-white/[0.06] px-2 rounded text-[0.85rem]">POST /api/events</code> with header <code className="font-mono bg-white/[0.06] px-2 rounded text-[0.85rem]">X-API-Key</code>.
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse text-[0.85rem]">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      {["Field", "Type", "Required", "Description"].map((h) => (
                        <th key={h} className="px-3.5 py-2.5 text-left font-mono text-[0.65rem] tracking-wider text-white/30 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["eventId", "string (UUID)", "✅", "Unique ID for the event"],
                      ["eventType", "string", "✅", "page_view · click · api_call · error · signup · purchase · service_health"],
                      ["timestamp", "ISO 8601 string", "✅", "When the event occurred"],
                      ["sessionId", "string", "✅", "Browser/session identifier"],
                      ["userId", "string", "—", "Authenticated user ID (if any)"],
                      ["url", "string", "—", "Page URL or API path"],
                      ["service", "string", "—", "Name of the service sending the event"],
                      ["statusCode", "integer (100–599)", "—", "HTTP status code"],
                      ["latency", "integer (ms)", "—", "Response time in milliseconds"],
                      ["browser", "string", "—", "Browser name"],
                      ["device", "string", "—", "desktop · mobile · tablet · server"],
                      ["os", "string", "—", "Operating system"],
                      ["data", "object", "—", "Any extra key/value data"],
                      ["error", "object", "—", "Error details (message, stack, etc.)"],
                    ].map(([field, type, req, desc]) => (
                      <tr key={field} className="border-b border-white/[0.04]">
                        <td className="px-3.5 py-2.5 font-mono text-[0.8rem] text-white/70">{field}</td>
                        <td className="px-3.5 py-2.5 font-mono text-[0.78rem] text-white/[0.35]">{type}</td>
                        <td className={`px-3.5 py-2.5 text-[0.8rem] ${req === "✅" ? "text-green-400/80" : "text-white/20"}`}>{req}</td>
                        <td className="px-3.5 py-2.5 text-[0.82rem] text-white/[0.35] leading-relaxed">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-3.5 bg-white/[0.02] border border-white/[0.06] rounded-[10px]">
                <p className="font-mono text-[0.72rem] text-white/30 mb-1.5">RESPONSE CODES</p>
                <div className="flex flex-col gap-1.5">
                  {[["202 Accepted", "Event queued"], ["400 Bad Request", "Validation failed (field errors in body)"], ["401 Unauthorized", "Missing or invalid API key"], ["429 Too Many Requests", "Rate limit exceeded (50 req/s per IP, 5000/s per key)"]].map(([code, desc]) => (
                    <div key={code} className="flex gap-3 text-[0.83rem]">
                      <code className="font-mono text-white/60 min-w-[140px]">{code}</code>
                      <span className="text-white/30">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>

          {/* JS */}
          <div id="js">
            <Section title="JavaScript / Browser" sub="Integration">
              <p className="text-[0.9rem] text-white/40 leading-[1.7] mb-5">
                Drop this file into your project. No npm package needed — just a tiny fetch wrapper.
              </p>
              <CodeBlock code={JS_SNIPPET} lang="javascript — argus.js" />
              <p className="text-[0.88rem] font-semibold text-white/60 mb-3">Then use it anywhere:</p>
              <CodeBlock code={JS_USAGE} lang="javascript" />
            </Section>
          </div>

          {/* Python */}
          <div id="python">
            <Section title="Python" sub="Integration">
              <CodeBlock code={PYTHON_SNIPPET} lang="python" />
            </Section>
          </div>

          {/* Node */}
          <div id="node">
            <Section title="Node.js / Express" sub="Integration">
              <p className="text-[0.9rem] text-white/40 leading-[1.7] mb-5">
                Use as an Express middleware to auto-track every API call with zero boilerplate.
              </p>
              <CodeBlock code={NODE_SNIPPET} lang="node.js" />
            </Section>
          </div>

          {/* Slack Alerts */}
          <div id="slack">
            <Section title="Slack Alerts" sub="Monitoring">
              <p className="text-[0.9rem] text-white/40 leading-[1.7] mb-5">
                Receive real-time notifications in Slack for critical events or specific status codes.
              </p>
              <Step n={1} title="Create an Incoming Webhook">
                <p className="text-[0.9rem] text-white/40 leading-[1.7] mb-3">
                  Go to your Slack App settings, enable <strong>Incoming Webhooks</strong>, and create a new webhook for your desired channel. Copy the generated URL.
                </p>
              </Step>
              <Step n={2} title="Configure in ARGUS">
                <p className="text-[0.9rem] text-white/40 leading-[1.7] mb-4">
                  Navigate to the <Link href="/dashboard/settings" className="text-white/70 underline">Settings</Link> page, select your project, and paste the Webhook URL. Toggle &quot;Alert on 5xx Errors&quot; to get notified of server failures automatically.
                </p>
                <div className="px-5 py-3.5 bg-green-400/[0.05] border border-green-400/15 rounded-xl mb-3">
                  <p className="text-[0.85rem] text-green-400 m-0 flex items-center gap-2">
                    <Shield size={14} /> <strong>Pro-tip:</strong> You can even set this up with a dummy URL to see the UI in action before deciding on your Slack channel.
                  </p>
                </div>
              </Step>
              <Step n={3} title="Verify Setup">
                <p className="text-[0.9rem] text-white/40 leading-[1.7] mb-3">
                  Click <strong>Send Test Alert</strong>. ARGUS will send a Block Kit formatted message to your channel to confirm the connection is active.
                </p>
                <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-green-400/10 to-electric/10 border border-white/10">
                  <h4 className="text-[0.95rem] font-bold mb-2">Ready to automate?</h4>
                  <p className="text-[0.85rem] text-white/50 mb-4">Set up your Slack URL in seconds to keep your team informed of every critical error.</p>
                  <Link
                    href="/dashboard/settings"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold no-underline hover:opacity-90 transition-opacity"
                  >
                    Configure Slack Now <MessageSquare size={14} />
                  </Link>
                </div>
              </Step>
            </Section>
          </div>

          {/* CTA */}
          <div className="p-8 md:p-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-white mb-3">
              Ready to ship?
            </h2>
            <p className="text-[0.9rem] text-white/[0.35] mb-7 leading-[1.7]">
              Create an account, get your API key, and start streaming events in under a minute.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white text-black rounded-[10px] no-underline text-[0.95rem] font-bold hover:opacity-90 transition-opacity"
            >
              Get Started <ChevronRight size={14} />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}