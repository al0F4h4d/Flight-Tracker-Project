import { NextRequest, NextResponse } from "next/server";
import { getFlightDataProvider } from "../../../lib/services/provider-factory";
import type { FlightFilterParams, BoundingBox } from "../../../types/flight";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const boundsStr = sp.get("bounds");
  const airline = sp.get("airline") ?? undefined;
  const search = sp.get("search") ?? undefined;

  let params: FlightFilterParams = { airline, search };

  if (boundsStr) {
    const [minLat, minLng, maxLat, maxLng] = boundsStr.split(",").map(Number);
    if (!isNaN(minLat)) {
      const bounds: BoundingBox = { minLat, minLng, maxLat, maxLng };
      params = { ...params, bounds };
    }
  }

  const provider = getFlightDataProvider();
  const data = await provider.getLiveFlights(params);

  return NextResponse.json(
    { success: true, count: data.length, timestamp: new Date().toISOString(), data },
    { headers: { "Cache-Control": "no-store" } }
  );
}
