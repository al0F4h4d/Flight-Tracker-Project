import { z } from "zod";

const envSchema = z.object({
  FLIGHT_DATA_PROVIDER: z
    .enum(["MOCK", "OPENSKY", "AVIATIONSTACK"])
    .default("MOCK"),
  OPENSKY_USERNAME: z.string().optional(),
  OPENSKY_PASSWORD: z.string().optional(),
  AVIATIONSTACK_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse({
  FLIGHT_DATA_PROVIDER: process.env.FLIGHT_DATA_PROVIDER,
  OPENSKY_USERNAME: process.env.OPENSKY_USERNAME,
  OPENSKY_PASSWORD: process.env.OPENSKY_PASSWORD,
  AVIATIONSTACK_API_KEY: process.env.AVIATIONSTACK_API_KEY,
});

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:", parsed.error.flatten());
  throw new Error("Invalid environment configuration. Check .env.local");
}

export const env = parsed.data;
