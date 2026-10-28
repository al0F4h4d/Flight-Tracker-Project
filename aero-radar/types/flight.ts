/**
 * Domain types for flights, telemetry, airlines, and aircraft.
 */

import type { AirportBrief, Coordinates } from "./airport";

export type FlightStatus =
  | "SCHEDULED"
  | "ACTIVE"
  | "EN_ROUTE"
  | "APPROACHING"
  | "LANDED"
  | "DIVERTED"
  | "DELAYED"
  | "CANCELLED";

export interface Telemetry extends Coordinates {
  headingDeg: number;       // 0 - 360 degrees
  groundSpeedKts: number;   // Knots
  verticalSpeedFpm: number; // Feet per minute (+ climbing, - descending)
  squawk?: string;          // 4-digit transponder squawk code, e.g. "7700"
  timestamp: number;        // Epoch milliseconds of telemetry sample
}

export interface AirlineBrief {
  iata: string;             // e.g. "BG", "EK", "BA"
  icao: string;             // e.g. "BBC", "UAE", "BAW"
  name: string;             // e.g. "Biman Bangladesh Airlines", "Emirates"
  logoUrl?: string;
  callsignPrefix?: string;
}

export interface AircraftInfo {
  model: string;            // e.g. "Boeing 787-9 Dreamliner", "Airbus A350-900"
  registration: string;     // e.g. "S2-AJX"
  icao24: string;           // 24-bit ICAO aircraft hex address, e.g. "70054B"
  typeCode: string;         // ICAO type designator, e.g. "B789", "A359", "AT76"
}

export interface Waypoint extends Coordinates {
  timestamp?: number | string;
}

export interface FlightSummary {
  id: string;               // Unique flight identifier
  flightNumber: string;     // e.g. "BG001", "EK582"
  callsign: string;         // e.g. "BBC001", "UAE582"
  airline: AirlineBrief;
  aircraft: AircraftInfo;
  origin: AirportBrief;
  destination: AirportBrief;
  status: FlightStatus;
  telemetry: Telemetry;
  progressPercent: number;  // 0 - 100
}

export interface FlightWeatherConditions {
  origin?: {
    tempC: number;
    windKts: number;
    visibilityKm: number;
    condition: string;
  };
  destination?: {
    tempC: number;
    windKts: number;
    visibilityKm: number;
    condition: string;
  };
}

export interface FlightDetail extends FlightSummary {
  scheduledDeparture: string;  // ISO timestamp
  actualDeparture?: string;    // ISO timestamp
  scheduledArrival: string;    // ISO timestamp
  estimatedArrival?: string;   // ISO timestamp
  delayMinutes: number;
  totalDistanceKm: number;
  remainingDistanceKm: number;
  routeHistory: Coordinates[];      // Breadcrumbs of traversed waypoints
  projectedRoute: Coordinates[];    // Projected Great Circle waypoints remaining
  weatherConditions?: FlightWeatherConditions;
}

export interface BoundingBox {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

export interface FlightFilterParams {
  bounds?: BoundingBox;
  airline?: string;
  status?: FlightStatus | "ALL";
  search?: string;
  limit?: number;
}
