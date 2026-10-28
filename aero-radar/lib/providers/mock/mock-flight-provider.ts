/**
 * Mock Flight Provider — in-memory physics-based flight simulation engine.
 * Implements IFlightDataProvider.
 */
import type { IFlightDataProvider, ProviderStatus } from "../../contracts/flight-provider.interface";
import type { FlightSummary, FlightDetail, FlightFilterParams, BoundingBox, Telemetry } from "../../../types/flight";
import type { AirportSchedule } from "../../../types/airport";
import type { Coordinates } from "../../../types/airport";
import {
  haversineDistanceKm,
  calculateBearing,
  interpolateGreatCircle,
  generateGreatCircleArc,
  estimateAltitudeProfile,
  remainingDistanceKm,
} from "../../simulation/geo-math";
import { AIRPORTS, getAirport } from "./mock-airports-data";
import { ROUTE_TEMPLATES } from "./mock-flights-data";

// ── Simulation State ──────────────────────────────────────────────────────────

interface SimFlight {
  template: (typeof ROUTE_TEMPLATES)[number];
  progressPercent: number;     // 0–100
  totalDistanceKm: number;
  routeArc: Coordinates[];     // full Great Circle arc (60 pts)
  lastTickMs: number;
}

const simState = new Map<string, SimFlight>();

function initSimulation(): void {
  if (simState.size > 0) return;

  for (const t of ROUTE_TEMPLATES) {
    const origin = AIRPORTS[t.originIata];
    const destination = AIRPORTS[t.destinationIata];
    if (!origin || !destination) continue;

    const originCoord: Coordinates = { latitude: origin.latitude, longitude: origin.longitude, altitudeFt: 0 };
    const destCoord: Coordinates = { latitude: destination.latitude, longitude: destination.longitude, altitudeFt: 0 };
    const arc = generateGreatCircleArc(originCoord, destCoord, 60);
    const totalDistanceKm = haversineDistanceKm(origin.latitude, origin.longitude, destination.latitude, destination.longitude);

    simState.set(t.id, {
      template: t,
      progressPercent: t.initialProgress * 100,
      totalDistanceKm,
      routeArc: arc,
      lastTickMs: Date.now(),
    });
  }
}

/** Advance all flights based on elapsed real time. */
function tickSimulation(): void {
  const now = Date.now();
  for (const [id, sim] of simState) {
    const elapsedSec = (now - sim.lastTickMs) / 1000;
    sim.lastTickMs = now;

    const speedKmh = sim.template.cruiseSpeedKts * 1.852;
    const distancePerTickKm = (speedKmh / 3600) * elapsedSec;
    const progressIncrement = (distancePerTickKm / sim.totalDistanceKm) * 100;

    sim.progressPercent += progressIncrement;

    if (sim.progressPercent >= 100) {
      // Flip direction (turn around)
      const t = sim.template;
      const [newOrigin, newDest] = [t.destinationIata, t.originIata];

      const origin = AIRPORTS[newOrigin];
      const destination = AIRPORTS[newDest];
      if (origin && destination) {
        const originCoord: Coordinates = { latitude: origin.latitude, longitude: origin.longitude, altitudeFt: 0 };
        const destCoord: Coordinates = { latitude: destination.latitude, longitude: destination.longitude, altitudeFt: 0 };
        sim.routeArc = generateGreatCircleArc(originCoord, destCoord, 60);
        sim.totalDistanceKm = haversineDistanceKm(origin.latitude, origin.longitude, destination.latitude, destination.longitude);

        // Update template references (swap origin/dest)
        const newTemplate = { ...t, originIata: newOrigin, destinationIata: newDest };
        sim.template = newTemplate;
        sim.progressPercent = 0;

        simState.set(id, sim);
      }
    }
  }
}

function buildFlightSummary(sim: SimFlight): FlightSummary {
  const fraction = sim.progressPercent / 100;
  const arcIndex = Math.min(
    Math.floor(fraction * (sim.routeArc.length - 1)),
    sim.routeArc.length - 2
  );
  const arcFraction = fraction * (sim.routeArc.length - 1) - arcIndex;

  const current = interpolateGreatCircle(
    sim.routeArc[arcIndex],
    sim.routeArc[arcIndex + 1],
    arcFraction
  );

  const nextIndex = Math.min(arcIndex + 1, sim.routeArc.length - 1);
  const heading = calculateBearing(
    current.latitude,
    current.longitude,
    sim.routeArc[nextIndex].latitude,
    sim.routeArc[nextIndex].longitude
  );

  const altitude = estimateAltitudeProfile(fraction, sim.template.cruiseAltitudeFt);

  // Vertical speed: positive when climbing, negative when descending
  let verticalSpeedFpm = 0;
  if (fraction < 0.15) verticalSpeedFpm = 1800;
  else if (fraction > 0.8) verticalSpeedFpm = -1400;

  const origin = AIRPORTS[sim.template.originIata];
  const destination = AIRPORTS[sim.template.destinationIata];

  const telemetry: Telemetry = {
    latitude: current.latitude,
    longitude: current.longitude,
    altitudeFt: altitude,
    headingDeg: Math.round(heading),
    groundSpeedKts: sim.template.cruiseSpeedKts,
    verticalSpeedFpm,
    squawk: "2315",
    timestamp: Date.now(),
  };

  const status =
    fraction < 0.03 ? "SCHEDULED" :
    fraction < 0.12 ? "ACTIVE" :
    fraction > 0.90 ? "APPROACHING" :
    "EN_ROUTE";

  return {
    id: sim.template.id,
    flightNumber: sim.template.flightNumber,
    callsign: sim.template.callsign,
    airline: sim.template.airline,
    aircraft: sim.template.aircraft,
    origin: {
      iata: origin!.iata, icao: origin!.icao,
      name: origin!.name, city: origin!.city,
      country: origin!.country, timezone: origin!.timezone,
    },
    destination: {
      iata: destination!.iata, icao: destination!.icao,
      name: destination!.name, city: destination!.city,
      country: destination!.country, timezone: destination!.timezone,
    },
    status,
    telemetry,
    progressPercent: Math.round(sim.progressPercent * 10) / 10,
  };
}

// ── Provider Implementation ───────────────────────────────────────────────────

export class MockFlightProvider implements IFlightDataProvider {
  readonly providerName = "MOCK_SIMULATOR";

  constructor() {
    initSimulation();
  }

  async getLiveFlights(params?: FlightFilterParams | BoundingBox): Promise<FlightSummary[]> {
    tickSimulation();

    let flights = Array.from(simState.values())
      .filter(s => s.totalDistanceKm > 0)
      .map(buildFlightSummary);

    // Apply bounding box filter
    const bounds = params as BoundingBox | undefined;
    if (bounds && "minLat" in bounds) {
      flights = flights.filter(f =>
        f.telemetry.latitude >= bounds.minLat &&
        f.telemetry.latitude <= bounds.maxLat &&
        f.telemetry.longitude >= bounds.minLng &&
        f.telemetry.longitude <= bounds.maxLng
      );
    }

    // Apply search / airline filter from FlightFilterParams
    const fp = params as FlightFilterParams | undefined;
    if (fp && "search" in fp && fp.search) {
      const q = fp.search.toLowerCase();
      flights = flights.filter(f =>
        f.flightNumber.toLowerCase().includes(q) ||
        f.callsign.toLowerCase().includes(q) ||
        f.airline.name.toLowerCase().includes(q) ||
        f.origin.city.toLowerCase().includes(q) ||
        f.destination.city.toLowerCase().includes(q) ||
        f.origin.iata.toLowerCase().includes(q) ||
        f.destination.iata.toLowerCase().includes(q)
      );
    }

    if (fp && "airline" in fp && fp.airline) {
      const al = fp.airline.toLowerCase();
      flights = flights.filter(f =>
        f.airline.iata.toLowerCase() === al ||
        f.airline.icao.toLowerCase() === al ||
        f.airline.name.toLowerCase().includes(al)
      );
    }

    return flights;
  }

  async getFlightDetails(flightId: string): Promise<FlightDetail | null> {
    tickSimulation();
    const sim = simState.get(flightId);
    if (!sim) return null;

    const summary = buildFlightSummary(sim);
    const fraction = sim.progressPercent / 100;

    // Route history: all arc points up to current progress
    const historyCount = Math.ceil(fraction * sim.routeArc.length);
    const routeHistory = sim.routeArc.slice(0, historyCount).map(c => ({
      ...c,
      altitudeFt: estimateAltitudeProfile(
        (sim.routeArc.indexOf(c) / sim.routeArc.length),
        sim.template.cruiseAltitudeFt
      ),
    }));

    // Projected route: remaining arc points
    const projectedRoute = sim.routeArc.slice(historyCount).map(c => ({
      ...c,
      altitudeFt: estimateAltitudeProfile(
        (sim.routeArc.indexOf(c) / sim.routeArc.length),
        sim.template.cruiseAltitudeFt
      ),
    }));

    const remaining = remainingDistanceKm(sim.totalDistanceKm, sim.progressPercent);
    const durationSec = (sim.totalDistanceKm / (sim.template.cruiseSpeedKts * 1.852)) * 3600;
    const depTime = new Date(Date.now() - fraction * durationSec * 1000);
    const arrTime = new Date(Date.now() + (1 - fraction) * durationSec * 1000);

    return {
      ...summary,
      scheduledDeparture: depTime.toISOString(),
      actualDeparture: depTime.toISOString(),
      scheduledArrival: arrTime.toISOString(),
      estimatedArrival: arrTime.toISOString(),
      delayMinutes: 0,
      totalDistanceKm: Math.round(sim.totalDistanceKm),
      remainingDistanceKm: Math.round(remaining),
      routeHistory,
      projectedRoute,
    };
  }

  async searchFlights(query: string): Promise<FlightSummary[]> {
    return this.getLiveFlights({ search: query });
  }

  async getAirportSchedule(airportIata: string): Promise<AirportSchedule | null> {
    tickSimulation();
    const airport = getAirport(airportIata);
    if (!airport) return null;

    const iata = airportIata.toUpperCase();
    const allFlights = Array.from(simState.values())
      .filter(s => s.totalDistanceKm > 0)
      .map(buildFlightSummary);

    const departures = allFlights.filter(f => f.origin.iata === iata);
    const arrivals = allFlights.filter(f => f.destination.iata === iata);

    return {
      airport,
      weather: {
        tempC: Math.round(20 + Math.random() * 15),
        condition: "Clear",
        windSpeedKts: Math.round(5 + Math.random() * 15),
        windDirectionDeg: Math.round(Math.random() * 360),
        visibilityKm: 10,
        humidityPercent: 60,
      },
      departures,
      arrivals,
      updatedAt: new Date().toISOString(),
    };
  }

  async getProviderStatus(): Promise<ProviderStatus> {
    return {
      name: this.providerName,
      status: "HEALTHY",
      isMock: true,
      message: `Simulating ${simState.size} flights`,
    };
  }
}

// Singleton instance (shared across API route handler invocations in dev)
let _provider: MockFlightProvider | null = null;
export function getMockProvider(): MockFlightProvider {
  if (!_provider) _provider = new MockFlightProvider();
  return _provider;
}
