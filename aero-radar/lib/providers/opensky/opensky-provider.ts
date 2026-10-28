/**
 * OpenSky Network Flight Provider Adapter
 * Implements IFlightDataProvider for real ADS-B data via opensky-network.org
 *
 * Usage: Set FLIGHT_DATA_PROVIDER=OPENSKY in .env.local
 */
import type { IFlightDataProvider, ProviderStatus } from "../../contracts/flight-provider.interface";
import type { FlightSummary, FlightDetail, FlightFilterParams, BoundingBox } from "../../../types/flight";
import type { AirportSchedule } from "../../../types/airport";

const OPENSKY_BASE = "https://opensky-network.org/api";

export class OpenSkyFlightProvider implements IFlightDataProvider {
  readonly providerName = "OPENSKY_NETWORK";
  private username?: string;
  private password?: string;

  constructor(username?: string, password?: string) {
    this.username = username;
    this.password = password;
  }

  private get authHeader(): Record<string, string> {
    if (this.username && this.password) {
      const b64 = Buffer.from(`${this.username}:${this.password}`).toString("base64");
      return { Authorization: `Basic ${b64}` };
    }
    return {};
  }

  async getLiveFlights(params?: FlightFilterParams | BoundingBox): Promise<FlightSummary[]> {
    let url = `${OPENSKY_BASE}/states/all`;

    // Apply bounding box if provided
    const bb = params as BoundingBox | undefined;
    if (bb && "minLat" in bb) {
      url += `?lamin=${bb.minLat}&lomin=${bb.minLng}&lamax=${bb.maxLat}&lomax=${bb.maxLng}`;
    }

    const res = await fetch(url, { headers: this.authHeader, next: { revalidate: 5 } });
    if (!res.ok) throw new Error(`OpenSky API error: ${res.status}`);

    const json = await res.json();
    const states: unknown[][] = json.states ?? [];

    // OpenSky state vector indices:
    // 0=icao24, 1=callsign, 2=origin_country, 3=time_position, 4=last_contact,
    // 5=longitude, 6=latitude, 7=baro_altitude, 8=on_ground,
    // 9=velocity (m/s), 10=true_track (deg), 11=vertical_rate (m/s)
    return states
      .filter((s) => !s[8] && s[5] != null && s[6] != null) // filter out on-ground and nulls
      .map((s): FlightSummary => {
        const icao24 = String(s[0]).toUpperCase();
        const callsign = String(s[1] ?? "").trim() || icao24;
        const lon = s[5] as number;
        const lat = s[6] as number;
        const altM = (s[7] as number) ?? 0;
        const speedMs = (s[9] as number) ?? 0;
        const heading = (s[10] as number) ?? 0;
        const vertMs = (s[11] as number) ?? 0;

        return {
          id: icao24,
          flightNumber: callsign,
          callsign,
          airline: { iata: "??", icao: "????", name: String(s[2] ?? "Unknown") },
          aircraft: {
            model: "Unknown",
            registration: callsign,
            icao24,
            typeCode: "UNKN",
          },
          origin: { iata: "???", icao: "????", name: "Unknown", city: "Unknown", country: String(s[2] ?? ""), timezone: "UTC" },
          destination: { iata: "???", icao: "????", name: "Unknown", city: "Unknown", country: "", timezone: "UTC" },
          status: "EN_ROUTE",
          telemetry: {
            latitude: lat,
            longitude: lon,
            altitudeFt: Math.round(altM * 3.28084),
            headingDeg: Math.round(heading),
            groundSpeedKts: Math.round(speedMs * 1.94384),
            verticalSpeedFpm: Math.round(vertMs * 196.85),
            timestamp: Date.now(),
          },
          progressPercent: 50,
        };
      });
  }

  async getFlightDetails(_flightId: string): Promise<FlightDetail | null> {
    // OpenSky free tier does not provide route/detail data
    return null;
  }

  async searchFlights(_query: string): Promise<FlightSummary[]> {
    return [];
  }

  async getAirportSchedule(_airportIata: string): Promise<AirportSchedule | null> {
    return null;
  }

  async getProviderStatus(): Promise<ProviderStatus> {
    try {
      const res = await fetch(`${OPENSKY_BASE}/states/all?lamin=0&lomin=0&lamax=1&lomax=1`, {
        headers: this.authHeader,
      });
      return {
        name: this.providerName,
        status: res.ok ? "HEALTHY" : "DEGRADED",
        isMock: false,
      };
    } catch {
      return { name: this.providerName, status: "DOWN", isMock: false };
    }
  }
}
