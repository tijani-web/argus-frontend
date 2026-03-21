"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  Activity,
  Home,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/projects", icon: FolderKanban, label: "Projects & Keys" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace("/auth");
    }
  }, [user, isLoading, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="font-mono text-xs text-white/20 tracking-widest">
          LOADING...
        </span>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="font-mono text-sm text-white/30 tracking-wider">
          Redirecting...
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-void">
      {/* ===== MOBILE BACKDROP ===== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-60 bg-deep border-r border-border-subtle flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-border-subtle flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-black text-[0.8rem] text-black shrink-0">
            A
          </div>
          <span className="font-mono font-bold text-[0.88rem] text-white/80 tracking-wider whitespace-nowrap">
            ARGUS
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm mb-1 no-underline whitespace-nowrap text-[0.86rem] transition-all duration-200 border border-transparent ${
                  isActive
                    ? "text-white/90 bg-white/[0.06] font-semibold"
                    : "text-white/[0.35] font-normal hover:bg-white/[0.04] hover:text-white/70"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border-subtle">
          {user ? (
            <div className="flex items-center gap-2.5 p-2.5 rounded-sm bg-white/[0.02] border border-border-subtle">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-electric/40 to-cyber/40 flex items-center justify-center text-xs font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.82rem] font-semibold text-t-primary truncate">
                  {user.name}
                </div>
                <div className="text-[0.68rem] text-t-muted font-mono truncate">
                  {user.email}
                </div>
              </div>
              <button
                onClick={logout}
                className="btn-icon shrink-0 !w-7 !h-7"
                title="Sign out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 px-3 py-2.5 text-t-muted no-underline text-[0.85rem]"
            >
              Sign In
            </Link>
          )}
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-60 transition-[margin-left] duration-300">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-[60px] bg-black/85 backdrop-blur-xl border-b border-border-subtle flex items-center px-4 md:px-7 gap-4">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="btn-icon w-[34px] h-[34px] lg:hidden"
            title="Toggle sidebar"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="flex-1" />

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-accent-green/[0.06] border border-accent-green/15 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_6px_var(--accent-green)] animate-pulse-ring" />
            <span className="font-mono text-[0.7rem] text-accent-green tracking-wider">
              LIVE
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 cursor-pointer">
            <Activity size={15} className="text-t-muted" />
            <span className="font-mono text-xs text-t-muted">
              {user?.email ?? "Not signed in"}
            </span>
            <ChevronDown size={13} className="text-t-muted" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
