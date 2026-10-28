"use client";
import { useState, useMemo } from "react";
import { useFlightStore } from "../../store/useFlightStore";
import { useFlightSelection } from "../../hooks/useFlightSelection";
import { useLiveTelemetry } from "../../hooks/useLiveTelemetry";
import { formatAltitude } from "../../lib/utils";
import { Search, X, ChevronLeft, ChevronRight, Plane, Wifi, WifiOff } from "lucide-react";

export default function FlightSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [airlineFilter, setAirlineFilter] = useState<string>("");

  const flights = useFlightStore((s) => s.flights);
  const selectedFlightId = useFlightStore((s) => s.selectedFlightId);
  const isLiveConnected = useFlightStore((s) => s.isLiveConnected);
  const lastUpdated = useFlightStore((s) => s.lastUpdated);
  const { openFlight } = useFlightSelection();

  // Connect to SSE live stream
  useLiveTelemetry();

  const allFlights = useMemo(() => Object.values(flights), [flights]);

  const filtered = useMemo(() => {
    let list = allFlights;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.flightNumber.toLowerCase().includes(q) ||
          f.callsign.toLowerCase().includes(q) ||
          f.airline.name.toLowerCase().includes(q) ||
          f.origin.iata.toLowerCase().includes(q) ||
          f.destination.iata.toLowerCase().includes(q) ||
          f.origin.city.toLowerCase().includes(q) ||
          f.destination.city.toLowerCase().includes(q)
      );
    }
    if (airlineFilter) {
      list = list.filter((f) => f.airline.iata === airlineFilter);
    }
    return list.sort((a, b) => a.flightNumber.localeCompare(b.flightNumber));
  }, [allFlights, search, airlineFilter]);

  const airlines = useMemo(() => {
    const set = new Map<string, string>();
    for (const f of allFlights) set.set(f.airline.iata, f.airline.name);
    return Array.from(set.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [allFlights]);

  return (
    <div
      className="absolute top-4 left-4 bottom-4 flex flex-col z-20 transition-all duration-300"
      style={{ width: collapsed ? 48 : 320 }}
    >
      <div className="glass-panel flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b flex-shrink-0" style={{ borderColor: "#1F2937" }}>
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`absolute inline-flex h-full w-full rounded-full ${isLiveConnected ? "animate-radar-ping bg-emerald-400" : "bg-red-500"} opacity-75`} />
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isLiveConnected ? "bg-emerald-500" : "bg-red-600"}`} />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: isLiveConnected ? "#10B981" : "#EF4444" }}>
                {isLiveConnected ? "Live Radar" : "Connecting…"}
              </span>
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-mono" style={{ background: "#1F2937", color: "#06B6D4" }}>
                {filtered.length}
              </span>
            </div>
          )}
          {collapsed && (
            <div className="flex items-center justify-center w-full">
              {isLiveConnected ? <Wifi size={16} style={{ color: "#10B981" }} /> : <WifiOff size={16} style={{ color: "#EF4444" }} />}
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="ml-2 flex-shrink-0 rounded p-1 hover:bg-slate-700 transition-colors"
          >
            {collapsed ? <ChevronRight size={14} style={{ color: "#94A3B8" }} /> : <ChevronLeft size={14} style={{ color: "#94A3B8" }} />}
          </button>
        </div>

        {!collapsed && (
          <>
            {/* Search */}
            <div className="p-3 border-b flex-shrink-0" style={{ borderColor: "#1F2937" }}>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "#111827", border: "1px solid #1F2937" }}>
                <Search size={14} style={{ color: "#94A3B8" }} />
                <input
                  type="text"
                  placeholder="Search flights, airlines, cities…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none placeholder-slate-500"
                  style={{ color: "#F1F5F9" }}
                />
                {search && (
                  <button onClick={() => setSearch("")}>
                    <X size={12} style={{ color: "#94A3B8" }} />
                  </button>
                )}
              </div>

              {/* Airline filter */}
              {airlines.length > 0 && (
                <select
                  value={airlineFilter}
                  onChange={(e) => setAirlineFilter(e.target.value)}
                  className="mt-2 w-full rounded-lg px-3 py-2 text-xs outline-none"
                  style={{ background: "#111827", color: "#F1F5F9", border: "1px solid #1F2937" }}
                >
                  <option value="">All Airlines</option>
                  {airlines.map(([iata, name]) => (
                    <option key={iata} value={iata}>{name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Flight List */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32" style={{ color: "#94A3B8" }}>
                  <Plane size={24} />
                  <p className="text-sm mt-2">No flights found</p>
                </div>
              ) : (
                filtered.map((flight) => (
                  <button
                    key={flight.id}
                    onClick={() => openFlight(flight.id)}
                    className="w-full text-left p-3 border-b transition-colors hover:bg-slate-800"
                    style={{
                      borderColor: "#1F2937",
                      background: flight.id === selectedFlightId ? "rgba(6,182,212,0.08)" : undefined,
                      borderLeft: flight.id === selectedFlightId ? "2px solid #06B6D4" : "2px solid transparent",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-sm" style={{ color: flight.id === selectedFlightId ? "#06B6D4" : "#F1F5F9" }}>
                        {flight.flightNumber}
                      </span>
                      <StatusBadge status={flight.status} />
                    </div>
                    <div className="flex items-center gap-1 text-xs mb-1" style={{ color: "#94A3B8" }}>
                      <span className="font-mono">{flight.origin.iata}</span>
                      <Plane size={10} className="rotate-90" />
                      <span className="font-mono">{flight.destination.iata}</span>
                      <span className="ml-1 truncate">{flight.airline.name}</span>
                    </div>
                    <div className="flex gap-3 text-xs font-mono" style={{ color: "#94A3B8" }}>
                      <span style={{ color: "#06B6D4" }}>{formatAltitude(flight.telemetry.altitudeFt)}</span>
                      <span>{Math.round(flight.telemetry.groundSpeedKts)} KTS</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t text-center text-xs" style={{ borderColor: "#1F2937", color: "#475569" }}>
              {lastUpdated ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}` : "Connecting…"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    EN_ROUTE: { bg: "#052e16", text: "#4ade80" },
    ACTIVE: { bg: "#052e16", text: "#4ade80" },
    APPROACHING: { bg: "#0c2d39", text: "#22d3ee" },
    DELAYED: { bg: "#2d1a00", text: "#fbbf24" },
    CANCELLED: { bg: "#2d0707", text: "#f87171" },
    DIVERTED: { bg: "#2d0707", text: "#f87171" },
    SCHEDULED: { bg: "#1e293b", text: "#94a3b8" },
    LANDED: { bg: "#1e293b", text: "#94a3b8" },
  };
  const c = colors[status] ?? colors.SCHEDULED;
  return (
    <span className="px-1.5 py-0.5 rounded text-xs font-mono font-bold" style={{ background: c.bg, color: c.text }}>
      {status.replace("_", " ")}
    </span>
  );
}
