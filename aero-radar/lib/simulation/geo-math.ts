/**
 * Spherical Geodesic Mathematics & Flight Physics Engine
 * Provides Great Circle calculations, bearing, interpolation, and altitude profiles.
 */

import type { Coordinates } from "../../types/airport";

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** Haversine distance in km between two lat/lng coordinates. */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Initial forward bearing (degrees 0–360) from point 1 to point 2. */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/**
 * Spherical Linear Interpolation (Slerp) on the Great Circle.
 * fraction 0 = coord1, fraction 1 = coord2.
 */
export function interpolateGreatCircle(
  coord1: Coordinates,
  coord2: Coordinates,
  fraction: number
): Coordinates {
  const φ1 = toRad(coord1.latitude);
  const λ1 = toRad(coord1.longitude);
  const φ2 = toRad(coord2.latitude);
  const λ2 = toRad(coord2.longitude);

  const Δφ = φ2 - φ1;
  const Δλ = λ2 - λ1;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const δ = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  if (δ < 1e-10) {
    return {
      latitude: coord1.latitude,
      longitude: coord1.longitude,
      altitudeFt: coord1.altitudeFt,
    };
  }

  const A = Math.sin((1 - fraction) * δ) / Math.sin(δ);
  const B = Math.sin(fraction * δ) / Math.sin(δ);

  const x =
    A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
  const y =
    A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
  const z = A * Math.sin(φ1) + B * Math.sin(φ2);

  const φ = Math.atan2(z, Math.sqrt(x * x + y * y));
  const λ = Math.atan2(y, x);

  return {
    latitude: toDeg(φ),
    longitude: toDeg(λ),
    altitudeFt:
      coord1.altitudeFt +
      (coord2.altitudeFt - coord1.altitudeFt) * fraction,
  };
}

/** Generates an array of numPoints waypoints along the Great Circle arc. */
export function generateGreatCircleArc(
  start: Coordinates,
  end: Coordinates,
  numPoints = 60
): Coordinates[] {
  const points: Coordinates[] = [];
  for (let i = 0; i <= numPoints; i++) {
    points.push(interpolateGreatCircle(start, end, i / numPoints));
  }
  return points;
}

/**
 * Computes current flight completion percentage (0–100).
 * Uses distance from origin to current vs total origin-to-destination distance.
 */
export function calculateFlightProgress(
  origin: Coordinates,
  destination: Coordinates,
  current: Coordinates
): number {
  const total = haversineDistanceKm(
    origin.latitude,
    origin.longitude,
    destination.latitude,
    destination.longitude
  );
  if (total === 0) return 100;
  const traveled = haversineDistanceKm(
    origin.latitude,
    origin.longitude,
    current.latitude,
    current.longitude
  );
  return Math.min(100, Math.max(0, (traveled / total) * 100));
}

/**
 * Returns realistic altitude in feet for the given flight progress (0–1).
 *
 * Phases:
 *   0.00 – 0.15 : Climb (0 ft → cruise)
 *   0.15 – 0.80 : Cruise (stable with micro-fluctuations)
 *   0.80 – 1.00 : Descent (cruise → 0 ft)
 */
export function estimateAltitudeProfile(
  progressFraction: number,
  cruiseAltitudeFt: number
): number {
  const t = Math.max(0, Math.min(1, progressFraction));

  if (t < 0.15) {
    // Climb: smooth quadratic ramp
    return Math.round(cruiseAltitudeFt * (t / 0.15) ** 2);
  } else if (t <= 0.8) {
    // Cruise: stable altitude with very slight pseudo-random fluctuation
    const fluctuation = Math.sin(t * 37.3) * 200;
    return Math.round(cruiseAltitudeFt + fluctuation);
  } else {
    // Descent: smooth quadratic descent
    const descentFraction = (t - 0.8) / 0.2;
    return Math.round(cruiseAltitudeFt * (1 - descentFraction ** 1.5));
  }
}

/**
 * Converts ground speed (knots) and distance (km) to flight duration in seconds.
 */
export function estimateFlightDurationSecs(
  distanceKm: number,
  speedKts: number
): number {
  const speedKmh = speedKts * 1.852;
  return (distanceKm / speedKmh) * 3600;
}

/**
 * Compute how far (km) remains from a progress fraction and total distance.
 */
export function remainingDistanceKm(
  totalKm: number,
  progressPercent: number
): number {
  return totalKm * (1 - progressPercent / 100);
}
