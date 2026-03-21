"use client";

import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function GlassCard({
  children,
  className = "",
  onClick,
  hoverable = false,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${onClick ? "cursor-pointer" : "cursor-default"} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
