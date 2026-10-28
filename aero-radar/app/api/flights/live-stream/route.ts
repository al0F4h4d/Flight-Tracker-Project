import { NextRequest } from "next/server";
import { getFlightDataProvider } from "../../../../lib/services/provider-factory";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  const provider = getFlightDataProvider();
  let isClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const send = async () => {
        if (isClosed) return;
        try {
          const flights = await provider.getLiveFlights();
          const payload = JSON.stringify({ flights, timestamp: Date.now() });
          controller.enqueue(encoder.encode(`event: telemetry\ndata: ${payload}\n\n`));
        } catch {
          // ignore tick errors
        }
      };

      // Send initial data immediately
      await send();

      const interval = setInterval(send, 3000);

      // Clean up when the stream is cancelled
      return () => {
        isClosed = true;
        clearInterval(interval);
      };
    },
    cancel() {
      isClosed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
