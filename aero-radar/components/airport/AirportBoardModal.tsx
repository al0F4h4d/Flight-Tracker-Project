"use client";
import { useState, useEffect } from "react";
import { X, Clock, Wind, Thermometer, Eye, Plane } from "lucide-react";
import type { AirportSchedule } from "../../types/airport";
import { useFlightSelection } from "../../hooks/useFlightSelection";

interface Props {
  airportIata: string;
  onClose: () => void;
}

export default function AirportBoardModal({ airportIata, onClose }: Props) {
  const [schedule, setSchedule] = useState<AirportSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"departures" | "arrivals">("departures");
  const { openFlight } = useFlightSelection();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/airports/${airportIata}`)
      .then((r) => r.json())
      .then((j) => { setSchedule(j.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [airportIata]);

  const handleFlightClick = (flightId: string) => {
    openFlight(flightId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div className="glass-panel w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden m-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "#1F2937" }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-bold" style={{ color: "#06B6D4" }}>{airportIata}</span>
              {schedule && (
                <span className="text-sm" style={{ color: "#94A3B8" }}>
                  {schedule.airport.name} · {schedule.airport.city}, {schedule.airport.country}
                </span>
              )}
            </div>
            {schedule?.weather && (
              <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: "#94A3B8" }}>
                <span className="flex items-center gap-1"><Thermometer size={12} />{schedule.weather.tempC}°C</span>
                <span className="flex items-center gap-1"><Wind size={12} />{schedule.weather.windSpeedKts} KTS</span>
                <span className="flex items-center gap-1"><Eye size={12} />{schedule.weather.visibilityKm} km vis</span>
                <span className="flex items-center gap-1"><Clock size={12} />
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: schedule.airport.timezone })} LT
                </span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-700 transition-colors">
            <X size={16} style={{ color: "#94A3B8" }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: "#1F2937" }}>
          {(["departures", "arrivals"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 text-sm font-semibold capitalize transition-colors"
              style={{
                color: tab === t ? "#06B6D4" : "#94A3B8",
                borderBottom: tab === t ? "2px solid #06B6D4" : "2px solid transparent",
              }}
            >
              {t} {schedule ? `(${schedule[t].length})` : ""}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-radar-ping w-4 h-4 rounded-full" style={{ background: "#06B6D4" }} />
            </div>
          ) : !schedule ? (
            <div className="text-center p-8" style={{ color: "#94A3B8" }}>Airport not found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider" style={{ color: "#94A3B8", borderBottom: "1px solid #1F2937" }}>
                  <th className="text-left p-3">Flight</th>
                  <th className="text-left p-3">Airline</th>
                  <th className="text-left p-3">{tab === "departures" ? "Destination" : "Origin"}</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Progress</th>
                </tr>
              </thead>
              <tbody>
                {schedule[tab].length === 0 ? (
                  <tr><td colSpan={5} className="text-center p-8" style={{ color: "#94A3B8" }}>No flights.</td></tr>
                ) : (
                  schedule[tab].map((f) => (
                    <tr
                      key={f.id}
                      onClick={() => handleFlightClick(f.id)}
                      className="cursor-pointer hover:bg-slate-800 transition-colors border-b"
                      style={{ borderColor: "#1F2937" }}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Plane size={12} style={{ color: "#06B6D4" }} />
                          <span className="font-mono font-bold" style={{ color: "#06B6D4" }}>{f.flightNumber}</span>
                        </div>
                      </td>
                      <td className="p-3 text-xs" style={{ color: "#94A3B8" }}>{f.airline.name}</td>
                      <td className="p-3">
                        <span className="font-mono" style={{ color: "#F1F5F9" }}>
                          {tab === "departures" ? f.destination.iata : f.origin.iata}
                        </span>
                        <span className="text-xs ml-1" style={{ color: "#94A3B8" }}>
                          {tab === "departures" ? f.destination.city : f.origin.city}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background: "#111827", color: "#10B981", border: "1px solid #1F2937" }}>
                          {f.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-xs" style={{ color: "#94A3B8" }}>
                        {f.progressPercent.toFixed(0)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
