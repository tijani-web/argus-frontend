import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Dashboard API endpoints — proxied to Spring Boot
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:8100/api/v1/:path*",
      },
      // Event ingestion endpoint
      {
        source: "/api/events",
        destination: "http://localhost:8100/api/events",
      },
      // Actuator (Prometheus health check)
      {
        source: "/actuator/:path*",
        destination: "http://localhost:8100/actuator/:path*",
      },
    ];
  },
};

export default nextConfig;
