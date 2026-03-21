import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8100";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Dashboard API endpoints — proxied to Spring Boot
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
      // Event ingestion endpoint
      {
        source: "/api/events",
        destination: `${backendUrl}/api/events`,
      },
      // Actuator (Prometheus health check)
      {
        source: "/actuator/:path*",
        destination: `${backendUrl}/actuator/:path*`,
      },
    ];
  },
};

export default nextConfig;
