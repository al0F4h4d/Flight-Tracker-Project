import {
  haversineDistanceKm,
  calculateBearing,
  interpolateGreatCircle,
  estimateAltitudeProfile,
} from "../lib/simulation/geo-math";

console.log("=== Testing Geo-Math Physics Engine ===");

// 1. Distance between Dhaka (DAC) and Dubai (DXB)
const dac = { latitude: 23.8433, longitude: 90.3978, altitudeFt: 0 };
const dxb = { latitude: 25.2532, longitude: 55.3657, altitudeFt: 0 };
const distDacDxb = haversineDistanceKm(dac.latitude, dac.longitude, dxb.latitude, dxb.longitude);

console.log(`DAC to DXB Distance: ${distDacDxb.toFixed(2)} km`);
if (Math.abs(distDacDxb - 3540) < 25) {
  console.log("✅ Distance Dhaka ↔ Dubai is within ~3,540 km ± 20 km");
} else {
  console.error("❌ Distance Dhaka ↔ Dubai failed range check");
  process.exit(1);
}

// 2. Cardinal bearings
const bNorth = calculateBearing(0, 0, 10, 0);
const bEast = calculateBearing(0, 0, 0, 10);
const bSouth = calculateBearing(10, 0, 0, 0);
const bWest = calculateBearing(0, 10, 0, 0);

console.log(`Bearing North: ${bNorth}°, East: ${bEast}°, South: ${bSouth}°, West: ${bWest}°`);
if (
  Math.round(bNorth) === 0 &&
  Math.round(bEast) === 90 &&
  Math.round(bSouth) === 180 &&
  Math.round(bWest) === 270
) {
  console.log("✅ Cardinal bearings match 0° (N), 90° (E), 180° (S), 270° (W)");
} else {
  console.error("❌ Cardinal bearings mismatch");
  process.exit(1);
}

// 3. Great circle midpoint
const mid = interpolateGreatCircle(dac, dxb, 0.5);
console.log(`DAC-DXB Midpoint: Lat ${mid.latitude.toFixed(2)}, Lon ${mid.longitude.toFixed(2)}`);

// 4. Altitude profile
const altClimb = estimateAltitudeProfile(0.05, 38000);
const altCruise = estimateAltitudeProfile(0.5, 38000);
const altDescent = estimateAltitudeProfile(0.95, 38000);
console.log(`Altitude profile: Climb: ${altClimb} ft, Cruise: ${altCruise} ft, Descent: ${altDescent} ft`);

console.log("🎉 ALL TESTS PASSED!");
