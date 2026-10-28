import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names safely, resolving conflicts.
 * Usage: cn("px-4 py-2", condition && "bg-cyan-500", "text-sm")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats altitude in feet to flight level notation.
 * e.g. 38000 → "FL380" | 5200 → "5,200 FT"
 */
export function formatAltitude(altitudeFt: number): string {
  if (altitudeFt >= 18000) {
    return `FL${Math.round(altitudeFt / 100)
      .toString()
      .padStart(3, "0")}`;
  }
  return `${altitudeFt.toLocaleString()} FT`;
}

/**
 * Formats knots to display string with optional km/h.
 */
export function formatSpeed(knots: number): string {
  const kmh = Math.round(knots * 1.852);
  return `${Math.round(knots)} KTS (${kmh} km/h)`;
}

/**
 * Converts a bearing in degrees to compass direction abbreviation.
 * e.g. 0 → "N", 90 → "E", 284 → "WNW"
 */
export function bearingToCompass(bearing: number): string {
  const dirs = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW",
  ];
  const index = Math.round(((bearing % 360) + 360) % 360 / 22.5) % 16;
  return dirs[index];
}

/**
 * Formats vertical speed in FPM with arrow indicator.
 * e.g. 1200 → "↑ 1,200 FPM" | -800 → "↓ 800 FPM" | 0 → "→ 0 FPM"
 */
export function formatVerticalSpeed(fpm: number): string {
  if (fpm > 50) return `↑ ${Math.abs(fpm).toLocaleString()} FPM`;
  if (fpm < -50) return `↓ ${Math.abs(fpm).toLocaleString()} FPM`;
  return `→ 0 FPM`;
}
