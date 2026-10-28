# 🛠️ Next.js Flight Tracker — Step-by-Step Implementation Prompts

> **Companion Document:** [architecture.md](./architecture.md)  
> **Target Framework:** Next.js 15+ (App Router, React 19, TypeScript)  
> **Language:** English  
> **How to Use:** Run these prompts sequentially from Step 1 to Step 11. Each prompt contains the exact objective, files to touch, requirements, and verification criteria. Do not proceed to the next prompt until the verification criteria for the current step pass.

---

## 📑 Prompt Index

- [Prompt 1: Project Initialization & Dependency Setup](#prompt-1-project-initialization--dependency-setup)
- [Prompt 2: TypeScript Domain Types & Provider Interface](#prompt-2-typescript-domain-types--provider-interface)
- [Prompt 3: Spherical Geodesic Math & Flight Physics Engine](#prompt-3-spherical-geodesic-math--flight-physics-engine)
- [Prompt 4: Seed Data & Mock Flight Provider](#prompt-4-seed-data--mock-flight-provider)
- [Prompt 5: Next.js API Routes & Server-Sent Events (SSE) Stream](#prompt-5-nextjs-api-routes--server-sent-events-sse-stream)
- [Prompt 6: Global State Management (Zustand) & Telemetry Hooks](#prompt-6-global-state-management-zustand--telemetry-hooks)
- [Prompt 7: Interactive MapLibre GL Radar Canvas & Aircraft Markers](#prompt-7-interactive-maplibre-gl-radar-canvas--aircraft-markers)
- [Prompt 8: Cockpit Sidebar, Live Search & Route Filtering](#prompt-8-cockpit-sidebar-live-search--route-filtering)
- [Prompt 9: Flight Telemetry Cockpit Panel & Instrumentation Gauges](#prompt-9-flight-telemetry-cockpit-panel--instrumentation-gauges)
- [Prompt 10: Airport FIDS (Flight Information Display System) Board](#prompt-10-airport-fids-flight-information-display-system-board)
- [Prompt 11: Real API Adapter Blueprint & Production Validation](#prompt-11-real-api-adapter-blueprint--production-validation)

---

## Prompt 1: Project Initialization & Dependency Setup

```markdown
### Task: Initialize Next.js 15 App with Tailwind CSS, TypeScript, and Required Libraries

**Objective:**
Set up a clean Next.js 15 (App Router) project in the current directory with TypeScript, Tailwind CSS, and all necessary aviation radar dependencies.

**Actions to Perform:**
1. Initialize a Next.js 15 App Router project with TypeScript, ESLint, and Tailwind CSS.
2. Install the following dependencies:
   - UI & Icons: `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`
   - Map Engine: `maplibre-gl` and `@types/maplibre-gl`
   - State & Data Fetching: `zustand`, `@tanstack/react-query`
   - Validation & Math: `zod`
3. Configure `tailwind.config.ts` to include custom cockpit radar colors:
   - Radar Background: `#0B0F19` (Jet Black)
   - Radar Card / Panel: `#111827` (Deep Slate)
   - Radar Border: `#1F2937`
   - Accent Cyan: `#06B6D4` / `#22D3EE` (Telemetry indicators)
   - Accent Amber: `#F59E0B` (Flight warnings / delays)
   - Accent Emerald: `#10B981` (On-time status / active transponder)
   - Accent Red: `#EF4444` (Emergency squawk / cancelled)
4. Configure `app/globals.css` with a dark theme baseline, custom scrollbars, and radar pulse keyframe animations.
5. Create `.env.example` with:
   ```env
   NEXT_PUBLIC_APP_NAME="AeroRadar Flight Tracker"
   FLIGHT_DATA_PROVIDER=MOCK
   ```

**Acceptance Criteria:**
- `npm run build` runs without TypeScript or styling errors.
- The project launches via `npm run dev` and renders a clean dark background.
```

---

## Prompt 2: TypeScript Domain Types & Provider Interface

```markdown
### Task: Implement Core Domain Models and the Adapter Interface

**Objective:**
Define the strict TypeScript data models for flights, airports, telemetry, and the core adapter contract (`IFlightDataProvider`) that guarantees future compatibility with real aviation APIs.

**Files to Create:**
- `types/flight.ts`
- `types/airport.ts`
- `lib/contracts/flight-provider.interface.ts`

**Specifications:**
1. In `types/flight.ts`:
   - `FlightStatus`: `'SCHEDULED' | 'ACTIVE' | 'EN_ROUTE' | 'APPROACHING' | 'LANDED' | 'DIVERTED' | 'DELAYED' | 'CANCELLED'`
   - `Coordinates`: `{ latitude: number; longitude: number; altitudeFt: number }`
   - `Telemetry`: Extends `Coordinates` with `headingDeg: number; groundSpeedKts: number; verticalSpeedFpm: number; squawk?: string; timestamp: number`
   - `AircraftInfo`: `{ model: string; registration: string; icao24: string; typeCode: string }`
   - `FlightSummary`: `{ id: string; flightNumber: string; callsign: string; airline: AirlineBrief; aircraft: AircraftInfo; origin: AirportBrief; destination: AirportBrief; status: FlightStatus; telemetry: Telemetry; progressPercent: number }`
   - `FlightDetail`: Extends `FlightSummary` with `scheduledDeparture: string; actualDeparture?: string; scheduledArrival: string; estimatedArrival?: string; delayMinutes: number; routeHistory: Coordinates[]; projectedRoute: Coordinates[]`
2. In `types/airport.ts`:
   - `Airport`: `{ iata: string; icao: string; name: string; city: string; country: string; latitude: number; longitude: number; elevationFt: number; timezone: string }`
   - `AirportSchedule`: `{ airport: Airport; departures: FlightSummary[]; arrivals: FlightSummary[]; updatedAt: string }`
3. In `lib/contracts/flight-provider.interface.ts`:
   - Declare `IFlightDataProvider` with methods:
     - `getLiveFlights(bounds?: { minLat: number; minLng: number; maxLat: number; maxLng: number }): Promise<FlightSummary[]>`
     - `getFlightDetails(flightId: string): Promise<FlightDetail | null>`
     - `searchFlights(query: string): Promise<FlightSummary[]>`
     - `getAirportSchedule(airportIata: string): Promise<AirportSchedule | null>`
     - `getProviderStatus(): Promise<{ name: string; status: 'HEALTHY' | 'DEGRADED'; isMock: boolean }>`

**Acceptance Criteria:**
- `npx tsc --noEmit` passes with zero type errors.
- No external runtime dependencies in the contract files.
```

---

## Prompt 3: Spherical Geodesic Math & Flight Physics Engine

```markdown
### Task: Build Spherical Trigonometry & Flight Physics Engine

**Objective:**
Implement accurate spherical mathematics to calculate Great Circle flight paths, bearing, dynamic intermediate positions, and realistic altitude profiles for simulated flights.

**Files to Create:**
- `lib/simulation/geo-math.ts`

**Mathematical Functions to Implement:**
1. `haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number`:
   Calculates Earth surface distance between two coordinates using the Haversine formula (Earth radius = 6371 km).
2. `calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number`:
   Calculates the initial forward azimuth/bearing in degrees (`0° - 360°`) from origin to destination.
3. `interpolateGreatCircle(coord1: Coordinates, coord2: Coordinates, fraction: number): Coordinates`:
   Calculates intermediate spherical point at fractional distance `t` ($0 \le t \le 1$) using spherical linear interpolation (Slerp).
4. `generateGreatCircleArc(start: Coordinates, end: Coordinates, numPoints = 60): Coordinates[]`:
   Generates a smooth array of coordinates along the Great Circle arc between two airports.
5. `calculateFlightProgress(origin: Coordinates, destination: Coordinates, current: Coordinates): number`:
   Computes current flight completion percentage ($0 - 100\%$).
6. `estimateAltitudeProfile(progressFraction: number, cruiseAltitudeFt: number): number`:
   Simulates realistic altitude stages:
   - $0.0 \le t < 0.15$: Climb phase (takeoff to cruise)
   - $0.15 \le t \le 0.80$: Cruise phase (slight step climb/fluctuation)
   - $0.80 < t \le 1.0$: Descent phase (glideslope to touchdown)

**Acceptance Criteria:**
- Unit test or verification script confirms that distance between Dhaka (`DAC: 23.8433, 90.3978`) and Dubai (`DXB: 25.2532, 55.3657`) yields approx ~3,540 km ± 20 km.
- Bearing calculation produces correct compass angles (`0°` = North, `90°` = East, `180°` = South, `270°` = West).
```

---

## Prompt 4: Seed Data & Mock Flight Provider

```markdown
### Task: Create Comprehensive Seed Data and the Mock Flight Provider

**Objective:**
Build realistic airport databases, international and regional flight routes, and the `MockFlightProvider` implementing `IFlightDataProvider`.

**Files to Create:**
- `lib/providers/mock/mock-airports-data.ts`
- `lib/providers/mock/mock-flights-data.ts`
- `lib/providers/mock/mock-flight-provider.ts`
- `lib/services/provider-factory.ts`

**Specifications:**
1. `mock-airports-data.ts`:
   - Seed major international hubs: `DXB` (Dubai), `LHR` (London Heathrow), `JFK` (New York), `SIN` (Singapore Changi), `DOH` (Doha), `BKK` (Bangkok), `DEL` (Delhi), `HND` (Tokyo Haneda).
   - Seed Bangladesh domestic & regional airports: `DAC` (Dhaka Hazrat Shahjalal), `CGP` (Chittagong Shah Amanat), `ZYL` (Sylhet Osmani), `CXB` (Cox's Bazar), `SPD` (Saidpur).
2. `mock-flights-data.ts`:
   - Seed 40+ active flights with realistic airlines:
     - Biman Bangladesh Airlines (`BG`), US-Bangla (`BS`), Emirates (`EK`), Qatar Airways (`QR`), British Airways (`BA`), Singapore Airlines (`SQ`), Saudia (`SV`).
   - Assign valid aircraft models (`Boeing 787-9`, `Boeing 777-300ER`, `Airbus A350-900`, `ATR 72-600`).
   - Pre-calculate Great Circle route arcs using `geo-math.ts`.
3. `mock-flight-provider.ts`:
   - Store simulation state in an in-memory registry.
   - Advance flight positions based on elapsed time:
     - Increment `progressPercent` based on realistic ground speed (~450-520 knots for jets, ~280 knots for turboprops).
     - Calculate current latitude, longitude, and bearing using `interpolateGreatCircle` and `calculateBearing`.
     - Automatically turn around or re-schedule flights once they reach 100% progress.
   - Implement filtering by bounding box `getLiveFlights({ minLat, minLng, maxLat, maxLng })`.
   - Implement `searchFlights(query)` matching flight number, callsign, airline, or city.
   - Implement `getAirportSchedule(iata)` returning departures and arrivals for that airport.
4. `provider-factory.ts`:
   - Export `getFlightDataProvider(): IFlightDataProvider` inspecting `process.env.FLIGHT_DATA_PROVIDER`. Defaults to `MockFlightProvider`.

**Acceptance Criteria:**
- Calling `getFlightDataProvider().getLiveFlights()` returns an array of flights with non-zero coordinates and valid headings.
```

---

## Prompt 5: Next.js API Routes & Server-Sent Events (SSE) Stream

```markdown
### Task: Implement BFF API Routes and Realtime Telemetry SSE Stream

**Objective:**
Expose clean REST API routes and a Server-Sent Events (SSE) stream using Next.js App Router route handlers.

**Files to Create:**
- `app/api/flights/route.ts`
- `app/api/flights/[id]/route.ts`
- `app/api/flights/live-stream/route.ts`
- `app/api/airports/[iata]/route.ts`

**Specifications:**
1. `GET /api/flights`:
   - Accepts optional query parameters: `bounds` (`minLat,minLng,maxLat,maxLng`), `airline`, `search`.
   - Fetches from `getFlightDataProvider().getLiveFlights()` and applies filters.
   - Returns `{ success: true, count: number, timestamp: string, data: FlightSummary[] }`.
2. `GET /api/flights/[id]`:
   - Fetches flight detail using `getFlightDataProvider().getFlightDetails(params.id)`.
   - Returns full route trail, projected Great Circle trajectory, and detailed telemetry.
   - Returns 404 with JSON error if flight is not found.
3. `GET /api/flights/live-stream`:
   - Opens an `eventsource` / Server-Sent Events stream (`Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`).
   - Every 3000ms (3s), ticks the simulation engine and pushes:
     `event: telemetry\ndata: {"flights": [...]}\n\n`
   - Handles client disconnects gracefully by clearing intervals.
4. `GET /api/airports/[iata]`:
   - Returns airport metadata plus scheduled departures and arrivals.

**Acceptance Criteria:**
- `curl http://localhost:3000/api/flights` returns valid JSON with 40+ simulated flights.
- `curl -N http://localhost:3000/api/flights/live-stream` streams updated telemetry frames every 3 seconds.
```

---

## Prompt 6: Global State Management (Zustand) & Telemetry Hooks

```markdown
### Task: Set up Zustand Flight Store and Realtime Client Hooks

**Objective:**
Create the centralized client-side state store and hooks for managing active flights, selected aircraft, viewport filters, and SSE streaming with fallback polling.

**Files to Create:**
- `store/useFlightStore.ts`
- `hooks/useLiveTelemetry.ts`
- `hooks/useFlightSelection.ts`

**Specifications:**
1. `store/useFlightStore.ts`:
   - State properties:
     - `flights: Map<string, FlightSummary>` (or Record for O(1) lookups)
     - `selectedFlightId: string | null`
     - `selectedFlightDetail: FlightDetail | null`
     - `hoveredFlightId: string | null`
     - `filterSearch: string`
     - `filterAirline: string | null`
     - `filterStatus: FlightStatus | 'ALL'`
     - `isLiveConnected: boolean`
     - `lastUpdated: number | null`
     - `mapViewport: { center: [number, number]; zoom: number }`
   - Actions:
     - `setFlights(flights: FlightSummary[])`
     - `updateFlightTelemetry(updates: Array<{ id: string; telemetry: Telemetry; progressPercent: number }>)`
     - `selectFlight(flightId: string | null)`
     - `setSelectedFlightDetail(detail: FlightDetail | null)`
     - `setFilterSearch(query: string)`
     - `setFilterAirline(airline: string | null)`
     - `setFilterStatus(status: FlightStatus | 'ALL')`
     - `setLiveConnected(connected: boolean)`
2. `hooks/useLiveTelemetry.ts`:
   - Connects to `/api/flights/live-stream` via browser `EventSource`.
   - On incoming telemetry event, batches coordinate updates into `useFlightStore`.
   - Implements automatic reconnection with exponential backoff if the SSE stream drops.
   - Falls back to 5-second polling via standard `fetch('/api/flights')` if SSE is unavailable.

**Acceptance Criteria:**
- Hook connects cleanly in React without infinite re-renders.
- Unmounting the component disconnects the EventSource cleanly.
```

---

## Prompt 7: Interactive MapLibre GL Radar Canvas & Aircraft Markers

```markdown
### Task: Implement MapLibre GL Radar Map with Rotating Aircraft and Smooth Interpolation

**Objective:**
Build the full-screen interactive map using MapLibre GL JS, dark radar vector tiles, custom SVG aircraft markers with heading rotation, and smooth 60fps dead-reckoning animation.

**Files to Create:**
- `components/map/FlightMap.tsx`
- `components/map/AircraftMarker.tsx`
- `components/map/FlightPathPolyline.tsx`
- `components/map/MapControls.tsx`

**Specifications:**
1. `FlightMap.tsx`:
   - Fullscreen container (`100vw`, `100vh`) with MapLibre GL canvas.
   - Basemap: CARTO Dark Matter vector tile style (`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`).
   - Default viewpoint centered around South Asia / Middle East (`zoom: 4, center: [75.0, 24.0]`).
   - Clicking map background deselects any active flight.
2. `AircraftMarker.tsx`:
   - Uses an optimized SVG plane silhouette.
   - Applies CSS `transform: rotate(${headingDeg}deg)` with transition smoothing.
   - Marker color indicators:
     - Selected aircraft: Bright Neon Cyan (`#06B6D4`) with pulsing radar ring.
     - En-route aircraft: Emerald Green (`#10B981`) or Amber (`#F59E0B`).
     - Delayed aircraft: Orange / Red.
   - Clicking an aircraft marker selects it in `useFlightStore` and triggers camera smooth fly-to.
3. `FlightPathPolyline.tsx`:
   - When a flight is selected, dynamically adds GeoJSON layers:
     - Solid Cyan line: Traversed historical path (`routeHistory`).
     - Dashed Dim Cyan line: Projected remaining Great Circle path (`projectedRoute`).
     - Origin & Destination airport icon rings.
4. `MapControls.tsx`:
   - Floating zoom in/out, pitch 3D tilt, compass reset, and radar sweep animation toggle.

**Acceptance Criteria:**
- The map renders 40+ aircraft markers smoothly at 60 FPS without frame stutter.
- Selecting an aircraft draws its curved Great Circle trajectory over the map and flies the camera to it.
```

---

## Prompt 8: Cockpit Sidebar, Live Search & Route Filtering

```markdown
### Task: Build Floating Radar Sidebar, Real-Time Search, and Airline Filter

**Objective:**
Create the floating collapsible sidebar that displays the live flight registry, instant search bar (flight number, callsign, city), airline dropdown filter, and flight count badges.

**Files to Create:**
- `components/sidebar/FlightSidebar.tsx`
- `components/sidebar/SearchFilterBar.tsx`
- `components/sidebar/FlightListItem.tsx`
- `components/sidebar/AirlineFilterDropdown.tsx`

**Specifications:**
1. `FlightSidebar.tsx`:
   - Positioned as a floating glassmorphism panel on the left side (`top-4 left-4 bottom-4 w-96`).
   - Dark translucent backdrop (`bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl`).
   - Header with glowing "LIVE RADAR" badge, active aircraft counter, and collapse/expand toggle.
2. `SearchFilterBar.tsx`:
   - Instant search input with Lucide search icon and clear button.
   - Filters active flights in real time by:
     - Flight Number (e.g. `BG001`, `EK582`)
     - Airline Name (e.g. `Biman`, `Emirates`)
     - Origin or Destination IATA/City (e.g. `DAC`, `Dubai`, `London`)
3. `FlightListItem.tsx`:
   - Displays flight number, airline badge, origin `IATA` ➔ destination `IATA`.
   - Shows live altitude (`FL360` / `36,000 ft`), ground speed (`510 kts`), and status badge (`EN ROUTE`, `DELAYED`).
   - Hovering highlights the aircraft on the map; clicking selects it and pans the camera.
4. `AirlineFilterDropdown.tsx`:
   - Multi-airline selector to filter planes belonging to specific carriers.

**Acceptance Criteria:**
- Typing into the search bar filters the list instantaneously.
- Clicking any flight card smoothly highlights and selects that flight on the radar map.
```

---

## Prompt 9: Flight Telemetry Cockpit Panel & Instrumentation Gauges

```markdown
### Task: Implement Slide-Over Cockpit Telemetry Drawer with Aviation Gauges

**Objective:**
Build an aviation cockpit-style slide-over drawer that displays detailed real-time instrumentation for the selected aircraft (altitude tape, airspeed, vertical speed, Great Circle progress bar).

**Files to Create:**
- `components/flight-detail/FlightDetailSheet.tsx`
- `components/flight-detail/TelemetryGauges.tsx`
- `components/flight-detail/RouteProgressMeter.tsx`
- `components/flight-detail/AircraftSpecsCard.tsx`

**Specifications:**
1. `FlightDetailSheet.tsx`:
   - Slide-over panel from the right (`right-4 top-4 bottom-4 w-96` or modal drawer on mobile).
   - Shows airline logo, flight number, callsign, and close button (`Esc` key supported).
2. `TelemetryGauges.tsx`:
   - Aviation cockpit instruments:
     - **Altitude Tape:** Displays altitude in feet (e.g. `38,000 FT / FL380`) with climb/descent arrow.
     - **Ground Speed Gauge:** Knots (e.g. `495 KTS`) and km/h equivalent.
     - **Vertical Speed Indicator (VSI):** Feet per minute (`+1,200 FPM` or `-800 FPM`).
     - **Heading & Transponder:** e.g. `Heading: 284° (WNW) | Squawk: 7700 / 2315`.
3. `RouteProgressMeter.tsx`:
   - Visual progress bar connecting Origin Airport to Destination Airport.
   - Scheduled & estimated departure/arrival times with delay badges (+15 min).
   - Traveled distance vs remaining distance in nautical miles and kilometers.
4. `AircraftSpecsCard.tsx`:
   - Aircraft model (e.g. `Boeing 787-9 Dreamliner`), registration code (`S2-AJX`), and 24-bit ICAO transponder hex address.

**Acceptance Criteria:**
- Selecting any flight displays live updating numbers matching the current telemetry tick.
- Progress bar and altitude tape reflect the plane's true flight phase (climbing, cruising, or descending).
```

---

## Prompt 10: Airport FIDS (Flight Information Display System) Board

```markdown
### Task: Build Airport FIDS Departure & Arrival Schedule Modal

**Objective:**
Implement a realistic airport departure/arrival flight information display system (FIDS) modal when an airport marker is clicked or an airport code is searched.

**Files to Create:**
- `components/airport/AirportBoardModal.tsx`
- `components/airport/ScheduleTable.tsx`
- `components/airport/AirportWeatherBadge.tsx`

**Specifications:**
1. `AirportBoardModal.tsx`:
   - Dialog modal with dark airport terminal FIDS aesthetics (yellow flip-disc typography style or modern radar styling).
   - Displays airport name, city, country, local time, and METAR weather summary (temperature, wind, visibility).
2. `ScheduleTable.tsx`:
   - Tabs: **Departures** / **Arrivals**.
   - Columns: Time | Flight # | Airline | Destination/Origin | Gate | Terminal | Status (`ON TIME`, `BOARDING`, `DEPARTED`, `DELAYED`, `LANDED`).
   - Clicking any flight row inside the table closes the modal and focuses on that flight on the radar map.

**Acceptance Criteria:**
- Clicking an airport (e.g. `DAC` or `DXB`) opens the schedule modal showing simulated departures and arrivals.
- Clicking a flight from the schedule table highlights and tracks that flight on the map.
```

---

## Prompt 11: Real API Adapter Blueprint & Production Validation

```markdown
### Task: Implement Real API Adapter Blueprint, Environment Validation, and Testing

**Objective:**
Create an OpenSky Network / AviationStack adapter skeleton implementing `IFlightDataProvider`, establish runtime environment validation with Zod, and perform end-to-end testing.

**Files to Create / Update:**
- `lib/providers/opensky/opensky-provider.ts`
- `lib/config/env.ts`
- `tests/geo-math.test.ts`
- `.env.example`

**Specifications:**
1. `lib/providers/opensky/opensky-provider.ts`:
   - Implements `IFlightDataProvider`.
   - Calls OpenSky REST API (`https://opensky-network.org/api/states/all`).
   - Normalizes OpenSky array data (`[icao24, callsign, origin_country, time_position, last_contact, longitude, latitude, baro_altitude, on_ground, velocity, true_track, vertical_rate, ...]`) into standard domain `FlightSummary`.
2. `lib/config/env.ts`:
   - Validates environment variables using Zod:
     - `FLIGHT_DATA_PROVIDER`: enum `['MOCK', 'OPENSKY', 'AVIATIONSTACK']` (defaults to `'MOCK'`)
     - Optional API keys: `OPENSKY_USERNAME`, `OPENSKY_PASSWORD`, `AVIATIONSTACK_API_KEY`.
3. Switch Verification:
   - Setting `FLIGHT_DATA_PROVIDER=MOCK` boots the application with internal mock generator.
   - Setting `FLIGHT_DATA_PROVIDER=OPENSKY` automatically routes queries through the OpenSky adapter without modifying any React components.

**Acceptance Criteria:**
- `npm run build` succeeds with zero errors.
- Switching between `MOCK` and real provider interfaces works seamlessly via `.env`.
```

---

## 🎯 Verification & Testing Checklist

After executing all 11 prompts, verify that:
1. **Interactive Map:** Aircraft markers rotate accurately based on their compass heading.
2. **Smooth Flight Animation:** Coordinates transition smoothly between updates without stuttering.
3. **Great Circle Trajectory:** Selected flights display a curved path accounting for Earth's curvature.
4. **Search & Filters:** Search finds flights by flight number, airline, or city immediately.
5. **Cockpit Telemetry:** The flight detail drawer displays live altitude, ground speed, and vertical speed.
6. **Future-Proofing:** Changing `FLIGHT_DATA_PROVIDER=MOCK` to another provider conforms strictly to `IFlightDataProvider`.
