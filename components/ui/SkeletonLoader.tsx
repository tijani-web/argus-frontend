"use client";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = "6px",
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`skeleton block ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function StatSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton width="60%" height={14} />
      <Skeleton width="80%" height={48} borderRadius="8px" />
      <Skeleton width="40%" height={12} />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <Skeleton width="30%" height={14} />
      <Skeleton width="100%" height={220} borderRadius="12px" />
    </div>
  );
}

export function ProjectRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4">
      <Skeleton width={40} height={40} borderRadius="10px" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton width="50%" height={14} />
        <Skeleton width="35%" height={12} />
      </div>
      <Skeleton width={80} height={28} borderRadius="99px" />
    </div>
  );
}
