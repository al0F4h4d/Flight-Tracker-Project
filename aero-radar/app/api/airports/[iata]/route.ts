import { NextRequest, NextResponse } from "next/server";
import { getFlightDataProvider } from "../../../../lib/services/provider-factory";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ iata: string }> }
) {
  const { iata } = await context.params;
  const provider = getFlightDataProvider();
  const schedule = await provider.getAirportSchedule(iata.toUpperCase());

  if (!schedule) {
    return NextResponse.json(
      { success: false, error: `Airport '${iata}' not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, data: schedule },
    { headers: { "Cache-Control": "no-store" } }
  );
}
