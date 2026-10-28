/**
 * Domain types for airports, coordinates, and schedules.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitudeFt: number;
}

export interface Airport {
  iata: string;             // 3-letter IATA code, e.g. "DAC", "DXB", "LHR"
  icao: string;             // 4-letter ICAO code, e.g. "VGHS", "OMDB", "EGLL"
  name: string;             // Full name, e.g. "Hazrat Shahjalal International Airport"
  city: string;             // e.g. "Dhaka"
  country: string;          // e.g. "Bangladesh"
  latitude: number;
  longitude: number;
  elevationFt: number;
  timezone: string;         // IANA timezone, e.g. "Asia/Dhaka"
}

export interface AirportBrief {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  terminal?: string;
  gate?: string;
}

export interface AirportWeather {
  tempC: number;
  condition: string;
  windSpeedKts: number;
  windDirectionDeg: number;
  visibilityKm: number;
  humidityPercent: number;
}

// Forward reference to FlightSummary which is defined in flight.ts
import type { FlightSummary } from "./flight";

export interface AirportSchedule {
  airport: Airport;
  weather?: AirportWeather;
  departures: FlightSummary[];
  arrivals: FlightSummary[];
  updatedAt: string;        // ISO timestamp
}
