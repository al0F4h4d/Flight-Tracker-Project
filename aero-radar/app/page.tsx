"use client";

import dynamic from "next/dynamic";
import FlightSidebar from "../components/sidebar/FlightSidebar";
import FlightDetailSheet from "../components/flight-detail/FlightDetailSheet";
import WelcomeOverlay from "../components/common/WelcomeOverlay";

// Leaflet map must be client-side only (uses browser window/DOM APIs)
const FlightMap = dynamic(() => import("../components/map/FlightMap"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: "#0B0F19" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="animate-radar-ping w-8 h-8 rounded-full"
          style={{ background: "#06B6D4", opacity: 0.6 }}
        />
        <p className="font-mono text-sm" style={{ color: "#06B6D4" }}>
          Initializing Radar…
        </p>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  return (
    <main
      className="relative w-full h-full overflow-hidden"
      style={{ background: "#0B0F19" }}
    >
      {/* Welcome Splash Message from FAHAD on first load or reload */}
      <WelcomeOverlay />

      {/* Full-screen radar map */}
      <FlightMap />

      {/* Floating left sidebar with live flight list */}
      <FlightSidebar />

      {/* Slide-over cockpit detail panel */}
      <FlightDetailSheet />
    </main>
  );
}
