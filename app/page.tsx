"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StreamVisualizer } from "@/components/StreamVisualizer";
import {
  Zap,
  Shield,
  Globe,
  BarChart3,
  Activity,
  Key,
  ChevronRight,
  Github,
  ArrowDown,
  Database,
  Layers,
  GitBranch,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/store";

const features = [
  {
    icon: Zap,
    title: "Sub-millisecond Ingestion",
    description:
      "Spring WebFlux reactive pipeline absorbs millions of events per second. Non-blocking from edge to storage.",
  },
  {
    icon: Key,
    title: "Project-scoped API Keys",
    description:
      "Each project gets an isolated API key with fine-grained scoping. Zero cross-tenant data leakage.",
  },
  {
    icon: Globe,
    title: "Geo-IP Attribution",
    description:
      "Country-level routing, anomaly detection, and compliance enforcement — resolved on every event.",
  },
  {
    icon: Shield,
    title: "Built-in Rate Limiting",
    description:
      "Redis token-bucket limiter protects your pipeline automatically. No SDK changes required.",
  },
  {
    icon: BarChart3,
    title: "TimescaleDB Aggregation",
    description:
      "Continuous aggregations materialize time-series buckets. Query 100 million rows in under 100ms.",
  },
  {
    icon: Activity,
    title: "Live Redis Counters",
    description:
      "Total events, error rates, and type distributions updated in real time on every ingested event.",
  },
];

const stack = [
  { name: "Spring WebFlux", icon: Layers, desc: "Reactive HTTP" },
  { name: "Apache Kafka", icon: GitBranch, desc: "Event Streaming" },
  { name: "TimescaleDB", icon: Database, desc: "Time-Series" },
  { name: "Redis", icon: Zap, desc: "Live Counters" },
];

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* ===== NAVBAR ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ease ${scrollY > 30
            ? "bg-black/88 backdrop-blur-xl border-b border-zinc-800/80"
            : "bg-transparent border-b border-transparent"
          }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 h-[60px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-heading font-black text-sm text-black">
              A
            </div>
            <span className="font-mono font-bold text-sm text-white/90 tracking-wider">
              ARGUS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {[{ label: "Features", href: "#features" }, { label: "Docs", href: "/docs" }].map((item) => (
              <Link
                prefetch={false}
                key={item.label}
                href={item.href}
                className="text-white/45 hover:text-white/90 text-sm font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <a
              href="https://github.com/tijani-web/argus"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-white/10 text-white/50 hover:border-white/25 hover:text-white/90 transition-all duration-200"
            >
              <Github size={15} />
            </a>

            {user ? (
              <>
                <div className="hidden lg:block">
                  <div className="px-3 py-1.5 text-white/50 text-sm font-mono truncate max-w-[150px]">
                    {user.email}
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="px-4 py-1.5 bg-white rounded-lg text-black text-sm font-semibold flex items-center gap-1.5 hover:opacity-85 transition-opacity duration-200"
                >
                  Dashboard <ChevronRight size={13} />
                </Link>
              </>
            ) : (
              <>
                <Link
                  prefetch={false}
                  href="/auth"
                  className="px-4 py-1.5 border border-white/12 rounded-lg text-white/80 text-sm font-medium hover:border-white/30 hover:text-white transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  prefetch={false}
                  href="/auth"
                  className="px-4 py-1.5 bg-white rounded-lg text-black text-sm font-semibold flex items-center gap-1.5 hover:opacity-85 transition-opacity duration-200"
                >
                  Get Started <ChevronRight size={13} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-[60px] left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-zinc-800/80 transition-all duration-300 ease overflow-hidden ${mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="flex flex-col py-4 px-4 gap-3">
            {/* Mobile Nav Links */}
            {[{ label: "Features", href: "#features" }, { label: "Docs", href: "/docs" }].map((item) => (
              <Link
                prefetch={false}
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className="text-white/70 hover:text-white text-base font-medium py-2 px-3 rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}

            <div className="h-px bg-white/10 my-2" />

            {/* Mobile GitHub Link */}
            <a
              href="https://github.com/tijani-web/argus"
              target="_blank"
              rel="noreferrer"
              onClick={handleLinkClick}
              className="flex items-center gap-3 text-white/70 hover:text-white text-base font-medium py-2 px-3 rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              <Github size={18} />
              GitHub
            </a>

            <div className="h-px bg-white/10 my-2" />

            {/* Mobile Auth Buttons */}
            {user ? (
              <>
                <div className="py-2 px-3 text-white/50 text-sm font-mono truncate">
                  {user.email}
                </div>
                <Link
                  href="/dashboard"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white rounded-lg text-black font-semibold hover:opacity-85 transition-opacity duration-200"
                >
                  Go to Dashboard <ChevronRight size={15} />
                </Link>
              </>
            ) : (
              <>
                <Link
                  prefetch={false}
                  href="/auth"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-white/20 rounded-lg text-white/80 font-medium hover:border-white/40 hover:text-white transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  prefetch={false}
                  href="/auth"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white rounded-lg text-black font-semibold hover:opacity-85 transition-opacity duration-200"
                >
                  Get Started <ChevronRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Add padding to prevent content from hiding under fixed navbar */}
      <div className="pt-[60px]" />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Background radial */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[min(900px,90vw)] h-[min(900px,90vw)] rounded-full bg-[radial-gradient(circle,rgba(0,209,255,0.05)_0%,transparent_65%)] pointer-events-none"
        />

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 sm:mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00d1ff] shadow-[0_0_6px_#00d1ff]" />
          <span className="font-mono text-[0.55rem] sm:text-[0.6rem] md:text-xs text-white/55 tracking-wider whitespace-nowrap overflow-x-auto max-w-full px-1">
            REAL-TIME EVENT ANALYTICS & OBSERVABILITY
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(2.5rem,9vw,7rem)] font-black tracking-tighter text-white max-w-full">
          <span className="block">
            <span className="text-white/90">Observ</span>
            <span className="inline-flex items-center justify-center w-[clamp(38px,11vw,88px)] h-[clamp(38px,11vw,88px)] rounded-full bg-white text-black font-black text-[clamp(1.3rem,4.5vw,3.2rem)] tracking-tighter mx-[-2px] sm:mx-[-4px] align-middle relative top-[-0.06em] shadow-[0_0_40px_rgba(0,209,255,0.2)]">
              A
            </span>
            <span className="text-white/90">tion</span>
          </span>
          <span className="block text-white/22 text-[clamp(1.8rem,7vw,5.2rem)] tracking-tighter mt-1 sm:mt-2">
            at the speed of now.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-[clamp(0.85rem,3.8vw,1.15rem)] text-white/45 max-w-[min(560px,100%)] mt-6 sm:mt-8 md:mt-10 leading-relaxed px-2">
          A reactive ingestion pipeline built on Spring WebFlux, Apache Kafka,
          and TimescaleDB. Every event captured, aggregated, and queryable
          in real time — at any scale.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center mt-8 sm:mt-10 md:mt-12 px-4">
          <Link
            prefetch={false}
            href="/auth"
            className="px-4 sm:px-6 md:px-7 py-2 sm:py-2.5 md:py-3 bg-white text-black rounded-xl text-sm sm:text-base font-bold flex items-center gap-1.5 hover:opacity-85 hover:scale-102 transition-all duration-200 whitespace-nowrap"
          >
            Start Building <ChevronRight size={14} />
          </Link>
          <Link
            prefetch={false}
            href="/dashboard"
            className="px-4 sm:px-6 md:px-7 py-2 sm:py-2.5 md:py-3 border border-white/14 text-white/75 rounded-xl text-sm sm:text-base font-medium flex items-center gap-1.5 hover:border-white/30 hover:text-white transition-all duration-200 whitespace-nowrap"
          >
            View Dashboard
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30 animate-[float-up_2.5s_ease-in-out_infinite]">
          <span className="text-[0.55rem] sm:text-[0.6rem] tracking-wider text-white font-mono">SCROLL</span>
          <ArrowDown size={11} color="#fff" />
        </div>
      </section>

      {/* ===== STREAM VISUALIZER SECTION ===== */}
      <section className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] min-h-[400px] sm:min-h-[450px] md:min-h-[500px] overflow-hidden border-y border-white/5">
        {/* Section label */}
        <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 lg:left-12 z-20">
          <p className="font-mono text-[0.55rem] sm:text-[0.6rem] text-white/30 tracking-wider uppercase mb-1">
            Live Pipeline
          </p>
          <h2 className="text-xs sm:text-sm md:text-base font-bold text-white/70 tracking-tight">
            Events flowing through
            <br />
            the ingestion engine.
          </h2>
        </div>

        {/* Fades */}
        <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-b from-black to-transparent z-5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-black to-transparent z-5 pointer-events-none" />

        <StreamVisualizer />
      </section>

      {/* ===== FEATURE GRID ===== */}
      <section id="features" className="px-4 py-12 sm:py-16 md:py-20 lg:py-24 max-w-7xl mx-auto">
        <div className="mb-10 sm:mb-12 md:mb-16 max-w-full">
          <p className="font-mono text-[0.6rem] sm:text-[0.65rem] text-white/30 tracking-wider uppercase mb-2 sm:mb-3">
            Capabilities
          </p>
          <h2 className="text-[clamp(1.5rem,5vw,2.8rem)] font-extrabold tracking-tight text-white leading-tight">
            Production-ready observability,
            <br className="hidden sm:block" />
            without the overhead.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-4 sm:p-5 md:p-6 rounded-xl border border-zinc-800/80 bg-white/2 hover:border-zinc-700 hover:bg-white/4 transition-all duration-250 cursor-default"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/6 border border-zinc-800 flex items-center justify-center mb-3 sm:mb-4 md:mb-5">
                <feature.icon size={15} className="text-white/75" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 text-white/90">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/40 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== STACK SECTION ===== */}
      <section className="border-t border-white/5 py-6 sm:py-8 md:py-10 px-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        <span className="font-mono text-[0.55rem] sm:text-[0.6rem] text-white/25 tracking-wider uppercase">
          Powered by
        </span>
        {stack.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5 sm:gap-2">
            <s.icon size={12} className="text-white/30" />
            <span className="text-[0.7rem] sm:text-xs md:text-sm font-medium text-white/45">
              {s.name}
            </span>
          </div>
        ))}
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="border-t border-white/5 py-12 sm:py-16 md:py-20 lg:py-24 px-4 text-center">
        <h2 className="text-[clamp(1.6rem,6vw,3.4rem)] font-black tracking-tighter text-white mb-3 sm:mb-4 leading-tight">
          Ready to observe
          <br />
          <span className="text-white/30">everything?</span>
        </h2>
        <p className="text-sm sm:text-base text-white/40 max-w-[min(420px,100%)] mx-auto mb-6 sm:mb-8 md:mb-9 leading-relaxed px-4">
          Create a project, get your API key, and start streaming events in under a minute.
        </p>
        <Link
          href="/auth"
          className="inline-flex items-center gap-1.5 px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 bg-white text-black rounded-xl text-sm sm:text-base font-bold hover:opacity-85 transition-opacity duration-200"
        >
          Get Started <ChevronRight size={14} />
        </Link>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-5 sm:py-6 md:py-8 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-center">
        <span className="font-mono text-[0.65rem] sm:text-xs text-white/20 tracking-wider">
          ARGUS
        </span>
        <span className="font-mono text-[0.6rem] sm:text-[0.65rem] text-white/15 text-center">
          Spring WebFlux · Kafka · TimescaleDB · Redis
        </span>
      </footer>

    </div>
  );
}