"use client";
import { create } from "zustand";
import type { FlightSummary, FlightDetail, FlightStatus, Telemetry } from "../types/flight";

interface MapViewport {
  center: [number, number];
  zoom: number;
}

interface FlightStore {
  // State
  flights: Record<string, FlightSummary>;
  selectedFlightId: string | null;
  selectedFlightDetail: FlightDetail | null;
  hoveredFlightId: string | null;
  filterSearch: string;
  filterAirline: string | null;
  filterStatus: FlightStatus | "ALL";
  isLiveConnected: boolean;
  lastUpdated: number | null;
  mapViewport: MapViewport;

  // Actions
  setFlights: (flights: FlightSummary[]) => void;
  updateFlightTelemetry: (updates: Array<{ id: string; telemetry: Telemetry; progressPercent: number }>) => void;
  selectFlight: (flightId: string | null) => void;
  setSelectedFlightDetail: (detail: FlightDetail | null) => void;
  setHoveredFlight: (flightId: string | null) => void;
  setFilterSearch: (query: string) => void;
  setFilterAirline: (airline: string | null) => void;
  setFilterStatus: (status: FlightStatus | "ALL") => void;
  setLiveConnected: (connected: boolean) => void;
  setMapViewport: (viewport: Partial<MapViewport>) => void;

  // Derived selectors
  getFilteredFlights: () => FlightSummary[];
}

export const useFlightStore = create<FlightStore>((set, get) => ({
  flights: {},
  selectedFlightId: null,
  selectedFlightDetail: null,
  hoveredFlightId: null,
  filterSearch: "",
  filterAirline: null,
  filterStatus: "ALL",
  isLiveConnected: false,
  lastUpdated: null,
  mapViewport: { center: [75.0, 24.0], zoom: 4 },

  setFlights: (flights) => {
    const map: Record<string, FlightSummary> = {};
    for (const f of flights) map[f.id] = f;
    set({ flights: map, lastUpdated: Date.now() });
  },

  updateFlightTelemetry: (updates) => {
    set((state) => {
      const updated = { ...state.flights };
      for (const u of updates) {
        if (updated[u.id]) {
          updated[u.id] = {
            ...updated[u.id],
            telemetry: u.telemetry,
            progressPercent: u.progressPercent,
          };
        }
      }
      return { flights: updated, lastUpdated: Date.now() };
    });
  },

  selectFlight: (flightId) =>
    set({ selectedFlightId: flightId, selectedFlightDetail: null }),

  setSelectedFlightDetail: (detail) => set({ selectedFlightDetail: detail }),

  setHoveredFlight: (flightId) => set({ hoveredFlightId: flightId }),

  setFilterSearch: (query) => set({ filterSearch: query }),

  setFilterAirline: (airline) => set({ filterAirline: airline }),

  setFilterStatus: (status) => set({ filterStatus: status }),

  setLiveConnected: (connected) => set({ isLiveConnected: connected }),

  setMapViewport: (viewport) =>
    set((state) => ({ mapViewport: { ...state.mapViewport, ...viewport } })),

  getFilteredFlights: () => {
    const { flights, filterSearch, filterAirline, filterStatus } = get();
    let list = Object.values(flights);

    if (filterSearch) {
      const q = filterSearch.toLowerCase();
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

    if (filterAirline) {
      list = list.filter(
        (f) =>
          f.airline.iata.toLowerCase() === filterAirline.toLowerCase() ||
          f.airline.name.toLowerCase().includes(filterAirline.toLowerCase())
      );
    }

    if (filterStatus !== "ALL") {
      list = list.filter((f) => f.status === filterStatus);
    }

    return list;
  },
}));
