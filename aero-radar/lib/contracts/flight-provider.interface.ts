/**
 * Core Flight Data Provider Contract (Adapter Pattern)
 *
 * Any flight data source (Mock Simulation, OpenSky Network, AviationStack,
 * FlightRadar24, FlightAware) MUST implement this interface.
 *
 * This guarantees zero changes to the UI layer when swapping providers.
 */

import type {
  BoundingBox,
  FlightDetail,
  FlightFilterParams,
  FlightSummary,
} from "../../types/flight";
import type { AirportSchedule } from "../../types/airport";

export type ProviderHealthStatus = "HEALTHY" | "DEGRADED" | "DOWN";

export interface ProviderStatus {
  name: string;
  status: ProviderHealthStatus;
  isMock: boolean;
  quotaRemaining?: number;
  message?: string;
}

export interface IFlightDataProvider {
  /**
   * Human-readable identifier for the active provider, e.g. "MOCK_SIMULATOR" | "OPENSKY_NETWORK"
   */
  readonly providerName: string;

  /**
   * Retrieves active flights, optionally filtered by viewport bounding box or query parameters.
   */
  getLiveFlights(params?: FlightFilterParams | BoundingBox): Promise<FlightSummary[]>;

  /**
   * Retrieves full telemetry, breadcrumb history, and projected trajectory for a single flight.
   */
  getFlightDetails(flightId: string): Promise<FlightDetail | null>;

  /**
   * Searches flights by flight number, callsign, airline name, or city.
   */
  searchFlights(query: string): Promise<FlightSummary[]>;

  /**
   * Retrieves departures and arrivals schedule for a given airport IATA code.
   */
  getAirportSchedule(airportIata: string): Promise<AirportSchedule | null>;

  /**
   * Returns runtime health, connectivity, and rate-limit quota of the provider.
   */
  getProviderStatus(): Promise<ProviderStatus>;
}
