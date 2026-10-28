/**
 * Seed routes for the Mock Flight Simulation Engine.
 * Each entry defines the route metadata; the simulator assigns current positions at runtime.
 */
import type { AirlineBrief, AircraftInfo } from "../../../types/flight";

export interface RouteTemplate {
  id: string;
  flightNumber: string;
  callsign: string;
  airline: AirlineBrief;
  aircraft: AircraftInfo;
  originIata: string;
  destinationIata: string;
  cruiseAltitudeFt: number;
  cruiseSpeedKts: number;
  /** 0-1 — starting progress offset so flights are spread across the sky */
  initialProgress: number;
}

// ── Airlines ──────────────────────────────────────────────────────────────────
const BIMAN: AirlineBrief = { iata: "BG", icao: "BBC", name: "Biman Bangladesh Airlines", callsignPrefix: "BBC" };
const USBANGLA: AirlineBrief = { iata: "BS", icao: "UBG", name: "US-Bangla Airlines", callsignPrefix: "UBG" };
const NOVOAIR: AirlineBrief = { iata: "VQ", icao: "NVQ", name: "Novoair", callsignPrefix: "NVQ" };
const EMIRATES: AirlineBrief = { iata: "EK", icao: "UAE", name: "Emirates", callsignPrefix: "UAE" };
const QATAR: AirlineBrief = { iata: "QR", icao: "QTR", name: "Qatar Airways", callsignPrefix: "QTR" };
const BRITISH: AirlineBrief = { iata: "BA", icao: "BAW", name: "British Airways", callsignPrefix: "BAW" };
const SINGAPORE: AirlineBrief = { iata: "SQ", icao: "SIA", name: "Singapore Airlines", callsignPrefix: "SIA" };
const SAUDIA: AirlineBrief = { iata: "SV", icao: "SVA", name: "Saudia", callsignPrefix: "SVA" };
const LUFTHANSA: AirlineBrief = { iata: "LH", icao: "DLH", name: "Lufthansa", callsignPrefix: "DLH" };
const AIRFRANCE: AirlineBrief = { iata: "AF", icao: "AFR", name: "Air France", callsignPrefix: "AFR" };
const KLMROYAL: AirlineBrief = { iata: "KL", icao: "KLM", name: "KLM Royal Dutch Airlines", callsignPrefix: "KLM" };
const THAI: AirlineBrief = { iata: "TG", icao: "THA", name: "Thai Airways", callsignPrefix: "THA" };
const MALAYSIA: AirlineBrief = { iata: "MH", icao: "MAS", name: "Malaysia Airlines", callsignPrefix: "MAS" };
const JAPANAIR: AirlineBrief = { iata: "JL", icao: "JAL", name: "Japan Airlines", callsignPrefix: "JAL" };
const KOREAN: AirlineBrief = { iata: "KE", icao: "KAL", name: "Korean Air", callsignPrefix: "KAL" };

// ── Aircraft ──────────────────────────────────────────────────────────────────
const B789: AircraftInfo = { model: "Boeing 787-9 Dreamliner", registration: "S2-AJX", icao24: "70052A", typeCode: "B789" };
const B77W: AircraftInfo = { model: "Boeing 777-300ER", registration: "A6-ECE", icao24: "896534", typeCode: "B77W" };
const A359: AircraftInfo = { model: "Airbus A350-900", registration: "A7-ALC", icao24: "06A053", typeCode: "A359" };
const A388: AircraftInfo = { model: "Airbus A380-800", registration: "A6-EDA", icao24: "896504", typeCode: "A388" };
const B738: AircraftInfo = { model: "Boeing 737-800", registration: "S2-AHW", icao24: "700521", typeCode: "B738" };
const ATR72: AircraftInfo = { model: "ATR 72-600", registration: "S2-AGV", icao24: "700514", typeCode: "AT76" };
const A320: AircraftInfo = { model: "Airbus A320neo", registration: "AP-BLD", icao24: "760056", typeCode: "A20N" };
const B747: AircraftInfo = { model: "Boeing 747-400", registration: "G-BYGG", icao24: "400CE6", typeCode: "B744" };
const A333: AircraftInfo = { model: "Airbus A330-300", registration: "9M-MTB", icao24: "750526", typeCode: "A333" };
const B772: AircraftInfo = { model: "Boeing 777-200LR", registration: "HS-TKK", icao24: "E0048D", typeCode: "B772" };

export const ROUTE_TEMPLATES: RouteTemplate[] = [
  // Bangladesh International
  { id: "BG001", flightNumber: "BG001", callsign: "BBC001", airline: BIMAN, aircraft: B789, originIata: "DAC", destinationIata: "DXB", cruiseAltitudeFt: 37000, cruiseSpeedKts: 490, initialProgress: 0.15 },
  { id: "BG002", flightNumber: "BG002", callsign: "BBC002", airline: BIMAN, aircraft: B789, originIata: "DXB", destinationIata: "DAC", cruiseAltitudeFt: 37000, cruiseSpeedKts: 490, initialProgress: 0.60 },
  { id: "BG017", flightNumber: "BG017", callsign: "BBC017", airline: BIMAN, aircraft: B789, originIata: "DAC", destinationIata: "LHR", cruiseAltitudeFt: 38000, cruiseSpeedKts: 500, initialProgress: 0.30 },
  { id: "BG018", flightNumber: "BG018", callsign: "BBC018", airline: BIMAN, aircraft: B789, originIata: "LHR", destinationIata: "DAC", cruiseAltitudeFt: 38000, cruiseSpeedKts: 500, initialProgress: 0.70 },
  { id: "BG085", flightNumber: "BG085", callsign: "BBC085", airline: BIMAN, aircraft: B77W, originIata: "DAC", destinationIata: "JFK", cruiseAltitudeFt: 40000, cruiseSpeedKts: 510, initialProgress: 0.45 },
  { id: "BG088", flightNumber: "BG088", callsign: "BBC088", airline: BIMAN, aircraft: B77W, originIata: "DAC", destinationIata: "KUL", cruiseAltitudeFt: 36000, cruiseSpeedKts: 480, initialProgress: 0.55 },
  { id: "BG089", flightNumber: "BG089", callsign: "BBC089", airline: BIMAN, aircraft: B77W, originIata: "KUL", destinationIata: "DAC", cruiseAltitudeFt: 36000, cruiseSpeedKts: 480, initialProgress: 0.25 },
  { id: "BG147", flightNumber: "BG147", callsign: "BBC147", airline: BIMAN, aircraft: B77W, originIata: "DAC", destinationIata: "DEL", cruiseAltitudeFt: 28000, cruiseSpeedKts: 450, initialProgress: 0.40 },

  // US-Bangla domestic & regional
  { id: "BS101", flightNumber: "BS101", callsign: "UBG101", airline: USBANGLA, aircraft: B738, originIata: "DAC", destinationIata: "CGP", cruiseAltitudeFt: 22000, cruiseSpeedKts: 380, initialProgress: 0.50 },
  { id: "BS102", flightNumber: "BS102", callsign: "UBG102", airline: USBANGLA, aircraft: B738, originIata: "CGP", destinationIata: "DAC", cruiseAltitudeFt: 22000, cruiseSpeedKts: 380, initialProgress: 0.20 },
  { id: "BS141", flightNumber: "BS141", callsign: "UBG141", airline: USBANGLA, aircraft: ATR72, originIata: "DAC", destinationIata: "ZYL", cruiseAltitudeFt: 14000, cruiseSpeedKts: 270, initialProgress: 0.65 },
  { id: "BS143", flightNumber: "BS143", callsign: "UBG143", airline: USBANGLA, aircraft: ATR72, originIata: "DAC", destinationIata: "CXB", cruiseAltitudeFt: 14000, cruiseSpeedKts: 270, initialProgress: 0.35 },
  { id: "BS201", flightNumber: "BS201", callsign: "UBG201", airline: USBANGLA, aircraft: B738, originIata: "DAC", destinationIata: "DOH", cruiseAltitudeFt: 35000, cruiseSpeedKts: 460, initialProgress: 0.80 },

  // Novoair domestic
  { id: "VQ301", flightNumber: "VQ301", callsign: "NVQ301", airline: NOVOAIR, aircraft: ATR72, originIata: "DAC", destinationIata: "SPD", cruiseAltitudeFt: 12000, cruiseSpeedKts: 260, initialProgress: 0.10 },
  { id: "VQ302", flightNumber: "VQ302", callsign: "NVQ302", airline: NOVOAIR, aircraft: ATR72, originIata: "SPD", destinationIata: "DAC", cruiseAltitudeFt: 12000, cruiseSpeedKts: 260, initialProgress: 0.75 },

  // Emirates
  { id: "EK582", flightNumber: "EK582", callsign: "UAE582", airline: EMIRATES, aircraft: A388, originIata: "DXB", destinationIata: "LHR", cruiseAltitudeFt: 41000, cruiseSpeedKts: 520, initialProgress: 0.38 },
  { id: "EK583", flightNumber: "EK583", callsign: "UAE583", airline: EMIRATES, aircraft: A388, originIata: "LHR", destinationIata: "DXB", cruiseAltitudeFt: 41000, cruiseSpeedKts: 520, initialProgress: 0.62 },
  { id: "EK571", flightNumber: "EK571", callsign: "UAE571", airline: EMIRATES, aircraft: B77W, originIata: "DXB", destinationIata: "JFK", cruiseAltitudeFt: 41000, cruiseSpeedKts: 505, initialProgress: 0.50 },
  { id: "EK348", flightNumber: "EK348", callsign: "UAE348", airline: EMIRATES, aircraft: B77W, originIata: "DXB", destinationIata: "SIN", cruiseAltitudeFt: 38000, cruiseSpeedKts: 495, initialProgress: 0.27 },
  { id: "EK349", flightNumber: "EK349", callsign: "UAE349", airline: EMIRATES, aircraft: B77W, originIata: "SIN", destinationIata: "DXB", cruiseAltitudeFt: 38000, cruiseSpeedKts: 495, initialProgress: 0.72 },

  // Qatar Airways
  { id: "QR001", flightNumber: "QR001", callsign: "QTR001", airline: QATAR, aircraft: A359, originIata: "DOH", destinationIata: "LHR", cruiseAltitudeFt: 40000, cruiseSpeedKts: 510, initialProgress: 0.44 },
  { id: "QR002", flightNumber: "QR002", callsign: "QTR002", airline: QATAR, aircraft: A359, originIata: "LHR", destinationIata: "DOH", cruiseAltitudeFt: 40000, cruiseSpeedKts: 510, initialProgress: 0.56 },
  { id: "QR641", flightNumber: "QR641", callsign: "QTR641", airline: QATAR, aircraft: A359, originIata: "DOH", destinationIata: "DAC", cruiseAltitudeFt: 37000, cruiseSpeedKts: 495, initialProgress: 0.33 },
  { id: "QR642", flightNumber: "QR642", callsign: "QTR642", airline: QATAR, aircraft: A359, originIata: "DAC", destinationIata: "DOH", cruiseAltitudeFt: 37000, cruiseSpeedKts: 495, initialProgress: 0.67 },

  // British Airways
  { id: "BA011", flightNumber: "BA011", callsign: "BAW011", airline: BRITISH, aircraft: B747, originIata: "LHR", destinationIata: "JFK", cruiseAltitudeFt: 41000, cruiseSpeedKts: 505, initialProgress: 0.48 },
  { id: "BA012", flightNumber: "BA012", callsign: "BAW012", airline: BRITISH, aircraft: B747, originIata: "JFK", destinationIata: "LHR", cruiseAltitudeFt: 41000, cruiseSpeedKts: 505, initialProgress: 0.22 },
  { id: "BA017", flightNumber: "BA017", callsign: "BAW017", airline: BRITISH, aircraft: B77W, originIata: "LHR", destinationIata: "SIN", cruiseAltitudeFt: 40000, cruiseSpeedKts: 500, initialProgress: 0.58 },

  // Singapore Airlines
  { id: "SQ321", flightNumber: "SQ321", callsign: "SIA321", airline: SINGAPORE, aircraft: A359, originIata: "SIN", destinationIata: "LHR", cruiseAltitudeFt: 41000, cruiseSpeedKts: 515, initialProgress: 0.31 },
  { id: "SQ322", flightNumber: "SQ322", callsign: "SIA322", airline: SINGAPORE, aircraft: A359, originIata: "LHR", destinationIata: "SIN", cruiseAltitudeFt: 41000, cruiseSpeedKts: 515, initialProgress: 0.69 },
  { id: "SQ435", flightNumber: "SQ435", callsign: "SIA435", airline: SINGAPORE, aircraft: A333, originIata: "SIN", destinationIata: "DEL", cruiseAltitudeFt: 36000, cruiseSpeedKts: 480, initialProgress: 0.42 },

  // Saudia
  { id: "SV785", flightNumber: "SV785", callsign: "SVA785", airline: SAUDIA, aircraft: B77W, originIata: "RUH", destinationIata: "DAC", cruiseAltitudeFt: 36000, cruiseSpeedKts: 475, initialProgress: 0.53 },
  { id: "SV786", flightNumber: "SV786", callsign: "SVA786", airline: SAUDIA, aircraft: B77W, originIata: "DAC", destinationIata: "RUH", cruiseAltitudeFt: 36000, cruiseSpeedKts: 475, initialProgress: 0.18 },

  // Lufthansa
  { id: "LH760", flightNumber: "LH760", callsign: "DLH760", airline: LUFTHANSA, aircraft: A388, originIata: "FRA", destinationIata: "DEL", cruiseAltitudeFt: 40000, cruiseSpeedKts: 510, initialProgress: 0.37 },
  { id: "LH761", flightNumber: "LH761", callsign: "DLH761", airline: LUFTHANSA, aircraft: A388, originIata: "DEL", destinationIata: "FRA", cruiseAltitudeFt: 40000, cruiseSpeedKts: 510, initialProgress: 0.63 },
  { id: "LH400", flightNumber: "LH400", callsign: "DLH400", airline: LUFTHANSA, aircraft: B77W, originIata: "FRA", destinationIata: "JFK", cruiseAltitudeFt: 40000, cruiseSpeedKts: 500, initialProgress: 0.25 },

  // Air France
  { id: "AF012", flightNumber: "AF012", callsign: "AFR012", airline: AIRFRANCE, aircraft: B77W, originIata: "CDG", destinationIata: "JFK", cruiseAltitudeFt: 40000, cruiseSpeedKts: 500, initialProgress: 0.55 },

  // KLM
  { id: "KL641", flightNumber: "KL641", callsign: "KLM641", airline: KLMROYAL, aircraft: B772, originIata: "AMS", destinationIata: "BOM", cruiseAltitudeFt: 39000, cruiseSpeedKts: 495, initialProgress: 0.41 },

  // Thai Airways
  { id: "TG910", flightNumber: "TG910", callsign: "THA910", airline: THAI, aircraft: B772, originIata: "BKK", destinationIata: "LHR", cruiseAltitudeFt: 40000, cruiseSpeedKts: 500, initialProgress: 0.60 },
  { id: "TG317", flightNumber: "TG317", callsign: "THA317", airline: THAI, aircraft: B772, originIata: "BKK", destinationIata: "DEL", cruiseAltitudeFt: 36000, cruiseSpeedKts: 475, initialProgress: 0.30 },

  // Malaysia Airlines
  { id: "MH062", flightNumber: "MH062", callsign: "MAS062", airline: MALAYSIA, aircraft: A333, originIata: "KUL", destinationIata: "LHR", cruiseAltitudeFt: 39000, cruiseSpeedKts: 495, initialProgress: 0.47 },

  // Japan Airlines
  { id: "JL043", flightNumber: "JL043", callsign: "JAL043", airline: JAPANAIR, aircraft: B77W, originIata: "HND", destinationIata: "LHR", cruiseAltitudeFt: 40000, cruiseSpeedKts: 505, initialProgress: 0.35 },

  // Korean Air
  { id: "KE901", flightNumber: "KE901", callsign: "KAL901", airline: KOREAN, aircraft: B77W, originIata: "ICN", destinationIata: "JFK", cruiseAltitudeFt: 40000, cruiseSpeedKts: 510, initialProgress: 0.52 },
];
