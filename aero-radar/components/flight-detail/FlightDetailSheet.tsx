"use client";
import { useFlightStore } from "../../store/useFlightStore";
import { useFlightSelection } from "../../hooks/useFlightSelection";
import { formatAltitude, formatSpeed, bearingToCompass } from "../../lib/utils";
import { cn } from "../../lib/utils";
import { Plane, X, TrendingUp, TrendingDown, Minus, Gauge, Navigation, Radio, Clock, MapPin } from "lucide-react";

export default function FlightDetailSheet() {
  const { selectedFlightId, selectedFlightDetail, closeFlight } = useFlightSelection();
  const flights = useFlightStore((s) => s.flights);

  const flight = selectedFlightId ? flights[selectedFlightId] : null;
  const detail = selectedFlightDetail;

  if (!flight) return null;

  const { telemetry } = flight;
  const vspSign = telemetry.verticalSpeedFpm > 50 ? "↑" : telemetry.verticalSpeedFpm < -50 ? "↓" : "→";
  const progress = flight.progressPercent;

  return (
    <div className="absolute top-4 right-4 bottom-4 w-80 glass-panel flex flex-col overflow-hidden z-20">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b" style={{ borderColor: "#1F2937" }}>
        <div>
          <div className="flex items-center gap-2">
            <Plane size={16} style={{ color: "#06B6D4" }} />
            <span className="font-mono font-bold text-lg" style={{ color: "#06B6D4" }}>
              {flight.flightNumber}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: "#1F2937", color: "#94A3B8" }}>
              {flight.callsign}
            </span>
          </div>
          <p className="text-sm mt-0.5" style={{ color: "#94A3B8" }}>
            {flight.airline.name}
          </p>
        </div>
        <button onClick={closeFlight} className="rounded-lg p-1.5 hover:bg-slate-700 transition-colors">
          <X size={16} style={{ color: "#94A3B8" }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Route */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="font-mono font-bold text-xl" style={{ color: "#F1F5F9" }}>{flight.origin.iata}</p>
            <p className="text-xs" style={{ color: "#94A3B8" }}>{flight.origin.city}</p>
          </div>
          <div className="flex-1 mx-3 relative">
            <div className="h-px w-full" style={{ background: "#1F2937" }} />
            <div className="absolute top-0 left-0 h-px transition-all duration-500" style={{ width: `${progress}%`, background: "#06B6D4" }} />
            <Plane size={12} className="absolute -top-1.5" style={{ left: `${progress}%`, transform: "translate(-50%,0)", color: "#06B6D4" }} />
          </div>
          <div className="text-center">
            <p className="font-mono font-bold text-xl" style={{ color: "#F1F5F9" }}>{flight.destination.iata}</p>
            <p className="text-xs" style={{ color: "#94A3B8" }}>{flight.destination.city}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-lg p-3" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <div className="flex justify-between text-xs mb-1" style={{ color: "#94A3B8" }}>
            <span>Progress</span>
            <span className="font-mono" style={{ color: "#06B6D4" }}>{progress.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "#1F2937" }}>
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: "#06B6D4" }} />
          </div>
          {detail && (
            <div className="flex justify-between text-xs mt-2" style={{ color: "#94A3B8" }}>
              <span>{Math.round(detail.totalDistanceKm - detail.remainingDistanceKm)} km traveled</span>
              <span>{Math.round(detail.remainingDistanceKm)} km remaining</span>
            </div>
          )}
        </div>

        {/* Telemetry Gauges */}
        <div className="grid grid-cols-2 gap-2">
          <GaugeTile icon={<TrendingUp size={14} />} label="Altitude" value={formatAltitude(telemetry.altitudeFt)} color="#06B6D4" />
          <GaugeTile icon={<Gauge size={14} />} label="Ground Speed" value={`${Math.round(telemetry.groundSpeedKts)} KTS`} color="#10B981" />
          <GaugeTile icon={telemetry.verticalSpeedFpm > 50 ? <TrendingUp size={14} /> : telemetry.verticalSpeedFpm < -50 ? <TrendingDown size={14} /> : <Minus size={14} />} label="Vert. Speed" value={`${vspSign} ${Math.abs(telemetry.verticalSpeedFpm)} FPM`} color={telemetry.verticalSpeedFpm > 50 ? "#10B981" : telemetry.verticalSpeedFpm < -50 ? "#F59E0B" : "#94A3B8"} />
          <GaugeTile icon={<Navigation size={14} />} label="Heading" value={`${telemetry.headingDeg}° ${bearingToCompass(telemetry.headingDeg)}`} color="#F59E0B" />
        </div>

        {/* Transponder */}
        {telemetry.squawk && (
          <div className="flex items-center gap-2 rounded-lg p-3" style={{ background: "#111827", border: "1px solid #1F2937" }}>
            <Radio size={14} style={{ color: "#94A3B8" }} />
            <span className="text-xs" style={{ color: "#94A3B8" }}>Squawk</span>
            <span className="font-mono text-sm ml-auto" style={{ color: "#F1F5F9" }}>{telemetry.squawk}</span>
          </div>
        )}

        {/* Aircraft specs */}
        <div className="rounded-lg p-3 space-y-2" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#94A3B8" }}>Aircraft</p>
          <p className="text-sm" style={{ color: "#F1F5F9" }}>{flight.aircraft.model}</p>
          <div className="flex justify-between text-xs" style={{ color: "#94A3B8" }}>
            <span>Reg: <span className="font-mono" style={{ color: "#F1F5F9" }}>{flight.aircraft.registration}</span></span>
            <span>ICAO24: <span className="font-mono" style={{ color: "#F1F5F9" }}>{flight.aircraft.icao24}</span></span>
          </div>
        </div>

        {/* ETA */}
        {detail && (
          <div className="flex gap-3">
            <div className="flex-1 rounded-lg p-3 text-center" style={{ background: "#111827", border: "1px solid #1F2937" }}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock size={12} style={{ color: "#94A3B8" }} />
                <span className="text-xs" style={{ color: "#94A3B8" }}>Departed</span>
              </div>
              <p className="font-mono text-xs" style={{ color: "#F1F5F9" }}>
                {new Date(detail.scheduledDeparture).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="flex-1 rounded-lg p-3 text-center" style={{ background: "#111827", border: "1px solid #1F2937" }}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <MapPin size={12} style={{ color: "#06B6D4" }} />
                <span className="text-xs" style={{ color: "#94A3B8" }}>ETA</span>
              </div>
              <p className="font-mono text-xs" style={{ color: "#06B6D4" }}>
                {new Date(detail.estimatedArrival ?? detail.scheduledArrival).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        )}

        {/* Status */}
        <div className={cn("text-center rounded-lg p-2 text-xs font-semibold uppercase tracking-widest", getStatusClass(flight.status))}>
          {flight.status.replace("_", " ")}
        </div>
      </div>
    </div>
  );
}

function GaugeTile({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "#111827", border: "1px solid #1F2937" }}>
      <div className="flex items-center gap-1 mb-1" style={{ color: "#94A3B8" }}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-mono text-sm font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    EN_ROUTE: "bg-emerald-900 text-emerald-400",
    ACTIVE: "bg-emerald-900 text-emerald-400",
    APPROACHING: "bg-cyan-900 text-cyan-400",
    DELAYED: "bg-amber-900 text-amber-400",
    CANCELLED: "bg-red-900 text-red-400",
    DIVERTED: "bg-red-900 text-red-400",
    SCHEDULED: "bg-slate-800 text-slate-400",
    LANDED: "bg-slate-800 text-slate-400",
  };
  return map[status] ?? "bg-slate-800 text-slate-400";
}
