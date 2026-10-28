"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useFlightStore } from "../../store/useFlightStore";
import { useFlightSelection } from "../../hooks/useFlightSelection";
import { Layers } from "lucide-react";

type MapLayerType = "radar" | "satellite" | "streets";

export default function FlightMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const pathLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>("radar");
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const flights = useFlightStore((s) => s.flights);
  const selectedFlightId = useFlightStore((s) => s.selectedFlightId);
  const selectedFlightDetail = useFlightStore((s) => s.selectedFlightDetail);
  const { openFlight, closeFlight } = useFlightSelection();

  // Helper to get tile configuration without any API keys
  const getTileConfig = (type: MapLayerType) => {
    switch (type) {
      case "satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          className: "",
          attribution: "&copy; Esri &mdash; Earthstar Geographics",
          maxZoom: 18,
        };
      case "streets":
        return {
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          className: "",
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        };
      case "radar":
      default:
        return {
          url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          className: "dark-radar-tiles",
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        };
    }
  };

  // Switch Tile Layer
  const setMapTileLayer = (type: MapLayerType) => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const cfg = getTileConfig(type);
    const newLayer = L.tileLayer(cfg.url, {
      className: cfg.className,
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom,
    }).addTo(map);

    tileLayerRef.current = newLayer;
    setActiveLayer(type);
    setShowLayerMenu(false);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = L.map(mapContainer.current, {
      center: [24.0, 75.0],
      zoom: 4,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
    });

    // Initial base layer (Dark Radar - 100% free, NO API key required)
    const cfg = getTileConfig("radar");
    tileLayerRef.current = L.tileLayer(cfg.url, {
      className: cfg.className,
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom,
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Layer group for flight paths
    pathLayerGroupRef.current = L.layerGroup().addTo(map);

    // Deselect on map background click
    map.on("click", (e: L.LeafletMouseEvent) => {
      const target = (e.originalEvent.target as HTMLElement) || null;
      if (
        target?.closest(".leaflet-marker-icon") ||
        target?.closest(".aircraft-marker-container")
      ) {
        return;
      }
      closeFlight();
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync Aircraft Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const activeFlightIds = new Set(Object.keys(flights));

    // Remove old/completed flights
    for (const [id, marker] of markersRef.current) {
      if (!activeFlightIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }

    // Upsert live aircraft markers
    for (const flight of Object.values(flights)) {
      const { latitude, longitude, headingDeg } = flight.telemetry;
      const isSelected = flight.id === selectedFlightId;

      const iconHtml = buildAircraftIconHtml(
        isSelected,
        flight.status,
        headingDeg
      );
      const icon = L.divIcon({
        className: "aircraft-marker-container",
        html: iconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      let marker = markersRef.current.get(flight.id);

      if (!marker) {
        marker = L.marker([latitude, longitude], { icon })
          .addTo(map)
          .on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            openFlight(flight.id);
          });

        marker.bindTooltip(
          `<strong>${flight.flightNumber}</strong> · ${flight.origin.iata} → ${flight.destination.iata}`,
          {
            direction: "top",
            offset: [0, -12],
            className: "radar-tooltip",
          }
        );

        markersRef.current.set(flight.id, marker);
      } else {
        marker.setLatLng([latitude, longitude]);
        marker.setIcon(icon);
      }
    }
  }, [flights, selectedFlightId, openFlight]);

  // Draw Trajectory Polylines when flight is selected
  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = pathLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (!selectedFlightDetail) return;

    // 1. Traveled history (Solid bright cyan)
    if (selectedFlightDetail.routeHistory.length > 1) {
      const traveledLatLngs = selectedFlightDetail.routeHistory.map((c) => [
        c.latitude,
        c.longitude,
      ] as [number, number]);

      L.polyline(traveledLatLngs, {
        color: "#06B6D4",
        weight: 3,
        opacity: 0.95,
        lineCap: "round",
      }).addTo(layerGroup);
    }

    // 2. Projected path (Dashed dim cyan)
    if (selectedFlightDetail.projectedRoute.length > 1) {
      const projectedLatLngs = selectedFlightDetail.projectedRoute.map((c) => [
        c.latitude,
        c.longitude,
      ] as [number, number]);

      L.polyline(projectedLatLngs, {
        color: "#06B6D4",
        weight: 2,
        opacity: 0.5,
        dashArray: "6, 8",
        lineCap: "round",
      }).addTo(layerGroup);
    }

    // Fly camera smoothly to selected plane
    const { latitude, longitude } = selectedFlightDetail.telemetry;
    map.flyTo([latitude, longitude], 6, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [selectedFlightDetail]);

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div
        ref={mapContainer}
        className="absolute inset-0 w-full h-full bg-[#0B0F19]"
        style={{ zIndex: 1 }}
      />

      {/* Floating Map Style Selector */}
      <div
        className={`absolute top-4 z-20 flex flex-col items-end transition-all duration-300 ${
          selectedFlightId ? "right-88" : "right-4"
        }`}
      >
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold glass-panel text-slate-200 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-lg"
          title="Switch Map Style"
        >
          <Layers size={14} className="text-cyan-400" />
          <span className="capitalize">{activeLayer} Map</span>
        </button>

        {showLayerMenu && (
          <div className="mt-2 p-1.5 rounded-lg glass-panel flex flex-col gap-1 shadow-2xl min-w-[130px] border border-slate-700/60">
            <button
              onClick={() => setMapTileLayer("radar")}
              className={`px-3 py-1.5 text-xs text-left rounded font-medium transition-colors ${
                activeLayer === "radar"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              🌙 Dark Radar
            </button>
            <button
              onClick={() => setMapTileLayer("satellite")}
              className={`px-3 py-1.5 text-xs text-left rounded font-medium transition-colors ${
                activeLayer === "satellite"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              🛰️ Satellite
            </button>
            <button
              onClick={() => setMapTileLayer("streets")}
              className={`px-3 py-1.5 text-xs text-left rounded font-medium transition-colors ${
                activeLayer === "streets"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              🗺️ OpenStreet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function buildAircraftIconHtml(
  selected: boolean,
  status: string,
  headingDeg: number
): string {
  const color = selected
    ? "#06B6D4"
    : status === "DELAYED"
    ? "#F59E0B"
    : "#10B981";
  const size = selected ? 24 : 18;
  const glow = selected
    ? `filter: drop-shadow(0 0 8px #06B6D4);`
    : `filter: drop-shadow(0 1px 3px rgba(0,0,0,0.9));`;

  return `
    <div style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
      <div style="transform: rotate(${headingDeg}deg); transition: transform 0.8s ease-out; ${glow}">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="#0B0F19" stroke-width="0.8">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
    </div>
  `;
}
