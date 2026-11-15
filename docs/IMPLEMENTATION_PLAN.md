# Circuit Breaker & LocalFallback Architecture for NASA Telemetry

This document captures the approved architectural plan for refactoring the NASA telemetry client with a deterministic **Circuit Breaker state machine** and an immutable **`LocalFallback` constant bundle**, ensuring the application remains 100% functional with zero network stalls or errors when NASA endpoints fail, time out, or run in offline/restricted environments.

---

### Confirmed Design Decisions

- **Per-Endpoint Circuit Breakers (5-Minute Cooldown):** Maintain independent circuit breakers for **DONKI** (solar flare telemetry) and **APOD** (astronomy photo feed) so an outage in one NASA service never blocks live data from the other, with a `300,000 ms` (5-minute) open-state cooldown before allowing a `HALF_OPEN` recovery probe.
- **Immediate Offline Bypass:** When the runtime detects offline connectivity (`navigator.onLine === false`, missing `fetch`, or `?offline=1`), skip all `fetch()` calls immediately and return `LocalFallback` without waiting for network timeouts.
- **Immediate Trip (Threshold = 1) & Archived Status Continuity:** Trip the endpoint's circuit to `OPEN` on the **1st failure** (timeout, HTTP error, malformed JSON, or empty valid candidates) and keep the existing **`Archived Real NASA Data` (`status: 'archived'`)** badge across the footer and technical lineage panels without adding visual clutter.
- **Instant Photo Cycling During Open APOD Circuit:** When the player clicks **Draw Another NASA Photo** while the APOD circuit is `OPEN` (or the browser is offline), cycle instantly through the curated verified NASA photo pool inside `LocalFallback` without firing a network request until the 5-minute cooldown expires.

---

### 1. Overview & Core Concept

- **What It Does:** Replaces ad-hoc per-request fallbacks with an explicit `CLOSED → OPEN → HALF_OPEN` circuit breaker per NASA endpoint, backed by a frozen `LocalFallback` constant bundle containing verified NASA Mars telemetry (`OSDR OSD-120`, `Mars 2020 MEDA`, `DONKI Class X8.7`) and 5 curated NASA/JPL space photographs.
- **Target Audience / Persona:** Students, educators, and hackathon judges evaluating the mission in classrooms, restrictive school firewalls, offline kiosks, incognito windows, or during upstream NASA API outages/rate-limits.
- **Key Value:** Eliminates wasted 4-second timeouts on repeated navigations or photo draws once an outage is detected, guarantees instant 0 ms boot and responsive Screen 5 photo cycling, and keeps all existing anti-logo APOD filtering and cache-optional (`?nocache=1` / blocked storage) resilience intact.

---

### 2. User Experience & Visual Posture

- **Key User Flows:**
  1. **Instant Boot (0 ms):** The application initializes synchronously from `LocalFallback` so the Splash Screen and Mission Prologue render immediately with zero loading spinners.
  2. **Background Hydration / Circuit Evaluation:** On launch, each endpoint's circuit breaker evaluates environment connectivity (`navigator.onLine`), active in-memory/24h cache, and circuit state (`CLOSED`, `OPEN`, or `HALF_OPEN`) before deciding whether to execute a network probe or short-circuit directly to `LocalFallback`.
  3. **Live-to-Archived Degraded Continuity:** If both DONKI and APOD are `OPEN` or offline, gameplay across the Hangar, Sols 1–4, Commander Quack's local tutor, and Victory Passport runs uninterrupted using `LocalFallback` with the `🟡 Archived Real NASA Data` status badge.
  4. **Screen 5 Photo Redraws:** Clicking **Draw Another NASA Photo** pops from the in-memory batch pool if available; if empty and the APOD circuit is `OPEN` or offline, it immediately cycles to another verified `LocalFallback` NASA/JPL photo with zero network stall.
- **Visual Identity & Theme:** Preserves the **Ares Base Cosmic Slate / High-Contrast** aesthetic, typography, and clean footer status badges (`🟢 Live`, `🔵 Cache`, `🟡 Archived`) with no extra telemetry popups or error banners.
- **Interactive Feedback & Recovery:** Failed or undersized/logo images continue recovering silently via `LocalFallback` cycling and the local Martian crater SVG illustration, while `HALF_OPEN` probes automatically restore `CLOSED` live status if connectivity returns after 5 minutes.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Independent Per-Endpoint Breakers vs. Single Global Breaker:**
  - *Chosen Approach:* Separate circuit breaker state machines (`donki`, `apod`) stored in a unified registry.
  - *Why:* NASA APOD and GSFC CCMC DONKI run on separate infrastructure; if APOD hits `HTTP 429` or returns non-photographic media, DONKI solar flare telemetry can still load live (and vice versa).
  - *Alternatives Considered:* A single shared breaker would needlessly suppress healthy live data from DONKI whenever APOD rate-limits.
- **Decision 2 — In-Memory Breaker State + Safe Storage Bypass:**
  - *Chosen Approach:* Store circuit states (`CLOSED`, `OPEN`, `HALF_OPEN`), `openedAt` timestamps, and `failureCount` in module RAM, with cache persistence bypassed cleanly whenever storage is blocked or `?nocache=1` is set.
  - *Why:* Ensures zero `SecurityError` or `QuotaExceededError` in restricted judge environments while protecting against repeated failing fetches across clicks, mount cycles, and soft transitions within a session.
  - *Alternatives Considered:* Mandatory storage persistence for breaker timestamps would risk failing or misbehaving when judges test with storage disabled.
- **Decision 3 — Immutable `LocalFallback` Bundle Constant:**
  - *Chosen Approach:* Consolidate `FALLBACK_FLARE`, `VERIFIED_NASA_MEMORIES[0]`, `CURATED_OSDR`, and `CURATED_MEDA` into a strongly typed, frozen `LocalFallback` constant bundle returned via safe shallow clones (`getArchivedFallbackBundle()`).
  - *Why:* Guarantees deterministic, zero-hallucination baseline telemetry at all times and prevents accidental runtime mutation of fallback constants across mission resets or APOD photo swaps.

---

### 4. Technical Architecture & Data Strategy

#### Circuit Breaker & Data Lineage Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                   Immutable LocalFallback Constant Bundle                 │
│  • DONKI X8.7 Flare  • OSDR OSD-120  • Mars MEDA (-85°C, τ=0.85, 14m)     │
│  • 5 Verified NASA/JPL Photographs (zero logos / zero broken links)       │
└───────────────────────────────┬───────────────────────────────────────────┘
                                │ Synchronous 0 ms init + Short-Circuit Data
                                ▼
┌───────────────────────────────────────────────────────────────────────────┐
│              NASA Telemetry Service & Per-Endpoint Breakers               │
│                                                                           │
│  1. Environment & Cache Pre-Check                                         │
│     ├─ navigator.onLine === false / ?offline=1 ──▶ Return LocalFallback   │
│     └─ Fresh RAM / 24h Cache hit? ───────────────▶ Return Cache Bundle    │
│                                                                           │
│  2. Endpoint Circuit State Machine (Independent: DONKI & APOD)            │
│     ┌────────┐  1st failure / timeout / invalid   ┌──────────────────┐    │
│     │ CLOSED │ ─────────────────────────────────▶ │ OPEN (5-min TTL) │    │
│     └────────┘                                    └──────────────────┘    │
│         ▲                                                  │              │
│         │ Probe succeeds                         5 min elapsed            │
│         │                                                  ▼              │
│     ┌───────────┐  Probe fails                    ┌───────────┐           │
│     │ HALF_OPEN │ ──────────────────────────────▶ │ Re-OPEN   │           │
│     └───────────┘                                 └───────────┘           │
│                                                                           │
│  3. In-Flight Deduplication + Anti-Logo APOD Pool (count=6)               │
│     └─ Concurrent boot requests share 1 promise; unused valid photos      │
│        stay in RAM pool; OPEN state skips fetch() completely              │
└───────────────────────────────┬───────────────────────────────────────────┘
                                │ Resolved NasaDataBundle
                                ▼
┌───────────────────────────────────────────────────────────────────────────┐
│               Game State, Screen 5 APOD Card & Local Tutor                │
│  • Footer badge stays clean: 🟢 Live | 🔵 Cache | 🟡 Archived             │
│  • "Draw Another NASA Photo": pops RAM pool ▶ cycles LocalFallback if OPEN│
│  • Half-open probe automatically restores CLOSED live status after 5 min  │
└───────────────────────────────────────────────────────────────────────────┘
```

#### Data Model & State
- **`CircuitState` (`'CLOSED' | 'OPEN' | 'HALF_OPEN'`):** Tracks operational readiness per NASA endpoint (`'donki'` and `'apod'`).
- **`EndpointCircuitStatus`:** Holds `{ state: CircuitState; failureCount: number; openedAt: number | null; lastFailureReason?: string }`.
- **`LocalFallback` (`Readonly<NasaDataBundle>`):** Frozen constant object containing deterministic verified Mars science telemetry (`status: 'archived'`, `donkiFlare`, `apod`, `osdr`, `meda`) alongside the frozen 5-item `VERIFIED_NASA_MEMORIES` array used for rotation.
- **Offline & Test Controls:** `isEnvironmentOffline()` evaluates `navigator.onLine === false`, unavailable `fetch`, or `?offline=1` / `?nasa=offline` for deterministic offline verification.

#### Interactive Component & State Mapping
- **App Boot:** Synchronously seeds React state from `getArchivedFallbackBundle()` (which clones `LocalFallback`), then calls deduplicated `loadResilientNasaData()` asynchronously; even if both breakers trip or the environment is offline, React state stays functional with `status: 'archived'` and zero unhandled rejections.
- **Screen 5 Victory ("Draw Another NASA Photo"):** Calls `fetchRandomNasaApod(currentUrl)`. First checks the in-memory validated photo pool; if empty, checks the APOD breaker (`canAttemptEndpoint('apod')`). If `OPEN` or offline, it skips `fetch()` completely and immediately returns an unseen `LocalFallback` verified NASA photo so the UI remains responsive.
- **Footer & Technical Lineage Panels:** Consume `nasaData.status` (`'live' | 'cache' | 'archived'`) seamlessly with zero UI breaking changes, keeping the `Archived Real NASA Data` badge consistent whenever `LocalFallback` is active.
