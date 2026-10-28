# ✈️ Next.js Real-Time Flight Tracker

An interactive, real-time flight tracking web application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **MapLibre GL JS**.

Designed with an **Adapter / Repository Pattern** so that the application seamlessly runs on a physics-based **Mock Flight Simulation Engine** today, and can be swapped for production aviation APIs (**OpenSky Network**, **AviationStack**, **FlightRadar24**, etc.) in the future without changing any UI or frontend code.

---

## 📑 Architecture & Documentation

The full architectural breakdown, domain models, simulation engine mechanics, and implementation phases are documented in:

👉 **[architecture.md](./architecture.md)** — Full technical architecture and system specifications.  
👉 **[prompt.md](./prompt.md)** — Step-by-step sequential AI prompts to build the entire project from scratch.

---

## 🛠️ Key Architectural Decisions

- **Framework:** Next.js 15+ (App Router, React 19, TypeScript strict mode)
- **Map Engine:** MapLibre GL JS (WebGL vector tiles with smooth 60fps aircraft rotation and no API token limits)
- **Theme:** Dark Aviation Cockpit Radar (Jet Black, Neon Cyan, Amber accents)
- **Realtime Strategy:** Server-Sent Events (SSE) + Dead Reckoning Client Interpolation
- **Data Layer:** Interchangeable Provider Interface (`IFlightDataProvider`)
  - `MockFlightProvider` (Current physics & simulation engine)
  - `OpenSkyFlightProvider` (Future ADS-B live data)
  - `AviationStackFlightProvider` (Future commercial flight schedules)

---

## 🗺️ Implementation Roadmap

- [ ] **Phase 1:** Project Setup & Bootstrapping (Next.js 15, TypeScript, Tailwind CSS, Shadcn UI)
- [ ] **Phase 2:** Mock API & Simulation Engine (Great Circle path math, dynamic flight generator, SSE stream)
- [ ] **Phase 3:** Interactive Radar Map (MapLibre GL WebGL, custom aircraft markers, smooth heading rotation)
- [ ] **Phase 4:** UI Dashboard & Cockpit Instrumentation (Flight search, telemetry gauges, airport FIDS boards)
- [ ] **Phase 5:** Polish & Production Real API Readiness
