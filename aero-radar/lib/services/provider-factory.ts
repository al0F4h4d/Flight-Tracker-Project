import type { IFlightDataProvider } from "../contracts/flight-provider.interface";
import { getMockProvider } from "../providers/mock/mock-flight-provider";
import { OpenSkyFlightProvider } from "../providers/opensky/opensky-provider";

export function getFlightDataProvider(): IFlightDataProvider {
  const provider = (process.env.FLIGHT_DATA_PROVIDER ?? "MOCK").toUpperCase();

  switch (provider) {
    case "OPENSKY":
      return new OpenSkyFlightProvider(
        process.env.OPENSKY_USERNAME,
        process.env.OPENSKY_PASSWORD
      );
    case "AVIATIONSTACK":
      console.warn(
        "[ProviderFactory] AviationStack provider not yet configured — falling back to MOCK"
      );
      return getMockProvider();
    case "MOCK":
    default:
      return getMockProvider();
  }
}
