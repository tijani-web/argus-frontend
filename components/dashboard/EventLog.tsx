"use client";

import { useState } from "react";
import { RawEvent } from "@/lib/api";
import { ChevronDown, ChevronRight, Clock } from "lucide-react";

export function EventLog({ events, isLoading }: { events: RawEvent[]; isLoading: boolean }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading && events.length === 0) {
    return (
      <div className="py-10 text-center text-white/20">
        <p className="font-mono text-sm">Listening for events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-10 text-center text-white/15">
        <p className="font-mono text-sm">No events captured yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-px bg-white/[0.02] rounded-xl overflow-hidden border border-border-subtle">
      {events.map((event, i) => {
        const id = `${event.time}-${i}`;
        const isExpanded = expandedId === id;
        const isError = event.event_type.toLowerCase().includes("error");

        return (
          <div key={id} className={`border-b border-white/[0.03] ${isExpanded ? "bg-white/[0.02]" : ""}`}>
            <div
              onClick={() => setExpandedId(isExpanded ? null : id)}
              className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors duration-200 ${
                !isExpanded ? "hover:bg-white/[0.01]" : ""
              }`}
            >
              <div className="flex items-center justify-center w-3.5">
                {isExpanded ? <ChevronDown size={14} className="text-white/30" /> : <ChevronRight size={14} className="text-white/30" />}
              </div>

              <div
                className={`w-[7px] h-[7px] rounded-full ${
                  isError ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]" : "bg-accent-green shadow-[0_0_8px_rgba(0,255,136,0.2)]"
                }`}
              />

              <span className={`font-mono text-xs font-semibold min-w-[140px] ${isExpanded ? "text-white" : "text-white/70"}`}>
                {event.event_type}
              </span>

              <span className="flex items-center gap-1.5 font-mono text-[0.7rem] text-white/25">
                <Clock size={11} />
                {new Date(event.time).toLocaleTimeString()}
              </span>

              <div className="flex-1" />

              <span className="text-[0.65rem] text-white/10 font-mono tracking-wider">
                {(event.payload as any)?.id ? `REQ_${(event.payload as any).id.slice(0,6)}` : `EV_${i}`}
              </span>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 pl-[42px]">
                <div className="bg-black/50 p-4 rounded-lg border border-white/[0.05] font-mono text-[0.78rem] leading-relaxed text-white/50 whitespace-pre-wrap overflow-x-auto max-h-[400px]">
                  {JSON.stringify(event.payload, null, 2)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
