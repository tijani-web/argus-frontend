import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "ARGUS — Real-Time Event Analytics",
  description:
    "Observe the Invisible. Real-Time. A reactive event analytics and observability platform powered by Spring WebFlux, Kafka, and TimescaleDB.",
  keywords: ["event analytics", "observability", "real-time", "kafka", "timescaledb", "telemetry", "streaming"],
  openGraph: {
    title: "ARGUS — Real-Time Event Analytics",
    description: "Observe the Invisible. Real-Time. A reactive event analytics platform.",
    url: "https://argus-frontend-eight.vercel.app/",
    siteName: "ARGUS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARGUS — Real-Time Event Analytics",
    description: "Observe the Invisible in Real-Time.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
