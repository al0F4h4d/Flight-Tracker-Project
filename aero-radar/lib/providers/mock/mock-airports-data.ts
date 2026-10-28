import type { Airport } from "../../../types/airport";

export const AIRPORTS: Record<string, Airport> = {
  // ── Bangladesh ───────────────────────────────────────────────────────────────
  DAC: {
    iata: "DAC", icao: "VGHS",
    name: "Hazrat Shahjalal International Airport",
    city: "Dhaka", country: "Bangladesh",
    latitude: 23.8433, longitude: 90.3978, elevationFt: 30,
    timezone: "Asia/Dhaka",
  },
  CGP: {
    iata: "CGP", icao: "VGEG",
    name: "Shah Amanat International Airport",
    city: "Chittagong", country: "Bangladesh",
    latitude: 22.2496, longitude: 91.8133, elevationFt: 12,
    timezone: "Asia/Dhaka",
  },
  ZYL: {
    iata: "ZYL", icao: "VGSY",
    name: "Osmani International Airport",
    city: "Sylhet", country: "Bangladesh",
    latitude: 24.9632, longitude: 91.8679, elevationFt: 50,
    timezone: "Asia/Dhaka",
  },
  CXB: {
    iata: "CXB", icao: "VGCB",
    name: "Cox's Bazar Airport",
    city: "Cox's Bazar", country: "Bangladesh",
    latitude: 21.4522, longitude: 91.9639, elevationFt: 12,
    timezone: "Asia/Dhaka",
  },
  SPD: {
    iata: "SPD", icao: "VGSD",
    name: "Saidpur Airport",
    city: "Saidpur", country: "Bangladesh",
    latitude: 25.7592, longitude: 88.9089, elevationFt: 125,
    timezone: "Asia/Dhaka",
  },

  // ── Middle East ───────────────────────────────────────────────────────────────
  DXB: {
    iata: "DXB", icao: "OMDB",
    name: "Dubai International Airport",
    city: "Dubai", country: "United Arab Emirates",
    latitude: 25.2532, longitude: 55.3657, elevationFt: 62,
    timezone: "Asia/Dubai",
  },
  DOH: {
    iata: "DOH", icao: "OTHH",
    name: "Hamad International Airport",
    city: "Doha", country: "Qatar",
    latitude: 25.2609, longitude: 51.6138, elevationFt: 13,
    timezone: "Asia/Qatar",
  },
  RUH: {
    iata: "RUH", icao: "OERK",
    name: "King Khalid International Airport",
    city: "Riyadh", country: "Saudi Arabia",
    latitude: 24.9578, longitude: 46.6989, elevationFt: 2049,
    timezone: "Asia/Riyadh",
  },
  KWI: {
    iata: "KWI", icao: "OKBK",
    name: "Kuwait International Airport",
    city: "Kuwait City", country: "Kuwait",
    latitude: 29.2266, longitude: 47.9689, elevationFt: 206,
    timezone: "Asia/Kuwait",
  },

  // ── Europe ────────────────────────────────────────────────────────────────────
  LHR: {
    iata: "LHR", icao: "EGLL",
    name: "Heathrow Airport",
    city: "London", country: "United Kingdom",
    latitude: 51.4700, longitude: -0.4543, elevationFt: 83,
    timezone: "Europe/London",
  },
  CDG: {
    iata: "CDG", icao: "LFPG",
    name: "Charles de Gaulle Airport",
    city: "Paris", country: "France",
    latitude: 49.0097, longitude: 2.5479, elevationFt: 392,
    timezone: "Europe/Paris",
  },
  FRA: {
    iata: "FRA", icao: "EDDF",
    name: "Frankfurt Airport",
    city: "Frankfurt", country: "Germany",
    latitude: 50.0379, longitude: 8.5622, elevationFt: 364,
    timezone: "Europe/Berlin",
  },
  AMS: {
    iata: "AMS", icao: "EHAM",
    name: "Amsterdam Schiphol Airport",
    city: "Amsterdam", country: "Netherlands",
    latitude: 52.3105, longitude: 4.7683, elevationFt: -11,
    timezone: "Europe/Amsterdam",
  },

  // ── Asia ──────────────────────────────────────────────────────────────────────
  SIN: {
    iata: "SIN", icao: "WSSS",
    name: "Singapore Changi Airport",
    city: "Singapore", country: "Singapore",
    latitude: 1.3644, longitude: 103.9915, elevationFt: 22,
    timezone: "Asia/Singapore",
  },
  BKK: {
    iata: "BKK", icao: "VTBS",
    name: "Suvarnabhumi Airport",
    city: "Bangkok", country: "Thailand",
    latitude: 13.6811, longitude: 100.7475, elevationFt: 5,
    timezone: "Asia/Bangkok",
  },
  DEL: {
    iata: "DEL", icao: "VIDP",
    name: "Indira Gandhi International Airport",
    city: "New Delhi", country: "India",
    latitude: 28.5561, longitude: 77.1000, elevationFt: 777,
    timezone: "Asia/Kolkata",
  },
  BOM: {
    iata: "BOM", icao: "VABB",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    city: "Mumbai", country: "India",
    latitude: 19.0896, longitude: 72.8656, elevationFt: 37,
    timezone: "Asia/Kolkata",
  },
  CCU: {
    iata: "CCU", icao: "VECC",
    name: "Netaji Subhas Chandra Bose International Airport",
    city: "Kolkata", country: "India",
    latitude: 22.6520, longitude: 88.4463, elevationFt: 16,
    timezone: "Asia/Kolkata",
  },
  KUL: {
    iata: "KUL", icao: "WMKK",
    name: "Kuala Lumpur International Airport",
    city: "Kuala Lumpur", country: "Malaysia",
    latitude: 2.7456, longitude: 101.7099, elevationFt: 69,
    timezone: "Asia/Kuala_Lumpur",
  },
  HND: {
    iata: "HND", icao: "RJTT",
    name: "Tokyo Haneda Airport",
    city: "Tokyo", country: "Japan",
    latitude: 35.5494, longitude: 139.7798, elevationFt: 35,
    timezone: "Asia/Tokyo",
  },
  ICN: {
    iata: "ICN", icao: "RKSI",
    name: "Incheon International Airport",
    city: "Seoul", country: "South Korea",
    latitude: 37.4691, longitude: 126.4510, elevationFt: 23,
    timezone: "Asia/Seoul",
  },
  PEK: {
    iata: "PEK", icao: "ZBAA",
    name: "Beijing Capital International Airport",
    city: "Beijing", country: "China",
    latitude: 40.0801, longitude: 116.5846, elevationFt: 116,
    timezone: "Asia/Shanghai",
  },

  // ── Americas ─────────────────────────────────────────────────────────────────
  JFK: {
    iata: "JFK", icao: "KJFK",
    name: "John F. Kennedy International Airport",
    city: "New York", country: "United States",
    latitude: 40.6413, longitude: -73.7781, elevationFt: 13,
    timezone: "America/New_York",
  },
  EWR: {
    iata: "EWR", icao: "KEWR",
    name: "Newark Liberty International Airport",
    city: "Newark", country: "United States",
    latitude: 40.6895, longitude: -74.1745, elevationFt: 18,
    timezone: "America/New_York",
  },
  YYZ: {
    iata: "YYZ", icao: "CYYZ",
    name: "Toronto Pearson International Airport",
    city: "Toronto", country: "Canada",
    latitude: 43.6772, longitude: -79.6306, elevationFt: 569,
    timezone: "America/Toronto",
  },

  // ── Australia ─────────────────────────────────────────────────────────────────
  SYD: {
    iata: "SYD", icao: "YSSY",
    name: "Sydney Kingsford Smith Airport",
    city: "Sydney", country: "Australia",
    latitude: -33.9399, longitude: 151.1753, elevationFt: 21,
    timezone: "Australia/Sydney",
  },
};

export function getAirport(iata: string): Airport | undefined {
  return AIRPORTS[iata.toUpperCase()];
}
