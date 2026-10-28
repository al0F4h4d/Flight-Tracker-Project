"use client";
import { useEffect, useRef, useCallback } from "react";
import { useFlightStore } from "../store/useFlightStore";
import type { FlightSummary } from "../types/flight";

const MAX_BACKOFF_MS = 30_000;
const BASE_BACKOFF_MS = 2_000;
const POLL_INTERVAL_MS = 5_000;

export function useLiveTelemetry() {
  const setFlights = useFlightStore((s) => s.setFlights);
  const setLiveConnected = useFlightStore((s) => s.setLiveConnected);

  const esRef = useRef<EventSource | null>(null);
  const backoffRef = useRef(BASE_BACKOFF_MS);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isUnmountedRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    const poll = async () => {
      if (isUnmountedRef.current) return;
      try {
        const res = await fetch("/api/flights");
        if (res.ok) {
          const json = await res.json();
          setFlights(json.data as FlightSummary[]);
          setLiveConnected(true);
        }
      } catch {
        setLiveConnected(false);
      }
    };
    poll();
    pollIntervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
  }, [setFlights, setLiveConnected, stopPolling]);

  const connectSSE = useCallback(() => {
    if (isUnmountedRef.current) return;
    if (esRef.current) esRef.current.close();

    const es = new EventSource("/api/flights/live-stream");
    esRef.current = es;

    es.addEventListener("telemetry", (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        setFlights(payload.flights as FlightSummary[]);
        setLiveConnected(true);
        backoffRef.current = BASE_BACKOFF_MS;
        stopPolling(); // SSE working — stop polling fallback
      } catch { /* ignore */ }
    });

    es.onerror = () => {
      es.close();
      esRef.current = null;
      setLiveConnected(false);

      if (isUnmountedRef.current) return;

      // Start polling fallback
      startPolling();

      // Schedule SSE reconnect with exponential backoff
      reconnectTimerRef.current = setTimeout(() => {
        if (!isUnmountedRef.current) connectSSE();
      }, backoffRef.current);

      backoffRef.current = Math.min(backoffRef.current * 2, MAX_BACKOFF_MS);
    };
  }, [setFlights, setLiveConnected, startPolling, stopPolling]);

  useEffect(() => {
    isUnmountedRef.current = false;

    if (typeof EventSource !== "undefined") {
      connectSSE();
    } else {
      // No SSE support — go straight to polling
      startPolling();
    }

    return () => {
      isUnmountedRef.current = true;
      if (esRef.current) { esRef.current.close(); esRef.current = null; }
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      stopPolling();
    };
  }, [connectSSE, startPolling, stopPolling]);
}
