import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroRadar — Live Flight Tracker",
  description:
    "Real-time global flight tracking radar built with Next.js and MapLibre GL. Track flights, telemetry, and airport schedules.",
  keywords: ["flight tracker", "live radar", "aviation", "ADS-B", "MapLibre"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full w-full overflow-hidden bg-radar-bg text-slate-100">
        {children}
      </body>
    </html>
  );
}
