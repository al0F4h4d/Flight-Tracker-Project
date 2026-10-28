"use client";
import { useCallback } from "react";
import { useFlightStore } from "../store/useFlightStore";
import type { FlightDetail } from "../types/flight";

export function useFlightSelection() {
  const selectedFlightId = useFlightStore((s) => s.selectedFlightId);
  const selectedFlightDetail = useFlightStore((s) => s.selectedFlightDetail);
  const selectFlight = useFlightStore((s) => s.selectFlight);
  const setSelectedFlightDetail = useFlightStore((s) => s.setSelectedFlightDetail);

  const openFlight = useCallback(
    async (flightId: string) => {
      selectFlight(flightId);
      try {
        const res = await fetch(`/api/flights/${flightId}`);
        if (res.ok) {
          const json = await res.json();
          setSelectedFlightDetail(json.data as FlightDetail);
        }
      } catch { /* ignore */ }
    },
    [selectFlight, setSelectedFlightDetail]
  );

  const closeFlight = useCallback(() => {
    selectFlight(null);
    setSelectedFlightDetail(null);
  }, [selectFlight, setSelectedFlightDetail]);

  return { selectedFlightId, selectedFlightDetail, openFlight, closeFlight };
}
