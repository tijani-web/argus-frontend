"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (mode === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-10">
      {/* Subtle background grid */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Logo */}
      <div className="flex items-center gap-2 mb-12 relative">
        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-heading font-black text-[0.78rem] text-black">
          A
        </div>
        <span className="font-mono font-bold text-[0.88rem] text-white/70 tracking-wider">
          ARGUS
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-[400px] p-9 bg-white/[0.03] border border-white/[0.08] rounded-2xl relative">
        {/* Mode toggle */}
        <div className="flex bg-white/[0.04] border border-white/[0.06] rounded-[10px] p-[3px] mb-8">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-2 rounded-lg border-none font-sans font-semibold text-[0.85rem] cursor-pointer transition-all duration-200 ${
                mode === m
                  ? "bg-white/[0.08] text-white/90"
                  : "bg-transparent text-white/[0.35] hover:text-white/50"
              }`}
            >
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Headline */}
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1.5">
          {mode === "login" ? "Welcome back." : "Get started."}
        </h1>
        <p className="text-[0.85rem] text-white/[0.38] mb-7 leading-relaxed">
          {mode === "login"
            ? "Sign in to your console to view your projects and live metrics."
            : "Create an account to start ingesting events into your pipeline."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="fullname"
                autoComplete="name"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5 tracking-wide">
              Email
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5 tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="input-field pr-11"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-white/30 flex items-center p-0 hover:text-white/50 transition-colors"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[0.82rem] text-red-400/85 px-3 py-2.5 bg-red-500/[0.06] border border-red-500/[0.12] rounded-lg m-0">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-1.5 w-full py-3 rounded-[10px] font-sans font-bold text-[0.92rem] flex items-center justify-center gap-2 transition-opacity duration-200 border-none ${
              loading
                ? "bg-white/70 text-black cursor-not-allowed"
                : "bg-white text-black cursor-pointer hover:opacity-[0.88]"
            }`}
          >
            {loading ? (
              <span className="font-mono text-[0.82rem] text-black">
                Verifying...
              </span>
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Dark mode note */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-white/[0.22] font-mono">
            Dark mode — always on.
          </span>
          {/* Always-on toggle */}
          <div className="w-9 h-5 rounded-[10px] bg-white/15 flex items-center justify-end px-0.5">
            <div className="w-4 h-4 rounded-full bg-white/90" />
          </div>
        </div>
      </div>

      {/* Back link */}
      <a
        href="/"
        className="mt-7 text-[0.8rem] text-white/20 no-underline font-mono tracking-wide transition-colors duration-200 hover:text-white/50"
      >
        ← Back to home
      </a>
    </div>
  );
}
