import { NextRequest, NextResponse } from "next/server";
import { getFlightDataProvider } from "../../../../lib/services/provider-factory";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const provider = getFlightDataProvider();
  const detail = await provider.getFlightDetails(id);

  if (!detail) {
    return NextResponse.json(
      { success: false, error: `Flight '${id}' not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, data: detail },
    { headers: { "Cache-Control": "no-store" } }
  );
}
